import {gql} from "apollo-server";
import methodsList from './info';
import {ApolloError} from 'apollo-server';
import {USER, TOKEN} from '../errors/errorsList';
import models from '../models';

const getMethodName = body => gql`${body.query}`.definitions[0].selectionSet.selections[0].name.value

const createVariableList = (definitions, variables, methodName) => {
    let result = {}
    if (!definitions || !definitions.length || !Object.keys(variables)) {
        return result
    }
    for (const definition of definitions) {
        if (definition?.selectionSet?.selections?.length) {
            for (const selection of definition.selectionSet.selections) {
                if (selection?.arguments?.length && selection.name.value === methodName) {
                    for (const argument of selection.arguments) {
                        result[argument.name.value] = variables[argument?.value?.name?.value && argument.value.value]
                    }
                }
            }
        }
    }
    return result
}

export const functionArgumentValidation = async ({body}) => {
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
}

export const checkUserRights = async (methodName, user) => {
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
}

export const checkUserAuthorization = async (req) => {
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
