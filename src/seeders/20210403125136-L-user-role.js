'use strict';

const models = require('../models');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('LUserRoles', [
        {role: 'Admin', userId: 1 },
        {role: 'User', userId: 2 },
        ], {});
  },

  down: async queryInterface => {
     await queryInterface.bulkDelete('LUserRoles', null, {});
  }
};
