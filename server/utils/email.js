//server/utils/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname emulation in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// now points at your server/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });


const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS
  }
});


// Verify SMTP connection at startup:
transporter.verify()
  .then(() => console.log('✅ SMTP connection ready'))
  .catch(err => console.error('❌ SMTP connection error:', err));


export const sendOTP = async (email, otp) => {
  console.log('[sendOTP] sending to:', email, 'code:', otp);
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your Verification Code – Swarup Workspace',
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#333;">
        <!-- Logo -->
        <div style="text-align:center;padding:20px 0;">
          <img 
            src="${process.env.CLIENT_URL}/assets/icon.png" 
            alt="Swarup Workspace Logo" 
            style="width:100%;height:auto;display:block;" 
          />
        </div>

        <!-- Hero Image -->
        <div style="width:100%;overflow:hidden;">
          <img 
            src="https://images.pexels.com/photos/374710/pexels-photo-374710.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350&w=600" 
            alt="Office Building" 
            style="width:100%;height:auto;display:block;" 
          />
        </div>

        <!-- Greeting & OTP -->
        <div style="padding:30px 20px;">
          <h1 style="font-size:24px;margin-bottom:10px;">Welcome to Swarup Workspace!</h1>
          <p style="font-size:16px;line-height:1.5;margin-bottom:20px;">
            Thank you for signing up. To complete your registration, please use the following One‑Time Password (OTP):
          </p>
          <p 
            style="
              font-size:32px;
              font-weight:bold;
              text-align:center;
              margin:20px 0;
              letter-spacing:4px;
            "
          >
            ${otp}
          </p>
          <p style="font-size:14px;line-height:1.4;color:#666;">
            This code will expire in <strong>10 minutes</strong>. If you did not initiate this request, please ignore this email.
          </p>
        </div>

        <!-- Secondary Image -->
        <div style="width:100%;overflow:hidden;">
          <img 
            src="https://images.pexels.com/photos/3182822/pexels-photo-3182822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=250&w=600" 
            alt="Team Collaboration" 
            style="width:100%;height:auto;display:block;" 
          />
        </div>

        <!-- Footer -->
        <div style="padding:20px;text-align:center;font-size:12px;color:#999;">
          <p>Swarup Workspace, Inc. • 123 Productivity Ave, Tech City</p>
          <p>
            <a href="${process.env.CLIENT_URL}/privacy" style="color:#999;text-decoration:underline;">Privacy Policy</a> | 
            <a href="${process.env.CLIENT_URL}/terms" style="color:#999;text-decoration:underline;">Terms of Service</a>
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully, messageId=', info.messageId);
    console.log('  Envelope:', info.envelope);
    console.log('  Accepted:', info.accepted, 'Rejected:', info.rejected);
    return info;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
};
