module.exports = {

    transform: (response, ...errors) => ({
        data: response || null,
        status: errors && errors.length ? 'FAILURE' : 'SUCCEEDED',
        errors: errors || []
    }),

    reductionToOneFormat: (dataType, returnTypeName) => `
        type ${returnTypeName} {
            data: ${dataType}
            status: String
            errors: [Errors]
        }
    `
}
