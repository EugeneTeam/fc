'use strict';

const models = require('../models');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('CharacterTypes', [
        {
            name: 'Berserk',
            description: '...',
            imageUrl: 'http://www.pngall.com/wp-content/uploads/4/Japanese-Samurai-Warrior-PNG-Image.png',
        },
        {
            name: 'Viking',
            description: '...',
            imageUrl: 'https://toppng.com/uploads/preview/viking-warrior-11549396539rhrtbesdvj.png',
        },
        {
            name: 'Mage',
            description: '...',
            imageUrl: 'https://i.pinimg.com/originals/22/b0/d1/22b0d1edb14d2c4a4b629afcfae0d4ed.png',
        },
    ], {});
  },

  down: async queryInterface => {
     await queryInterface.bulkDelete('CharacterTypes', null, {});
  }
};
