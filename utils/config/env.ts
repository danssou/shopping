import { config } from 'dotenv';

config({path:`.env${process.env.NODE_ENV || 'development'}.local`});

export const {
    PORT,
    NODE_ENV,
    DATABASE_URL,
    GMAIL_APP_PASSWORD,
} = process.env;

// Ensure PORT is defined
if (!PORT) {
    throw new Error('PORT is not defined in environment variables');
}