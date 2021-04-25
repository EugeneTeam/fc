'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('Permissions', [
        {name: 'add-user-to-room'},
        {name: 'remove-user-from-room'},
        {name: 'add-characteristic'},
        
        {name: 'remove-characteristic'},
        {name: 'update-characteristic'},
        {name: 'info-characteristic'},
        {name: 'list-characteristic'},
        ], {});
  },

  down: async queryInterface => {
     await queryInterface.bulkDelete('Permissions', null, {});
  }
};
