const {complaint} = require('../validator/validator')

module.exports = [
    {
        methodName: 'createComplaint',
        validator: complaint,
        permissions: []
    }
]
