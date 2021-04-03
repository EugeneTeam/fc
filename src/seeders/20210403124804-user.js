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
            nickname: 'admin1',
            email: 'test@test.com1',
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
