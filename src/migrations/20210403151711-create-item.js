'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      imageUrl: {
        allowNull: false,
        type: Sequelize.STRING
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('Items');
  }
};
