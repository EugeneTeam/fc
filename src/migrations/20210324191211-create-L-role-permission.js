'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LRolePermissions', {
      role: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.STRING,
        references: {
          model: 'Roles'
        },
        onDelete: 'CASCADE'
      },
      permissionId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Permissions'
        },
        onDelete: 'CASCADE'
      }
    });
  },

  down: async queryInterface => {
     await queryInterface.dropTable('LRolePermissions');
  }
};
