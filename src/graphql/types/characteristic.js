const models = require('../../models');
const {transform, reductionToOneFormat}  = require('../../utils/converter');

module.exports = class Characteristic {
    static resolver() {
        return {
            Query: {
                getCharacteristicList: async (obj, {limit, offset}) => {
                    const characteristics = await  models.Characteristic.findAndCountAll({
                        ...(limit ? {limit} : null),
                        ...(offset ? {offset} : null)
                    });
                    return transform(characteristics)
                },
                getCharacteristicById: async (obj, {id}) => {
                    const characteristic = await models.Characteristic.findByPk(id);

                    if (!characteristic) {
                        return transform(null, {
                            message: 'Characteristic not found',
                            code: 404
                        });
                    }

                    return transform(characteristic)
                }
            },
            Mutation: {
                createCharacteristic: async (obj, {name}) => {
                    const existingCharacteristic = await models.Characteristic.findOne({
                        where: {name}
                    });

                    if (existingCharacteristic) {
                        return transform(null, {
                            message: 'This characteristic already exists',
                            code: 400
                        });
                    }

                    const newCharacteristic = await models.Characteristic.create({name});
                    return transform(newCharacteristic);
                },
                updateCharacteristic: async (obj, {id, name}) => {
                    const existingCharacteristic = await models.Characteristic.findByPk(id);

                    if (!existingCharacteristic) {
                        return transform(null, {message: 'Characteristic not found', code: 404});
                    }

                    await existingCharacteristic.update({name});

                    return transform(await models.Characteristic.findByPk(id))
                },
                removeCharacteristic: async (obj, {id}) => {
                    const existingCharacteristic = await models.Characteristic.findByPk(id);

                    if (!existingCharacteristic) {
                        return transform(null, {message: 'Characteristic not found', code: 404});
                    }

                    await existingCharacteristic.destroy();

                    return transform(existingCharacteristic);
                },
            }
        }
    }

    static typeDefs() {
        return `
            type Characteristic {
                id: ID!
                name: String
            }
            
            type CharacteristicList {
                count: Int!
                rows: [Characteristic]
            }
            ${reductionToOneFormat('CharacteristicList', 'ListOfCharacteristics')}
            ${reductionToOneFormat('Characteristic', 'CRUCharacteristic')}
        `;
    }

    static queryTypeDefs() {
        return `
            getCharacteristicList(limit: Int, offset: Int): ListOfCharacteristics
            getCharacteristicById(id: Int!): CRUCharacteristic
        `;
    }

    static mutationTypeDefs() {
        return `
            createCharacteristic(name: String!): CRUCharacteristic
            updateCharacteristic(id: Int!, name: String!): CRUCharacteristic
            removeCharacteristic(id: Int!): CRUCharacteristic
        `;
    }
}
