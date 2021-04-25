const {validateCharacteristic} = require('../../utils/validator/validator');
const models = require('../../models');
const {transform, reductionToOneFormat}  = require('../../utils/responseTransformer');

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
                getCharacteristicById: async (obj, {characteristicId}) => {
                    const characteristic = await models.Characteristic.findByPk(characteristicId);

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
                createCharacteristic: async (obj, args) => {
                    const {result, error, messages} = await validateCharacteristic(args, {name: true});
                    if (error) {
                        return transform(null, ...messages.map(message => ({message, code: 400})));
                    }

                    const existingCharacteristic = await models.Characteristic.findOne({
                        where: {
                            name: result.name
                        }
                    });

                    if (existingCharacteristic) {
                        return transform(null, {message: 'This characteristic already exists', code: 400});
                    }

                    const newCharacteristic = await models.Characteristic.create(result);
                    return transform(newCharacteristic);
                },
                updateCharacteristic: async (obj, args) => {
                    const {result, error, messages} = await validateCharacteristic(args, {name: true, id: true});
                    if (error) {
                        return transform(null, ...messages.map(message => ({message, code: 400})));
                    }

                    const existingCharacteristic = await models.Characteristic.findByPk(result.characteristicId);

                    if (!existingCharacteristic) {
                        return transform(null, {message: 'Characteristic not found', code: 404});
                    }

                    await existingCharacteristic.update({
                        name: result.name
                    });

                    return transform(await models.Characteristic.findByPk(result.characteristicId))
                },
                removeCharacteristic: async (obj, args) => {
                    const {result, error, messages} = await validateCharacteristic(args, {id: true});
                    if (error) {
                        return transform(null, ...messages.map(message => ({message, code: 400})));
                    }

                    const existingCharacteristic = await models.Characteristic.findByPk(result.characteristicId);

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
            ${reductionToOneFormat('CharacteristicList', 'GetListOfCharacteristics')}
            ${reductionToOneFormat('Characteristic', 'CRUCharacteristic')}
            ${reductionToOneFormat('Characteristic', 'RemoveCharacteristic')}
        `;
    }

    static queryTypeDefs() {
        return `
            getCharacteristicList(limit: Int, offset: Int): GetListOfCharacteristics
            getCharacteristicById(characteristicId: Int!): CRUCharacteristic
        `;
    }

    static mutationTypeDefs() {
        return `
            createCharacteristic(name: String!): CRUCharacteristic
            updateCharacteristic(characteristicId: Int!, name: String!): CRUCharacteristic
            removeCharacteristic(characteristicId: Int!): RemoveCharacteristic
        `;
    }
}
