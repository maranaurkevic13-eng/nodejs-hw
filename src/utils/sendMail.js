import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT), // ✅ конвертуємо у число
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_FROM) {
    throw new Error("SMTP_FROM is not defined in environment variables");
  }

  return transporter.sendMail({
    from: process.env.SMTP_FROM, 
    to,
    subject,
    html,
  });
};
