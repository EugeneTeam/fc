'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('Permissions', [
        {name: 'add-user-to-room'},
        {name: 'remove-user-from-room'},
        ], {});
  },

  down: async queryInterface => {
     await queryInterface.bulkDelete('Permissions', null, {});
  }
};
