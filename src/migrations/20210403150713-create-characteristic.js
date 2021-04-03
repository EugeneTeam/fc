'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Characteristics', {
      id: {
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('Characteristics');
  }
};
