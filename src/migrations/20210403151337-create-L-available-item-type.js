'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ItemTypes', {
      itemTypeId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'ItemTypes'
        }
      },
      characterTypeId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'CharacterTypes'
        }
      },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('ItemTypes');
  }
};
