const {
  env: {
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_TIME,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_TIME,
    ADMIN_TOKEN_SECRET,
    ADMIN_TOKEN_TIME,
    NODE_ENV,
  }
} = process;

const mode = NODE_ENV || 'development';

module.exports = {
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_TIME,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_TIME,
  ADMIN_TOKEN_SECRET,
  ADMIN_TOKEN_TIME,

  MAX_DEVICE_AMOUNT: 3,
  SALT_ROUNDS: 6,
  MAIL_EXPIRATION_TIME: 5 * 60 * 1000, // 5 min

  REDIRECT_URL: mode === 'development' ? 'http://localhost:3000' : 'http://tfc-survival.ru',
  ORIGIN_URL: mode === 'development' ? 'http://localhost:5001' : 'http://tfc-survival.ru:5000'
}
