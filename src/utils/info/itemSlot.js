import {itemSlot} from '../validator/validator'

export default [
    {
        methodName: 'getItemSlotList',
        validator: null,
        permissions: []
    },
    {
        methodName: 'getItemSlotById',
        validator: itemSlot({id: true}),
        permissions: []
    },
    {
        methodName: 'createItemSlot',
        validator: itemSlot({itemTypeId: true, imageUrl: true}),
        permissions: []
    },
    {
        methodName: 'updateItemSlot',
        validator: itemSlot({id: true, itemTypeId: true, imageUrl: true}),
        permissions: []
    },
    {
        methodName: 'removeItemSlot',
        validator: itemSlot({id: true}),
        permissions: []
    },
]
