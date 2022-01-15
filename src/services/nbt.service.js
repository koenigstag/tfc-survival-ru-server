const fs = require("fs/promises");
const nbtModule = require("nbt");
const {
  SERVER_FOLDER,
  PLAYERS_DATA_PATH,
  PLAYERS_STATS_PATH,
} = require("../constants");

module.exports.getUsersData = async () => {
  const files = await fs.readdir(PLAYERS_DATA_PATH);

  const playersData = [];

  if (files.length) {
    for (const file of files) {
      const content = await fs.readFile(`${PLAYERS_DATA_PATH}/${file}`);

      nbtModule.parse(content, (error, data) => {
        if (error) throw error;

        playersData.push(data.value);
      });
    }
  }

  return playersData;
};

module.exports.getUsersStats = async () => {
  const files = await fs.readdir(PLAYERS_STATS_PATH);
  const nicks = JSON.parse(await fs.readFile(`${SERVER_FOLDER}/usernamecache.json`, 'utf-8'));

  const playersStats = [];

  if (files.length) {
    for (const file of files) {
      const content = await fs.readFile(`${PLAYERS_STATS_PATH}/${file}`);

      playersStats.push({
        ...JSON.parse(content),
        nickname: nicks[file.replace(".json", "")],
      });
    }
  }

  return playersStats;
};
