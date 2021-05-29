import {itemCharacteristic} from '../validator/validator'

export default [
    {
        methodName: 'getItemCharacteristicsList',
        validator: null,
        permissions: []
    },
    {
        methodName: 'getItemCharacteristicById',
        validator: itemCharacteristic({id: true}),
        permissions: []
    },
    {
        methodName: 'createCharacteristicForAnItem',
        validator: itemCharacteristic({characteristicId: true, value: true}),
        permissions: []
    },
    {
        methodName: 'updateCharacteristicForAnItem',
        validator: itemCharacteristic({id: true, value: true, characteristicId: true}),
        permissions: []
    },
    {
        methodName: 'removeCharacteristicForAnItem',
        validator: itemCharacteristic({id: true}),
        permissions: []
    },
]
