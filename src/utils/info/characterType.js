const {characterType} = require('../validator/validator')

module.exports = [
    {
        methodName: 'getCharacterTypesList',
        validator: null,
        permissions: []
    }, {
        methodName: 'createCharacterType',
        validator: characterType({name: true, description: true, imageUrl: true}),
        permissions: [],
    }, {
        methodName: 'getCharacterTypeById',
        validator: characterType({id: true}),
        permissions: []
    }, {
        methodName: 'updateCharacterType',
        validator: characterType({id: true, name: true, description: true, imageUrl: true}),
        permissions: []
    }, {
        methodName: 'removeCharacterType',
        validator: characterType({id: true}),
        permissions: []
    },
]
