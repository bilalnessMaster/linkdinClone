import dotenv from 'dotenv';
dotenv.config()
import { MailtrapClient } from "mailtrap";
const TOKEN = process.env.MAILTRAP_TOKEN;


export const mailtrapClient  = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: process.env.EMAIL_FROM,
  name: process.env.NAME,
};

