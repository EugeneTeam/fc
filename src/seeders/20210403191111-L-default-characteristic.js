'use strict';

const models = require('../models');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('LDefaultCharacteristics', [
        // типа персонажа    // характеристика    // значение
        {characterTypeId: 1, characteristicId: 1, value: 5},
        {characterTypeId: 1, characteristicId: 2, value: 3},
        {characterTypeId: 1, characteristicId: 3, value: 10},
        {characterTypeId: 1, characteristicId: 4, value: 1.5},
        {characterTypeId: 1, characteristicId: 5, value: 500},

        {characterTypeId: 2, characteristicId: 1, value: 3},
        {characterTypeId: 2, characteristicId: 2, value: 5},
        {characterTypeId: 2, characteristicId: 3, value: 10},
        {characterTypeId: 2, characteristicId: 4, value: 1.5},
        {characterTypeId: 2, characteristicId: 5, value: 650},

        {characterTypeId: 3, characteristicId: 1, value: 3},
        {characterTypeId: 3, characteristicId: 2, value: 1.5},
        {characterTypeId: 3, characteristicId: 3, value: 10},
        {characterTypeId: 3, characteristicId: 4, value: 1.5},
        {characterTypeId: 3, characteristicId: 5, value: 350},
    ], {});
  },

  down: async queryInterface => {
     await queryInterface.bulkDelete('LDefaultCharacteristics', null, {});
  }
};
