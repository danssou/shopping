import { transporter as t } from '@/utils';
import { accountEmail } from '@/utils/config/nodemailer';
import nodemailer from 'nodemailer';

type EmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};



export async function sendEmail(opts: EmailOptions) {
  const transporter = t as nodemailer.Transporter;

  const message = {
    from: accountEmail,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  };

  const info = await transporter.sendMail(message);
  return info;
}

export default sendEmail;
