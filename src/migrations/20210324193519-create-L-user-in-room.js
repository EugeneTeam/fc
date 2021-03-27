'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LUserInRooms', {
      roleId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    });
  },

  down: async queryInterface => {
     await queryInterface.dropTable('LUserInRooms');
  }
};
