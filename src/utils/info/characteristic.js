const {characteristic} = require('../validator/validator')

module.exports = [
    {
        methodName: 'getCharacteristicList',
        validator: null,
        permissions: []
    }, {
        methodName: 'getCharacteristicById',
        validator: characteristic({id: true}),
        permissions: []
    }, {
        methodName: 'createCharacteristic',
        validator: characteristic({name: true}),
        permissions: []
    }, {
        methodName: 'updateCharacteristic',
        validator: characteristic({id: true, name: true}),
        permissions: []
    }, {
        methodName: 'removeCharacteristic',
        validator: characteristic({id: true}),
        permissions: []
    },
]
