const models = require('../../models');
const {sendMessageValidator} = require('../../utils/validator/validator');
const {withFilter} = require('graphql-subscriptions');

module.exports = class Message {
    static resolver() {
        return {
            Mutation: {
                sendMessage: async (obj, args, context) => {
                    const {result, error, messages} = await sendMessageValidator(args);
                    if (error) {
                        return {errorMessages: messages}
                    }


                    const room = await models.Room.findByPk(result.roomId);
                    if (!room) {
                        return {errorMessages: ['Room not found']}
                    }

                    await models.Message.create({
                        parentId: result.parentId,
                        roomId: result.roomId,
                        message: result.message,
                        userId: context.user.id
                    });

                    const listener = await models.LUserInRoom.findAll(({
                        where: {
                            roomId: result.roomId
                        }
                    }))

                    await context.pubSub.publish(context.triggers.SEND_MESSAGE, {
                        sendMessage: {
                            from: context.user.nickname,
                            date: new Date(),
                            message: result.message,
                            roomId: result.roomId,
                        },
                        listenerIds: listener.map(item => item.userId)
                    })
                    return {
                        response: 'SUCCESS',
                        errorMessages: null
                    }
                },
            },
            Subscription: {
                sendMessage: {
                    subscribe: withFilter(
                        (obj, args, context) => context.pubSub.asyncIterator(context.triggers.SEND_MESSAGE),
                        (payload, variable) => payload.listenerIds.includes(variable.listenerId)
                    )
                }
            }
        }
    }

    static typeDefs() {
        return `
           type SendMessageResponse {
                response: String
                errorMessages: [String]
           }
           type SubscriptionSendMessageResponse {
                from: String
                date: String
                message: String
           }
        `
    }

    static subscriptionTypeDefs() {
        return `
            sendMessage(listenerId: Int!): SubscriptionSendMessageResponse
        `;
    }

    static mutationTypeDefs() {
        return `
            sendMessage(parentId: Int, roomId: Int!, message: String!): SendMessageResponse
        `
    }
}
