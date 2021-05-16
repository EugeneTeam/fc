const {reductionToOneFormat, transform} = require('../../utils/converter')
const models = require('../../models')
const {Op} = require('sequelize')

module.exports = class Item {
    static resolver() {
        return {
            Query: {
                getItemById: async (obj, {id}) => {
                    const item = await models.Item.findByPk(id)
                    if (!item) {
                        return transform(null, {code: 404, message: `Item by ID ${id} not found`})
                    }
                    return transform(item)
                },
                getItemsList: async (obj, {limit, offset}) => {
                    return transform(await models.Item.findAndCountAll({
                        ...(limit ? {limit} : null),
                        ...(offset ? {offset} : null)
                    }))
                }
            },
            Mutation: {
                createItem: async (obj, {name, description, imageUrl}) => {
                    const item = await models.Item.findOne({
                        where: {name}
                    })

                    if (item) {
                        return transform(null, {code: 400, message: `Name "${name}" is used`})
                    }

                    const newItem = await models.Item.create({
                        name, description, imageUrl
                    })

                    return transform(newItem)
                },
                updateItem: async (obj, {id, name, description, imageUrl}) => {
                    const item = await models.Item.findOne({
                        where: {
                            [Op.or]: [
                                {id},
                                {name}
                            ]
                        }
                    })

                    if (item && item.name === name) {
                        return transform(null, {code: 400, message: `Name "${name}" is used`})
                    } else {
                        return transform(null, {code: 404, message: `Item by ID ${id} not found`})
                    }

                    const updatedItem = await item.update({
                        name, description, imageUrl
                    })

                    return transform(updatedItem)
                },
                removeItem: async (obj, {id}) => {
                    const item = await models.Item.findByPk(id)
                    if (!item) {
                        return transform(null, {code: 404, message: `Item by ID ${id} not found`})
                    }
                    const removedItem = await item.destroy()
                    return transform(removedItem)
                }
            }
        }
    }

    static typeDefs() {
        return `
            type Item {
                id: Int
                name: String
                description: String
                imageUrl: String
            }
            
            type ItemList {
                count: Int!
                rows: [Item]
            }
            ${reductionToOneFormat('Item','CRUItem')}
            ${reductionToOneFormat('ItemList','ListOfItems')}
        `;
    }
    static queryTypeDefs() {
        return `
            getItemById(id: Int!): CRUItem
            getItemsList(limit: Int, offset: Int): ListOfItems
            
        `;
    }
    static mutationTypeDefs() {
        return `
            createItem(name: String!, description: String!, imageUrl: String!): CRUItem
            updateItem(id: Int!, name: String, description: String, imageUrl: String): CRUItem
            removeItem(id: Int!): CRUItem
        `;
    }
}
