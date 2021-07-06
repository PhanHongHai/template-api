// bittech27@gmail.com - Bittech27!@#$%
import nodemailer from 'nodemailer';
const mailer = {
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'distancetrainingservice@gmail.com',
    pass: 'distancetraining'
  }
};
const transporter = nodemailer.createTransport({
  ...mailer
});
const SendMail = async (mailOptions: any) => {
  return transporter.sendMail(mailOptions)
}
const verifyAccountOptions = (options: any) => {
  return {
    from:mailer.auth.user,
    to: options.email,
    subject: `${options.title}`,
    text: 'Plaintext version of the message',
    html: `<p>${options.content}</p>`
  }
}
const sendNotificationOptions = (options: any) => {
  return {
    to: options.email,
    subject: `${options.title}`,
    text: 'Plaintext version of the message',
    html: `<p>${options.content}</p>`
  }
}
export {
  SendMail,
  verifyAccountOptions,
  sendNotificationOptions
};