'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LPlayerSlots', {
      itemSlotId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        reference: {
          model: 'ItemSlots'
        }
      },
      itemId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Items'
        }
      },
      playerId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        reference: {
          model: 'Players'
        }
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('LPlayerSlots');
  }
};
