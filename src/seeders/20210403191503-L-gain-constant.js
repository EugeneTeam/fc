'use strict';

const models = require('../models');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('LGainConstants', [
        {characterTypeId: 1, characteristicId: 1, value: 2},
        {characterTypeId: 1, characteristicId: 2, value: 1},
        {characterTypeId: 1, characteristicId: 3, value: 0},
        {characterTypeId: 1, characteristicId: 4, value: 0},
        {characterTypeId: 1, characteristicId: 5, value: 50},

        {characterTypeId: 2, characteristicId: 1, value: 1},
        {characterTypeId: 2, characteristicId: 2, value: 2},
        {characterTypeId: 2, characteristicId: 3, value: 0},
        {characterTypeId: 2, characteristicId: 4, value: 0},
        {characterTypeId: 2, characteristicId: 5, value: 60},

        {characterTypeId: 3, characteristicId: 1, value: 1},
        {characterTypeId: 3, characteristicId: 2, value: 1},
        {characterTypeId: 3, characteristicId: 3, value: 0},
        {characterTypeId: 3, characteristicId: 4, value: 0},
        {characterTypeId: 3, characteristicId: 5, value: 40},
    ], {});
  },

  down: async queryInterface => {
     await queryInterface.bulkDelete('LGainConstants', null, {});
  }
};
