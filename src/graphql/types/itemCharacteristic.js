const {transform, reductionToOneFormat} = require('../../utils/converter')
const models = require('../../models')
const {Op} = require('sequelize')

module.exports = class ItemCharacteristic {
    static resolver() {
        return {
            Query: {
                getItemCharacteristicsList: async (obj, {limit, offset}) => {
                    return transform(await models.ItemCharacteristic.findAndCountAll({
                        ...(limit ? {limit} : null),
                        ...(offset ? {offset} : null)
                    }))
                },
                getItemCharacteristicById: async (obj, {id}) => {
                    const itemCharacteristic = await models.ItemCharacteristic.findByPk(id)
                    if (!itemCharacteristic) {
                        return transform(null, {code: 404, message: `ItemCharacteristic by ID ${id} not found`})
                    }
                    return transform(itemCharacteristic)
                }
            },
            Mutation: {
                createCharacteristicForAnItem: async (obj, {characteristicId, value}) => {
                    const characteristic = await models.Characteristic.findByPk(characteristicId)
                    if (!characteristic) {
                        return transform(null, {code: 404, message: `Characteristic by ID ${characteristicId} not found`})
                    }

                    const itemCharacteristic = await models.ItemCharacteristic.findOne({
                        where: {
                            characteristicId,
                            value: {
                                [Op.eq]: parseFloat(value)
                            }
                        }
                    })
                    if (itemCharacteristic) {
                        return transform(null, {code: 400, message: `The characteristic "${characteristic.name}" with a value of ${value} has already been created`})
                    }

                    const newItemCharacteristic = await models.ItemCharacteristic.create({
                        characteristicId, value
                    })

                    return transform(newItemCharacteristic)
                },
                updateCharacteristicForAnItem: async (obj, {id, characteristicId, value}) => {
                    const itemCharacteristic = await models.ItemCharacteristic.findByPk(id)
                    if (!itemCharacteristic) {
                        return transform(null, {code: 404, message: `Item characteristic by ID ${id} not found`})
                    }

                    const characteristic = await models.Characteristic.findByPk(characteristicId)
                    if (!characteristic) {
                        return transform(null, {code: 404, message: `Characteristic by ID ${characteristicId} not found`})
                    }

                    const updatedItemCharacteristic = await itemCharacteristic.update({characteristicId, value})

                    return transform(updatedItemCharacteristic)
                },
                removeCharacteristicForAnItem: async (obj, {id}) => {
                    const itemCharacteristic = await models.ItemCharacteristic.findByPk(id)
                    if (!itemCharacteristic) {
                        return transform(null, {code: 404, message: `Item characteristic by ID ${id} not found`})
                    }

                    const removedItemCharacteristic = await itemCharacteristic.destroy()

                    return transform(removedItemCharacteristic)
                }
            }
        }
    }

    static typeDefs() {
        return `
            type ItemCharacteristic {
                id: Int
                characteristicId: Int
                value: Float
            }
            
            type ItemCharacteristicList {
                count: Int
                rows: [ItemCharacteristic]
            }
            
            ${reductionToOneFormat('ItemCharacteristic','CRUDItemCharacteristic')}
            ${reductionToOneFormat('ItemCharacteristicList','ListOfItemCharacteristic')}
        `
    }

    static queryTypeDefs() {
        return `
            getItemCharacteristicsList(limit: Int, offset: Int): ListOfItemCharacteristic
            getItemCharacteristicById(id: Int!): CRUDItemCharacteristic
        `;
    }

    static mutationTypeDefs() {
        return `
            createCharacteristicForAnItem(characteristicId: Int!, value: Float!): CRUDItemCharacteristic
            updateCharacteristicForAnItem(id: Int!, characteristicId: Int!, value: Float!): CRUDItemCharacteristic
            removeCharacteristicForAnItem(id: Int!): CRUDItemCharacteristic
        `;
    }
}
