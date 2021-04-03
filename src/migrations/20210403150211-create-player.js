'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Players', {
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
      characterTypeId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'CharacterTypes'
        },
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users'
        },
        onDelete: 'CASCADE'
      },
      agility: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      strength: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      intelligence: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      armor: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      hp: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      currentLevel: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      currentExperience: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      nextLevelExperience: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('Players');
  }
};
