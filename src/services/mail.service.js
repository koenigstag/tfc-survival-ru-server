const nodemailer = require('nodemailer');
const CONSTANTS = require('../constants');

const transporter = nodemailer.createTransport({
  // host: process.env.SMTP_HOST,
  // port: process.env.SMTP_PORT,
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports.createActivationLink = uuid => {
  return uuid + CONSTANTS.MAIL_LINK_SEPARATOR + Date.now();
};

module.exports.checkMailExpire = async link => {
  const timestamp = link.split(CONSTANTS.MAIL_LINK_SEPARATOR)[1];

  if (Date.now() >= timestamp + CONSTANTS.MAIL_EXPIRATION_TIME) {
    return false;
  }

  return true;
};

module.exports.sendActivationMail = async (to, link, nickname) => {
  const href = `${CONSTANTS.REDIRECT_URL}/activate-email/?link=${link}`;

  const linkExpirationMinutes = CONSTANTS.MAIL_EXPIRATION_TIME / 1000 / 60;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Активация аккаунта '${nickname}' на сайте ${CONSTANTS.REDIRECT_URL}`,
    text: '',
    html: `
            <article>
                <h2>Регистрация аккаунта '${nickname}' на сайте ${CONSTANTS.REDIRECT_URL}</h2>
                <p>Для активации перейдите по ссылке</p>
                <strong>Время жизни ссылки ${linkExpirationMinutes} минут</strong>
                <div><a href="${href}">${href}</a></div>
            </article>
        `,
  });
};
