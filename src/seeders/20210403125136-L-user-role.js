'use strict';

const models = require('../models');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('LUserRoles', [
        {role: 'User', userId: 1 },
        {role: 'Admin', userId: 1 },
        ], {});
  },

  down: async queryInterface => {
     await queryInterface.bulkDelete('LUserRoles', null, {});
  }
};
