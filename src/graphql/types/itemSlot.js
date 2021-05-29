const {transform, reductionToOneFormat} = require('../../utils/converter')
const models = require('../../models')

/**
 * Слоты для предметов. Например: слот для оружия, слот для шлема ...
 * Данный модуль доступен только админу или по правам доступа
 */
module.exports = class ItemSlot {
    static resolver() {
        return {
            Query: {
                getItemSlotList: async (obj, {limit, offset}) => {
                    return transform(await models.ItemSlot.findAndCountAll({
                        ...(limit ? {limit} : null),
                        ...(offset ? {offset} : null)
                    }))
                },
                getItemSlotById: async (obj, {id}) => {
                    const itemSlot = await models.ItemSlot.findByPk(id)
                    if (!itemSlot) {
                        return transform(null, {
                            code: 404,
                            message: `Item slot by ID ${id} not found`
                        })
                    }
                    return transform(itemSlot)
                }
            },
            Mutation: {
                createItemSlot: async (obj, {itemTypeId, imageUrl}) => {
                    const itemType = await models.ItemType.findByPk(itemTypeId)
                    if (!itemType) {
                        return transform(null, {
                            code: 404,
                            message: `Item type by ID ${itemTypeId} not found`
                        })
                    }

                    const itemSlot = await models.ItemSlot.findOne({
                        where: {
                            itemTypeId,
                            imageUrl
                        }
                    })
                    if (itemSlot) {
                        return transform(null, {
                            code: 400,
                            message: `A similar item slot has already been created`
                        })
                    }

                    const newItemSlot = await models.ItemSlot.create({
                        itemTypeId, imageUrl
                    })

                    return transform(newItemSlot)
                },
                updateItemSlot: async (obj, {id, itemTypeId, imageUrl}) => {
                    const itemType = await models.ItemType.findByPk(itemTypeId)
                    if (!itemType) {
                        return transform(null, {
                            code: 404,
                            message: `Item type by ID ${itemTypeId} not found`
                        })
                    }

                    const itemSlot = await models.ItemSlot.findOne({
                        where: {
                            itemTypeId,
                            imageUrl
                        }
                    })
                    if (itemSlot) {
                        return transform(null, {
                            code: 400,
                            message: `A similar item slot has already been created`
                        })
                    }

                    const slotForUpdate = await models.ItemSlot.findByPk(id)
                    if (!slotForUpdate) {
                        return transform(null, {code: 404, message: `Item slot by ID ${id} not found`})
                    }
                    const updatedSlot = await slotForUpdate.update({itemTypeId, imageUrl})

                    return transform(updatedSlot)
                },
                removeItemSlot: async (obj, {id}) => {
                    const itemSlot = await models.ItemSlot.findByPk(id)
                    if (!itemSlot) {
                        return transform(null, {code: 404, message: `Item slot by ID ${id} not found`})
                    }

                    const removedItemSlot = await itemSlot.destroy()

                    return transform(removedItemSlot)
                }
            }
        }
    }

    static typeDefs() {
        return `
            type ItemSlot {
                id: Int
                itemTypeId: Int
                imageUrl: String
            }
            
            type ItemSlotList {
                count: Int
                rows: [ItemSlot]
            }
            
            ${reductionToOneFormat('ItemSlot','CRUDItemSlot')}
            ${reductionToOneFormat('ItemSlotList','ListOfItemSlot')}
        `
    }

    static queryTypeDefs() {
        return `
            getItemSlotList(limit: Int, offset: Int): ListOfItemSlot
            getItemSlotById(id: Int!): CRUDItemSlot
        `;
    }

    static mutationTypeDefs() {
        return `
            createItemSlot(itemTypeId: Int!, imageUrl: String!): CRUDItemSlot
            updateItemSlot(id: Int!, itemTypeId: Int!, imageUrl: String!): CRUDItemSlot
            removeItemSlot(id: Int!): CRUDItemSlot
        `;
    }
}
