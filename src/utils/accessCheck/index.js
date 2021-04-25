const models = require('../../models');
const {ApolloError} = require('apollo-server-express');
const {pushError} = require('../../errors/errorsHandler');

module.exports = {
    authorizationCheck: async (req) => {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ');
            if (token[0] === 'Bearer' && token[1]) {
                const result = await models.User.decodeToken(token[1])
                pushError('TOKEN', 'EXPIRED', result && result.message === 'Token expired')
                const user = await models.User.findOne({
                    where: {
                        authToken: result
                    },
                    include: {
                        model: models.Role,
                        include: {
                            model: models.Permission
                        }
                    }
                });

                pushError('USER','NOT_AUTHORIZE', !user);
                pushError('USER','ACCOUNT_IS_INACTIVE', user.status === 'INACTIVE');
                return user;
            }
        }
        pushError('USER','NOT_AUTHORIZE');
    }
}
