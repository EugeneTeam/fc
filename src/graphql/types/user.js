const models = require('../../models');
const {signUpValidator, sigInValidator} = require('../../utils/validator/validator');

module.exports = class User {

    static async checkForUniqueness(fieldName, arg, message) {
        const findUserByField = await models.User.findOne({
            where: { [fieldName]: arg }
        });

        if (findUserByField) {
            return { errorMessages: [message] }
        }
        return null
    }

    static resolver() {
        return {
            Query: {
                signIn: async (obj, args) => {
                    const {result, error, messages} = await sigInValidator(args)
                    if (error) {
                        return { errorMessages: messages }
                    }

                    const userByEmail = await models.User.findOne({
                        where: { email: result.email }
                    });

                    if (!userByEmail) {
                        return { errorMessages: ['User not found'] }
                    }

                    if (userByEmail.status === 'INACTIVE') {
                        return { errorMessages: ['Email not verified'] }
                    }

                    if (userByEmail.status === 'BANNED') {
                        return {
                            errorMessages: ['The user is blocked'],
                            banReason: userByEmail.banReason
                        }
                    }

                    const isSuccessfulPasswordDecryption = await models.User.decryptPassword(result.password, userByEmail.passwordHash);
                    if (!isSuccessfulPasswordDecryption) {
                        return { errorMessages: ['Wrong credential data'] }
                    }

                    const token = userByEmail.generateAccessToken(result.rememberMe);

                    return { token }
                }
            },
            Mutation: {
                signUp: async (obj, args) => {
                    const {result, error, messages} = await signUpValidator(args);
                    if (error) {
                        return { errorMessages: messages }
                    }

                    const  checkEmailForUniqueness = await this.checkForUniqueness('email', result.email, 'Email is used');
                    if (checkEmailForUniqueness) { return checkEmailForUniqueness }

                    const  checkNicknameForUniqueness = await this.checkForUniqueness('nickname', result.nickname, 'Nickname is used');
                    if (checkNicknameForUniqueness) { return checkNicknameForUniqueness }

                    const activationToken = models.User.generateLimitedTimeToken();
                    const newUser = await models.User.create({
                        nickname: result.nickname,
                        email: result.email,
                        // TODO change default user status
                        status: 'ACTIVE',
                        passwordHash: await models.User.encryptPassword(result.password),
                        authToken: await models.User.generateAuthToken(),
                        activationToken
                    })

                    await newUser.addRoleForUser('User')
                    // TODO send a confirmation email

                    return { token: newUser.encodeToken() }
                },

                // TODO implement the following methods
                // - Mail confirmation
                // - Repeat the sending of a letter to activate mail
                // - Send a password reset request
                // - Password reset
            }
        }
    }

    static typeDefs() {
        return `
            type User {
                id: ID!
                nickname: String!
                status: String!
                banReason: String
                role: String!
                createdAt: String!
                updatedAt: String!
            }
            
            type ResponseUser {
                token: String
                errorMessages: [String]
                banReason: String
            }
        `;
    }

    static queryTypeDefs() {
        return `
            signIn(email: String!, password: String!, rememberMe: Boolean!): ResponseUser
        `;
    }

    static mutationTypeDefs() {
        return `
            signUp(email: String!, password: String!, passwordRepeat: String!, nickname: String!): ResponseUser 
        `;
    }
}
