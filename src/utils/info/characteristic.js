import {characteristic} from '../validator/validator'

export default [
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
