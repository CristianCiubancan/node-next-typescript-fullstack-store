"use strict";
import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT as any) as number,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Happy Octopus 👻" <support@happyoctopus.net>',
    to,
    subject,
    html,
  });
}
