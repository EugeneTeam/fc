export const transform = (response, ...errors) => ({
    data: response || null,
    status: errors && errors.length ? 'FAILURE' : 'SUCCEEDED',
    errors: errors || []
})

export const reductionToOneFormat = (dataType, returnTypeName) => (`
        type ${returnTypeName} {
            data: ${dataType}
            status: String
            errors: [Errors]
        }
    `)
