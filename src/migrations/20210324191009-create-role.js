'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.STRING,
        unique: true
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
    });
  },

  down: async queryInterface => {
     await queryInterface.dropTable('Roles');
  }
};
