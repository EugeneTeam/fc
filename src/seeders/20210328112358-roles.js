'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('Roles', [
        {id: 'Admin', name: 'Admin'},
        {id: 'User', name: 'User'},
        {id: 'Room-manager', name: 'Room-manager'},
        {id: 'Room-member', name: 'Room-member'},
        {id: 'Room-administrator', name: 'Room-administrator'},
        ], {});
  },

  down: async queryInterface => {
     await queryInterface.bulkDelete('Roles', null, {});
  }
};
