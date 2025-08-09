import { transporter } from "../lib/mailer";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, otp: string) {
  const mailOptions = {
    from: `"Vibes Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your One-Time Password (OTP) - Vibes",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #444; background-color: #111; color: #fff; border-radius: 8px;">
        <h2 style="color: #4f46e5;">Welcome to Vibes 👋</h2>
        <p>Hi there,</p>
        <p>To complete your request, please use the following One-Time Password (OTP):</p>
        <p style="font-size: 24px; font-weight: bold; background: #4f46e5; color: #fff; padding: 10px 20px; display: inline-block; border-radius: 6px;">${otp}</p>
        <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        <p>If you did not initiate this request, you can safely ignore this email.</p>
        <hr style="margin: 20px 0; border-color: #333;" />
        <p style="font-size: 12px; color: #aaa;">Need help? Contact our support team anytime.</p>
        <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} Vibes. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
