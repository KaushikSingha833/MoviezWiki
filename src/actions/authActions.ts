"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  try {
    const mailOptions = {
      from: `"MoviezWiki Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your MoviezWiki Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #121212; color: white; padding: 40px; border-radius: 12px; text-align: center;">
          <h2 style="color: #F5C518; margin-bottom: 20px;">MoviezWiki Security Verification</h2>
          <p style="font-size: 16px; color: #a3a3a3; margin-bottom: 10px;">Use the following 6-digit code to complete your verification.</p>
          <p style="font-size: 14px; color: #737373;">This code will expire in 10 minutes. Do not share this code with anyone.</p>
          <div style="margin: 30px auto; padding: 20px; background-color: #1e1e1e; font-size: 36px; font-weight: bold; letter-spacing: 12px; border-radius: 8px; color: white; width: fit-content; border: 1px solid #333;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 40px;">If you did not request this, please ignore this email or contact support.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
