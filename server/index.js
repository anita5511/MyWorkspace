//workspace/server/index.js
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { sendOTP, sendPasswordResetEmail } from './utils/email.js';

// Setup __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });
const CLIENT_URL = process.env.CLIENT_URL;
if (!CLIENT_URL) {
  console.warn('⚠️  CLIENT_URL not set in .env');
}

// DB
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// JWT
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, process.env.PRIVATE_KEY_PATH), 'utf8');
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, process.env.PUBLIC_KEY_PATH), 'utf8');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const app = express();
app.use(cookieParser());

console.log('CLIENT_URL is:', CLIENT_URL);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
  })
);
 
// allow up to 10 MB JSON payloads (adjust as needed)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve face-api.js model files from /models
app.use(
  '/models',
  express.static(path.join(__dirname, 'models', 'weights'))
);

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Auth middleware
const authenticate = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Auth required' });
  try {
    const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    req.user = payload;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Init tables
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS otps (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      code TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS face_data (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      descriptor JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);
})();

// Helpers
const isProd = process.env.NODE_ENV === 'production';

const setTokenCookie = (res, token, expiresAt) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
    expires: new Date(expiresAt)
  });
};

// Euclidean distance function for face comparison
function euclideanDistance(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    throw new Error('Both descriptors must be arrays');
  }
  if (a.length !== b.length) {
    throw new Error('Descriptors must have the same length');
  }
  
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

// Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  try {
    // 1) Check if this email is already registered
    const { rows: existing } = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: 'This email is already registered.' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP (without user_id since user doesn't exist yet)
    await pool.query(
      'INSERT INTO otps (user_id, code, expires_at) VALUES ($1, $2, $3)',
      [null, otp, expiresAt]
    );

    // Send OTP email
    console.log('[route /send-otp] about to call sendOTP for:', email);
    await sendOTP(email, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const { rows } = await pool.query(
      `SELECT o.*, u.id as user_id 
       FROM otps o 
       LEFT JOIN users u ON u.email = $1 
       WHERE o.code = $2 
       AND o.expires_at > NOW()
       ORDER BY o.created_at DESC 
       LIMIT 1`,
      [email, otp]
    );

    if (!rows.length) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Delete used OTP
    await pool.query('DELETE FROM otps WHERE id = $1', [rows[0].id]);
    res.json({ valid: true, userId: rows[0].user_id });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Save face data
app.post('/api/auth/save-face', authenticate, async (req, res) => {
  const { descriptor } = req.body;
  try {
    // Ensure descriptor is an array
    if (!Array.isArray(descriptor)) {
      return res.status(400).json({ message: 'Face descriptor must be an array' });
    }

    await pool.query(
      'INSERT INTO face_data (user_id, descriptor) VALUES ($1, $2)',
      [req.user.sub, JSON.stringify(descriptor)]
    );
    res.json({ message: 'Face data saved successfully' });
  } catch (err) {
    console.error('Save face error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Verify face
app.post('/api/auth/verify-face', async (req, res) => {
  const { userId, descriptor: probe } = req.body;
  
  try {
    if (!Array.isArray(probe)) {
      return res.status(400).json({ message: 'Face descriptor must be an array' });
    }

    const { rows } = await pool.query(
      'SELECT descriptor FROM face_data WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    
    if (!rows.length) {
      return res.status(400).json({ message: 'No face enrolled' });
    }

    const gallery = rows[0].descriptor; // This should be a JSON array
    const dist = euclideanDistance(probe, gallery);
    
    if (dist < 0.6) {
      return res.json({ valid: true });
    } else {
      return res.status(401).json({ valid: false, message: 'Face did not match' });
    }
  } catch (err) {
    console.error('Verify face error:', err);
    res.status(500).json({ message: 'Face verification failed' });
  }
});


// Face login — issue JWT on successful face match
app.post('/api/auth/face-login', async (req, res) => {
  
  try {
    
    const { email, descriptor: probe } = req.body;
    if (!email || !Array.isArray(probe)) {
      return res.status(400).json({ message: 'email and descriptor array are required' });
    }
    
    const { rows: userRows } = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (!userRows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userId = userRows[0].id;
    // 2. Fetch latest enrolled face descriptor
    const { rows } = await pool.query(
      'SELECT descriptor FROM face_data WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    if (!rows.length) {
      return res.status(400).json({ message: 'No face enrolled for this user' });
    }

    const gallery = rows[0].descriptor;
    const dist = euclideanDistance(probe, gallery);
    if (dist >= 0.6) {
      return res.status(401).json({ message: 'Face did not match' });
    }

    // 3. Generate JWT just like password login
    const jwtId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const token = jwt.sign(
      { sub: userId, jti: jwtId },
      PRIVATE_KEY,
      { algorithm: 'RS256', expiresIn: JWT_EXPIRES_IN }
    );
    setTokenCookie(res, token, expiresAt);

    // 4. Return user info
    const { rows: [user] } = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    );
    res.json({ message: 'Logged in via face', user });

  } catch (err) {
    console.error('Face login error:', err);
    res.status(500).json({ message: err.message || 'Face login failed' });
  }
});


// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, faceDescriptor } = req.body;
  
  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const { rows: existing } = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password and create user
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id',
      [name, email, hash]
    );

    const userId = rows[0].id;

    // Save face descriptor if provided
    if (faceDescriptor && Array.isArray(faceDescriptor)) {
      await pool.query(
        'INSERT INTO face_data (user_id, descriptor) VALUES ($1, $2)',
        [userId, JSON.stringify(faceDescriptor)]
      );
      console.log('Face descriptor saved for user:', userId);
    }

    // Generate JWT and set cookie
    const jwtId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const token = jwt.sign({ sub: userId, jti: jwtId }, PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: JWT_EXPIRES_IN
    });
    
    setTokenCookie(res, token, expiresAt);

    // Return user data
    const { rows: [user] } = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    res.json({ message: 'Registration successful', user });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!rows.length) throw new Error('Invalid credentials');
    
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) throw new Error('Invalid credentials');

    const userId = rows[0].id;
    const jwtId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const token = jwt.sign({ sub: userId, jti: jwtId }, PRIVATE_KEY, { 
      algorithm: 'RS256', 
      expiresIn: JWT_EXPIRES_IN 
    });
    
    setTokenCookie(res, token, expiresAt);
    
    const { rows: [user] } = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    res.json({ message: 'Logged in', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Forgot password
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ sub: rows[0].id }, PRIVATE_KEY, { 
      algorithm: 'RS256', 
      expiresIn: '1h' 
    });

    await sendPasswordResetEmail(email, token);
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset password
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    const hash = await bcrypt.hash(password, 10);
    
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hash, payload.sub]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Logout
app.post('/api/auth/logout', authenticate, async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// Protected example
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const { rows: [user] } = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.sub]
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start
const PORT = process.env.PORT || 12000;
app.listen(PORT, () => {
   console.log(`Workspace server running on port ${PORT}`);
});
