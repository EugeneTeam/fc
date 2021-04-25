module.exports = {
    USER: {
        ACCESS_DENIED: {message: 'Access denied', code: '403'},
        NOT_AUTHORIZE: {message: 'Not authorized', code: '401'},
        NOT_FOUND: {message: 'User not found', code: '404'},
        INVALID_CREDENTIAL: {message: 'Wrong login and/or password', code: '401'},
        ACCOUNT_IS_INACTIVE: {message: 'Confirm your mail', code: '400'},
    },
    TOKEN: {
        EXPIRED: {message: "Token expired", code: "401"},
        REQUIRED: {message: "Token required", code: "400"},
        INVALID: {message: "Invalid token", code: "400"},
    }
}
