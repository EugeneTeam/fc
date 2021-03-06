'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LUserInRooms', {
      role: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.STRING,
        references: {
          model: 'Roles'
        },
        onDelete: 'CASCADE'
      },
      userId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users'
        },
        onDelete: 'CASCADE'
      },
      roomId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Rooms'
        },
        onDelete: 'CASCADE'
      },
    });
  },

  down: async queryInterface => {
     await queryInterface.dropTable('LUserInRooms');
  }
};
