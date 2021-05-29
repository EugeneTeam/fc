import {complaint} from '../validator/validator'

export default [
    {
        methodName: 'createComplaint',
        validator: complaint,
        permissions: []
    }
]
