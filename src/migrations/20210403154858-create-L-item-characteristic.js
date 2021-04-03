'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LItemCharacteristics', {
      itemCharacteristicId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'ItemCharacteristics'
        }
      },
      itemId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Items'
        }
      },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('LItemCharacteristics');
  }
};
