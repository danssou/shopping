import nodemailer from 'nodemailer';

type EmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function sendEmail(opts: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });

  const message = {
    from: process.env.SMTP_FROM || 'no-reply@example.com',
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  };

  const info = await transporter.sendMail(message);
  return info;
}

export default sendEmail;
