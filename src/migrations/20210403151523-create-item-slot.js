'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ItemSlots', {
      id: {
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      itemTypeId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      imageUrl: {
        allowNull: false,
        type: Sequelize.STRING
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('ItemSlots');
  }
};
