const {item} = require('../validator/validator')

module.exports = [
    {
        methodName: 'getItemById',
        validator: item({id: true}),
        permissions: []
    },
    {
        methodName: 'getItemsList',
        validator: null,
        permissions: []
    },
    {
        methodName: 'createItem',
        validator: item({name: true, imageUrl: true, description: true}),
        permissions: []
    },
    {
        methodName: 'updateItem',
        validator: item({description: true, imageUrl: true, name: true, id: true}),
        permissions: []
    },
    {
        methodName: 'removeItem',
        validator: item({id: true}),
        permissions: []
    },
]
