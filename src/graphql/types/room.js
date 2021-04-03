const models = require('../../models');
const {Op} = require('sequelize');
const {
    createRoomValidator,
    removeOrAddUserToTheRoom
} = require('../../utils/validator/validator');

module.exports = class Room {
    static resolver() {
        return {
            Room: {
              creator: room => room.getUser(),
            },
            Query: {
                getListOfMyRoom: async (obj, args, context) => {
                    const roomList = await models.Room.findAndCountAll({
                        include: {
                            required: true,
                            model: models.LUserInRoom,
                            where: {
                                userId: context.user.id
                            }
                        }
                    });
                    return roomList
                },
            },
            Mutation: {
                createRoom: async (obj, args, context) => {
                    const {result, error, messages} = await createRoomValidator(args);
                    if (error) {
                        return { errorMessages: messages }
                    }

                    const transactionResult = await models.sequelize.transaction(async transaction => {
                        const newRoom = await models.Room.create({
                            name: result.name,
                            creatorId: context.user.id
                        }, {
                            transaction
                        })
                        await newRoom.addedUsersToTheRoom(result.userIds, transaction)
                        return true
                    })

                    if (!transactionResult) {
                        return {
                            response: 'FAILURE',
                            messages: ['Something wen wrong']
                        }
                    }
                    await context.pubSub.publish(context.triggers.CREATE_ROOM, {
                        roomSystemMessage: `"${context.user.nickname}" created a room called "${result.name}"`
                    })
                    return {
                        response: 'SUCCESS',
                        messages: []
                    }

                },
                addedUserToRoom: async (obj, args, context) => {
                    const {result, error, messages} = await removeOrAddUserToTheRoom(args);
                    if (error) {
                        return { errorMessages: messages }
                    }

                    // check user permissions
                    const isUsedHavePermission = await context.user.isUserHavePermission(['add-user-to-room'], context.user.permissions)
                    if (!isUsedHavePermission) {
                        return {
                            response: 'FAILURE',
                            messages: ['You dont have have permission']
                        }
                    }

                    // check room availability
                    const room = await models.Room.findByPk(result.roomId)
                    if (!room) {
                        return {
                            response: 'FAILURE',
                            messages: ['Room not found']
                        }
                    }

                    // check the room for the presence of a user
                    const userInRoom = await models.LUserInRoom.findOne({
                        where: {
                            userId: result.userId,
                            roomId: result.roomId,
                        }
                    });
                    if (userInRoom) {
                        return {
                            response: 'INFO',
                            messages: ['The user was previously added to this room']
                        }
                    }
                    await models.LUserInRoom.create({
                        userId: result.userId,
                        roomId: result.roomId,
                        role: 'Room-member'
                    });

                    const user = await models.User.findByPk(result.userId);

                    await context.pubSub.publish(context.triggers.CREATE_ROOM, {
                        roomSystemMessage: `"${context.user.nickname}" added user "${user.nickname}"`
                    });

                    return {
                        response: 'SUCCESS',
                        messages: []
                    }
                },
                removeUserFromRoom: async (obj, args, context) => {
                    const {result, error, messages} = await removeOrAddUserToTheRoom(args);
                    if (error) {
                        return { errorMessages: messages }
                    }

                    const room = await models.Room.findByPk(result.roomId);
                    if (!room) {
                        return {
                            response: 'FAILURE',
                            messages: ['Room not found']
                        }
                    }

                    // check user permission
                    if (room.creatorId !== context.user.id && !(await context.user.isUserHavePermission(['remove-user-from-room'], context.user.permissions))) {
                        return {
                            response: 'FAILURE',
                            messages: ['You dont have have permission']
                        }
                    }

                    const userInTheRoom = await models.LUserInRoom.findOne({
                        where: {
                            roomId: result.roomId,
                            userId: result.userId
                        }
                    });

                    if (!userInTheRoom) {
                        return {
                            response: 'INFO',
                            messages: ['The user is not in this room']
                        }
                    }

                    await models.LUserInRoom.destroy({
                        where: {
                            roomId: result.roomId,
                            userId: result.userId
                        }
                    });

                    return {
                        response: 'SUCCESS',
                        messages: []
                    }
                }
            },
            Subscription: {
                roomSystemMessage: {
                    subscribe: (parent, args, context) => {
                        return context.pubSub.asyncIterator(context.triggers.CREATE_ROOM)
                    }
                }
            }
        }
    }

    static typeDefs() {
        return `
           type RoomResponse {
                response: String
                messages: [String]
           }
           
           type SystemMessage {
                message: String
           }
           
           type Room {
                id: ID!
                creator: User!
                name: String!
                createdAt: String!
                updatedAt: String!
           }
           
           type RoomListResponse {
                count: Int
                rows: [Room]
           }
        `
    }

    static queryTypeDefs() {
        return `
            getListOfMyRoom(limit: Int, offset: Int): RoomListResponse
        `
    }

    static subscriptionTypeDefs() {
        return `
            roomSystemMessage: String
        `
    }
    static mutationTypeDefs() {
        return `
            createRoom(name: String!, userIds: [Int]!): RoomResponse
            addedUserToRoom(roomId: Int!, userId: Int!): RoomResponse
            removeUserFromRoom(roomId: Int!, userId: Int!): RoomResponse
        `
    }
}
