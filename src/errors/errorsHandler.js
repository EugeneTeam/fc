const {USER, TOKEN} = require('./errorsList');
const {ApolloError} = require('apollo-server-express');

const errors = {USER, TOKEN};

checkParameterType = (expectedType, parameter) => {
    if (typeof parameter !== expectedType) {
        throw new Error(`invalid parameter type. Expected: ${expectedType}, Actual: ${typeof parameter}`)
    }
}

checkRequiredFields = field => {
    if (errors[field]) {
        return;
    }
    if (Object.keys(errors).findIndex(key => errors[key][field]) !== -1) {
        return;
    }
    throw new Error(`Unknown error name: ${field}`)
}

module.exports = {
    /**
     *
     * @param {string} moduleName
     * @param {string} errorName
     * @param {boolean} triggerError
     * @return throw Exception
     */
    pushError: (moduleName, errorName, triggerError = undefined) => {
        checkParameterType('string', moduleName);
        checkParameterType('string', errorName);
        checkRequiredFields(errorName)
        checkRequiredFields(moduleName)
        if (triggerError || triggerError === undefined) {
            throw new ApolloError(errors[moduleName][errorName].message, errors[moduleName][errorName].code);
        }
    }
}
