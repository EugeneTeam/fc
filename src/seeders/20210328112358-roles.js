'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('Roles', [
        {id: 'User', name: 'User'},
        {id: 'Admin', name: 'Admin'},
        ], {});
  },

  down: async queryInterface => {
     await queryInterface.bulkDelete('Roles', null, {});
  }
};
