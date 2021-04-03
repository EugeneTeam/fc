'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('LRolePermissions', [
        {
            role: 'User',
            permissionId: 2
        },
        ], {});
  },

  down: async queryInterface => {
     await queryInterface.bulkDelete('LRolePermissions', null, {});
  }
};
