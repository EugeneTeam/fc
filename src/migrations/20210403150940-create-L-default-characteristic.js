'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LDefaultCharacteristics', {
      characterTypeId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'CharacterTypes'
        }
      },
      characteristicId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Characteristics'
        },
        onDelete: 'CASCADE'
      },
      value: {
        allowNull: false,
        type: Sequelize.FLOAT
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('LDefaultCharacteristics');
  }
};
