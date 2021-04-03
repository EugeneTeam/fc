'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ItemCharacteristics', {
      id: {
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      characteristicId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      value: {
        allowNull: false,
        type: Sequelize.FLOAT
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('ItemCharacteristics');
  }
};
