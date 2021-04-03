'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LUserRoles', {
      role: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.STRING,
        references: {
          model: 'Roles'
        },
        onDelete: 'CASCADE'
      },
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users'
        },
        onDelete: 'CASCADE'
      }
    });
  },

  down: async queryInterface => {
     await queryInterface.dropTable('LUserRoles');
  }
};
