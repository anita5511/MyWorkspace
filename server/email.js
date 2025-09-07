// server/email.js
import nodemailer from 'nodemailer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const {
  BREVO_SMTP_HOST,
  BREVO_SMTP_PORT,
  BREVO_SMTP_USER,
  BREVO_SMTP_PASS,
  SMTP_FROM
} = process.env;

// 1) Create the transporter
const transporter = nodemailer.createTransport({
  host: BREVO_SMTP_HOST,
  port: Number(BREVO_SMTP_PORT),
  secure: false,               // upgrade later with STARTTLS
  auth: {
    user: BREVO_SMTP_USER,
    pass: BREVO_SMTP_PASS
  }
});

// 2) Verify connection configuration at startup
transporter.verify()
  .then(() => console.log('✅ SMTP connection ready'))
  .catch(err => console.error('❌ SMTP connection error', err));

// 3) Export a helper to send the welcome email
export async function sendWelcomeEmail(toEmail, userName) {
  const mailOptions = {
    from: SMTP_FROM,            // e.g. "SwarupPlay <no-reply@yourdomain.com>"
    to: toEmail,
    subject: 'Welcome to Swarup Workspace!',
    html: `
      <h1>Hi ${userName}, welcome aboard!</h1>
      <p>Thanks for joining Swarup Workspace. We’re thrilled to have you.</p>
      <p>— The SwarupPlay Team</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✉️  Welcome email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Failed to send welcome email:', err);
    throw err;
  }
}
