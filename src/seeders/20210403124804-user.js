'use strict';

const models = require('../models');

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('Users', [
        {
            nickname: 'admin',
            email: 'test@test.com',
            passwordHash: await models.User.encryptPassword('password'),
            authKey: null,
            resetKey: null,
            status: 'ACTIVE',
            banReason: null,
            activationKey: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            nickname: 'user',
            email: 'user@user.com',
            passwordHash: await models.User.encryptPassword('password'),
            authKey: null,
            resetKey: null,
            status: 'ACTIVE',
            banReason: null,
            activationKey: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        ], {});
  },

  down: async queryInterface => {
     await queryInterface.bulkDelete('Users', null, {});
  }
};
