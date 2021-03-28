'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      nickname: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        }
      },
      passwordHash: {
        type: Sequelize.STRING
      },
      authKey: {
        type: Sequelize.STRING
      },
      resetKey: {
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'BANNED')
      },
      banReason: {
        type: Sequelize.STRING
      },
      activationKey: {
        type: Sequelize.STRING
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'Roles'
        },
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
     await queryInterface.dropTable('Users');
  }
};
