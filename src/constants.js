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
  MAIL_EXPIRATION_TIME: 10 * 60 * 1000, // 10 min
  MAIL_LINK_SEPARATOR: '_',

  // REDIRECT_URL: mode === 'development' ? 'http://tfc-survival.ru:3000' : 'https://tfc-survival.ru',
  // ORIGIN_URL: mode === 'development' ? 'http://localhost:5001' : 'https://tfc-survival.ru:3001',

  REDIRECT_URL: mode === 'development' ? 'http://tfc-survival.ru:3000' : 'https://tfc.su',
  ORIGIN_URL: mode === 'development' ? 'http://localhost:5001' : 'https://tfc.su:3001',

  SERVER_FOLDER: '/home/xelo/Desktop/server',
  PLAYERS_DATA_PATH: '/home/xelo/Desktop/server/world/playerdata',
  PLAYERS_STATS_PATH: '/home/xelo/Desktop/server/world/stats',

  VK_GROUP: 204055073,
  VK_API_VERSION: '5.124'
}
