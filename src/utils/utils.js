const {gql} = require("apollo-server")
const methodsList = require('./info')
const {ApolloError} = require('apollo-server')
const {USER, TOKEN} = require('../errors/errorsList')
const models = require('../models')

/**
 *
 * @param {object} body
 * @returns {string}
 */
getMethodName = body => gql`${body.query}`.definitions[0].selectionSet.selections[0].name.value

/**
 *
 * @param {array} definitions
 * @param {object} variables
 * @param {string} methodName
 * @returns {{}}
 */
createVariableList = (definitions, variables, methodName) => {
    let result = {}
    if (!definitions || !definitions.length || !Object.keys(variables)) {
        return result
    }
    for (const definition of definitions) {
        if (definition.selectionSet && definition.selectionSet.selections && definition.selectionSet.selections.length) {
            for (const selection of definition.selectionSet.selections) {
                if (selection.arguments && selection.arguments.length && selection.name.value === methodName) {
                    for (const argument of selection.arguments) {
                        result[argument.name.value] = variables[argument.value.name.value]
                    }
                }
            }
        }
    }
    return result
}

module.exports = {
    /**
     *
     * @param {object} body
     * @returns {string}
     */
    functionArgumentValidation: async ({body}) => {
        const methodName = getMethodName(body)
        const variables = createVariableList(gql`${body.query}`.definitions, body.variables, methodName)
        const info = methodsList.find(item => item.methodName === methodName);
        if (!info || (info && !info.validator)) {
            return methodName
        }
        const {messages, error} = await info.validator(variables)
        if (error && messages && messages.length) {
            throw new ApolloError('Validation Error', '400', {
                'errors': messages.map(item => ({
                    code: 400,
                    message: item
                }))
            })
        }

        return methodName
    },

    /**
     *
     * @param {string} methodName
     * @param {object} user
     * @returns {Promise<void>}
     */
    checkUserRights: async (methodName, user) => {
        const info = methodsList.find(item => item.methodName === methodName);
        const userPermissions = await user.getPermissionList()
        if (info) {
            if (info.permissions.length) {
                for (const permission of info.permissions) {
                    if (!userPermissions.includes(permission)) {
                        throw new ApolloError('Forbidden', USER.ACCESS_DENIED.code.toString(), {
                            'errors': [USER.ACCESS_DENIED]
                        })
                    }
                }
            }
        }
    },

    /**
     *
     * @param {object} req
     * @returns {Promise<Model<any, User>>}
     */
    checkUserAuthorization: async (req) => {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ');
            if (token[0] === 'Bearer' && token[1]) {
                const result = await models.User.decodeToken(token[1])

                if (result && result.message === 'Token expired') {
                    throw new ApolloError('Expired', TOKEN.EXPIRED.code.toString(), {
                        'errors': [TOKEN.EXPIRED]
                    })
                }

                const user = await models.User.findOne({
                    where: {
                        authToken: result
                    },
                    include: {
                        model: models.LUserRole,
                        include: {
                            model: models.Role,
                            include: {
                                model: models.LRolePermission,
                                include: {
                                    model: models.Permission
                                }
                            }
                        }
                    }
                });

                if (!user) {
                    throw new ApolloError('Not authorize', USER.NOT_AUTHORIZE.code.toString(), {
                        'errors': [USER.NOT_AUTHORIZE]
                    })
                }

                if (user.status === 'INACTIVE') {
                    throw new ApolloError('Account is inactive', USER.ACCOUNT_IS_INACTIVE.code.toString(), {
                        'errors': [USER.ACCOUNT_IS_INACTIVE]
                    })
                }

                return user;
            }
        }

        throw new ApolloError('Not authorize', USER.NOT_AUTHORIZE.code.toString(), {
            'errors': [USER.NOT_AUTHORIZE]
        })
    }
}
