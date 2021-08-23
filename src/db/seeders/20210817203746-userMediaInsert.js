'use strict';
const { UserMedia } = require('../models');


module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userMedia = [];
    for (let i = 0; i < 10; i++) {
      userMedia.push({
        skinSrc: `nick${i}Skin.png`,
        capeSrc: `nick${i}Cape.png`,
      });
    }
    await UserMedia.bulkCreate(userMedia);
  },

  down: async (queryInterface, Sequelize) => {},
};
