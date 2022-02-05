const fs = require("fs/promises");
const _ = require("lodash");
const nbtModule = require("nbt");
const path = require("path");
const filterStats = require("../../misc/filtered-stats.json");
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

const preparedStatsPath = path.resolve(
  __dirname,
  "../../misc/prepared-stats.json"
);

module.exports.getUsersStats = async (page, rows) => {
  const prepPage = Number(page);
  const prepRows = Number(rows);

  let preparedStats = JSON.parse(await fs.readFile(preparedStatsPath, "utf-8"));

  const verdict = await cacheStats(preparedStats);
  if (verdict) {
    preparedStats = JSON.parse(await fs.readFile(preparedStatsPath, "utf-8"));
  }

  const pageContent = preparedStats.stats
    .sort((item1, item2) => {
      const num1 = Number(item1["stat.playOneMinute"]);
      const num2 = Number(item2["stat.playOneMinute"]);

      if (num1 < num2) {
        return 1;
      }
      if (num1 > num2) {
        return -1;
      }
      return 0;
    })
    .slice((prepPage - 1) * prepRows, (prepPage - 1) * prepRows + prepRows);

  return {
    stats: pageContent,
    pages: Math.max(Math.ceil(preparedStats.stats.length / rows), 1),
  };
};

const cacheStats = async (preparedStats) => {
  if (Date.now() / 1000 - preparedStats.timestamp > 3600) {
    const stats = await readStatsFiles();

    const jsonStats = JSON.stringify(
      {
        timestamp: Math.floor(Date.now() / 1000),
        stats,
      },
      null,
      2
    );

    await fs.writeFile(preparedStatsPath, jsonStats, "utf-8");
    return true;
  }

  return false;
};

const readStatsFiles = async () => {
  const files = await fs.readdir(PLAYERS_STATS_PATH);
  const nicks = JSON.parse(
    await fs.readFile(`${SERVER_FOLDER}/usernamecache.json`, "utf-8")
  );

  const playersStats = [];

  if (files.length) {
    for (const file of files) {
      const content = await fs.readFile(`${PLAYERS_STATS_PATH}/${file}`);

      playersStats.push({
        ..._.pick(JSON.parse(content), filterStats),
        nickname: nicks[file.replace(".json", "")],
      });
    }
  }

  return playersStats;
};
