'use strict';

const models = require('../models');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('Characteristics', [
        {name: 'agility'},
        {name: 'strength'},
        {name: 'intelligence'},
        {name: 'armor'},
        {name: 'hp'},
    ], {});
  },

  down: async queryInterface => {
     await queryInterface.bulkDelete('Characteristics', null, {});
  }
};
