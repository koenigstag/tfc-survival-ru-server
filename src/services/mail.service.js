const createHttpError = require('http-errors');
const nodemailer = require('nodemailer');
const fs = require('fs/promises');
const path = require('path');
const { find } = require('lodash');
const CONSTANTS = require('../constants');

const transporter = nodemailer.createTransport({
  // host: process.env.SMTP_HOST,
  // port: process.env.SMTP_PORT,
  service: 'gmail',
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports.createActivationLink = (uuid) => {
  return uuid + "^" + Date.now();
}

module.exports.checkMailExpire = async link => {
  const timestamp = link.split('^')[1];

  if (Date.now() >= timestamp + CONSTANTS.MAIL_EXPIRATION_TIME) {
    return false;
  }

  return true;
};

module.exports.sendActivationMail = async (to, link) => {
  const href = `${CONSTANTS.REDIRECT_URL}/activate-email/?link=${link}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Активация аккаунта на сайте ' + CONSTANTS.REDIRECT_URL,
    text: '',
    html: `
            <div>
                <h1>Для активации перейдите по ссылке</h1>
                <h2>Время жизни ссылки 5 минут</h2>
                <div><a href="${href}">${href}</a></div>
            </div>
        `,
  });
};
