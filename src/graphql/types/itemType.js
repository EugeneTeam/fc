const {transform, reductionToOneFormat} = require('../../utils/converter')
const models = require('../../models')
const {Op} = require('sequelize')
/**
 * Типы доступных предметов, например: glove, arrow...
 * Данный модуль доступен только админу или по правам доступа
 */
module.exports = class ItemType {
    static resolver() {
        return {
            Query: {
                getItemTypesList: async (obj, {limit, offset}) => {
                    return transform(await models.ItemType.findAndCountAll({
                        ...(limit ? {limit} : null),
                        ...(offset ? {offset} : null),
                    }))
                },
                getItemTypeById: async (obj, {id}) => {
                    const itemType = await models.ItemType.findByPk(id)

                    if (!itemType) {
                        transform(null, {
                            code: 404,
                            message: `Item type by ID ${id} not found`
                        })
                    }

                    return transform(itemType)
                }
            },
            Mutation: {
                createItemType: async (obj, {name}) => {
                    const itemType = await models.ItemType.findOne({
                        where: {name}
                    })

                    if (itemType) {
                        transform(null, {
                            code: 400,
                            message: `Name "${name}" is used`
                        })
                    }

                    return transform(await models.ItemType.create({name}))
                },
                updateItemType: async (obj, {id, name}) => {
                    const itemType = await models.ItemType.findOne({
                        where: {
                            [Op.or]: [
                                {name},
                                {id}
                            ]
                        }
                    })

                    if (!itemType) {
                        transform(null, {
                            code: 404,
                            message: `Item type by ID ${id} not found`
                        })
                    }

                    if (itemType && itemType.name === name) {
                        transform(null, {
                            code: 400,
                            message: `Name "${name}" is used`
                        })
                    }
                    return transform(await itemType.update({name}))
                },
                removeItemType: async (obj, {id}) => {
                    const itemType = await models.ItemType.findByPk(id)

                    if (!itemType) {
                        transform(null, {
                            code: 404,
                            message: `Item type by ID ${id} not found`
                        })
                    }

                },
            }
        }
    }

    static typeDefs() {
        return `
           type ItemType {
                id: Int
                name: String
           }
           
           type ItemTypeList {
                count: Int
                rows: [ItemType]
           }
           ${reductionToOneFormat('ItemTypeList', 'GetListOfItemType')}
           ${reductionToOneFormat('ItemType', 'CRUDItemType')}
        `
    }

    static queryTypeDefs() {
        return `
           getItemTypesList(limit: Int, offset: Int): GetListOfItemType
           getItemTypeById(id: Int): CRUDItemType
        `;
    }

    static mutationTypeDefs() {
        return `
            createItemType(name: String!): CRUDItemType
            updateItemType(id: Int!, name: String!): CRUDItemType
            removeItemType(id: Int!): CRUDItemType
        `;
    }
}
