'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LGainsConstants', {
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
        }
      },
      value: {
        allowNull: false,
        type: Sequelize.FLOAT
      }
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('LGainsConstants');
  }
};
