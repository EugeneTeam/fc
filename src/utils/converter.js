module.exports = {

    transform: (response, ...error) => ({
        data: response || null,
        status: error.length ? 'FAILURE' : 'SUCCEEDED',
        errors: error || []
    }),

    reductionToOneFormat: (dataType, name) => `
        type ${name} {
            data: ${dataType}
            status: String
            errors: [Errors]
        }
    `
}
