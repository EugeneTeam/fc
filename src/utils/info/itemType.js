import {itemType} from '../validator/validator'

export default [
    {
        methodName: 'getItemTypesList',
        validator: null,
        permissions: []
    }, {
        methodName: 'getItemTypeById',
        validator: itemType({id: true}),
        permissions: []
    }, {
        methodName: 'createItemType',
        validator: itemType({name: true}),
        permissions: []
    }, {
        methodName: 'updateItemType',
        validator: itemType({id: true, name: true}),
        permissions: []
    }, {
        methodName: 'removeItemType',
        validator: itemType({id: true}),
        permissions: []
    },
]
