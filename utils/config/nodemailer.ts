import nodemailer from 'nodemailer';

export const accountEmail = 'brightdanssou@gmail.com';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export default transporter; 