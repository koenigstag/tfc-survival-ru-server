const axios = require("axios");
const path = require("path");
const fs = require("fs/promises");
const { SERVER_FOLDER, VK_GROUP, VK_API_VERSION } = require("../constants");

module.exports.getBannedPlayers = async (req, res, next) => {
  try {
    const bannedPlayers = await fs.readFile(
      `${SERVER_FOLDER}/banned-players.json`
    );
    const list = JSON.parse(bannedPlayers) || [];

    res.status(200).send({ data: list });
  } catch (error) {
    next(error);
  }
};

module.exports.getVKNews = async (req, res, next) => {
  try {
    // получить новости из вк
    const vkURL = `https://api.vk.com/method/wall.get?owner_id=-${VK_GROUP}&filter=owner&access_token=${process.env.VK_ACCESS_TOKEN}&v=${VK_API_VERSION}`;
    const response = await axios.get(vkURL);

    // отправить новости как данные
    if (response.data) {
      res.status(200).send(response.data.response.items.slice(0, 10));
    }
  } catch (error) {}
};
