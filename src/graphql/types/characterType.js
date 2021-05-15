const models = require('../../models');
const {transform, reductionToOneFormat} = require('../../utils/converter');

module.exports = class CharacterType {
    static resolver() {
        return {
            Query: {
                getCharacterTypesList: async (obj, {limit, offset}) => {
                    const characterTypeList = await models.CharacterType.findAndCountAll({
                        ...(limit ? {limit} : null),
                        ...(offset ? {offset} : null)
                    })
                    return transform(characterTypeList)
                },
                getCharacterTypeById: async (obj, {id}) => {
                    const characterType = await models.CharacterType.findByPk(id)
                    if (!characterType) {
                        return transform(null, {message: `Character Type by ID ${id} not found`, code: 404});
                    }
                    return transform(characterType)
                },
            },
            CharacterType: {
                defaultCharacteristics: characterType => characterType.getLDefaultCharacteristics(),
                gainConstants: characterType => characterType.getLGainConstants(),
            },
            Mutation: {
                createCharacterType: async (obj, {name, description, imageUrl}) => {
                    const isNameUsed = await models.CharacterType.findOne({
                        where: {
                            name: name
                        }
                    })
                    if (isNameUsed) {
                        return transform(null, {message: `Name "${name}" is used`, code: 400});
                    }
                    const newCharacterType = await models.CharacterType.create({
                        name: name,
                        description: description,
                        imageUrl: imageUrl,
                    })
                    return transform({
                        id: newCharacterType.id,
                        name: newCharacterType.name,
                        description: newCharacterType.description,
                        imageUrl: newCharacterType.imageUrl
                    })
                },
                updateCharacterType: async (obj, {id, name, description, imageUrl}) => {
                    const characterType = await models.CharacterType.findByPk(id)
                    if (!characterType) {
                        return transform(null, {message: `Character Type by ID ${id} not found`, code: 404});
                    }

                    const isNameUsed = await models.CharacterType.findOne({
                        where: {
                            name: name
                        }
                    })
                    if (isNameUsed) {
                        return transform(null, {message: `Name "${name}" is used`, code: 400});
                    }

                    const updatedCharacterType = await characterType.update({
                        ...(name ? {name} : null),
                        ...(description ? {description} : null),
                        ...(imageUrl ? {imageUrl} : null),
                    })

                    return transform(updatedCharacterType)
                },
                removeCharacterType: async (obj, {id}) => {
                    const characterType = await models.CharacterType.findByPk(id)
                    if (!characterType) {
                        return transform(null, {message: `Character Type by ID ${id} not found`, code: 404});
                    }
                    await characterType.destroy()
                    return transform(characterType)
                },
            }
        }
    }

    static typeDefs() {
        return `
            type CharacterType {
                id: ID!
                name: String
                description: String
                imageUrl: String
                defaultCharacteristics: [LDefaultCharacteristic]
                gainConstants: [LGainConstant]
            }
            
            
            type CharacterTypesList {
                count: Int!
                rows: [CharacterType]
            }
            
            ${reductionToOneFormat('CharacterTypesList', 'GetListOfCharacterTypes')}
            ${reductionToOneFormat('CharacterType', 'CRUCharacterType')}
            ${reductionToOneFormat('CharacterType', 'RemoveCharacterType')}
        `;
    }

    static queryTypeDefs() {
        return `
            getCharacterTypesList(limit: Int, offset: Int): GetListOfCharacterTypes
            getCharacterTypeById(id: Int!): CRUCharacterType
        `;
    }

    static mutationTypeDefs() {
        return `
            createCharacterType(name: String, description: String, imageUrl: String): CRUCharacterType
            updateCharacterType(name: String, description: String, imageUrl: String, id: Int!): CRUCharacterType
            removeCharacterType(id: Int!): RemoveCharacterType
        `;
    }
}
