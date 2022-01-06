const fs = require('fs/promises');
const nbtModule = require('nbt');
const { PLAYERS_DATA_PATH } = require('../constants');

module.exports.getUsersNbt = async () => {
  const files = fs.readdir(PLAYERS_DATA_PATH);

  const playersData = [];

  for (const file of files) {
    const content = await fs.readFile(file);

    nbtModule.parse(content, (error, data) => {
      if (error) throw error;

      playersData.push(data);
    });
  }

  return playersData;
};
