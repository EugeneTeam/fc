const Yup = require('yup');
const {ApolloError} = require('apollo-server-express');

const runValidation = (data, schema) => {
    return new Promise(resolve => {
        schema
            .validate(data, {abortEarly: false, stripUnknown: true})
            .then(response => {
                resolve({
                    result: response,
                    messages: null,
                    error: false
                })
            })
            .catch(response => {
                resolve({
                    result: null,
                    error: true,
                    messages: response.errors
                })
            })
    })
}

const createComplaintValidator = data => {
    const schema = Yup.object().shape({
        targetId: Yup.number().positive('Invalid targetId').required('TargetId is required'),
        reason: Yup.string().required('Reason is required')
    });

    return runValidation(data, schema);
}

const sigInValidator = data => {
    const schema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
        rememberMe: Yup.bool().oneOf([false, true], 'rememberMe is required')
    })

    return runValidation(data, schema);
}

const signUpValidator = data => {

    const signUpRegexLettersLowerCase = /[a-z]{1,30}/g;      //Password must contain at least 1 lowercase letter
    const signUpRegexLettersUpperCase = /[A-Z]{1,30}/g;      //Password must contain at least 1 uppercase letter
    const signUpRegexNumbers = /[\d]{1,30}/g;                //Password must contain at least 1 numeric character
    const signUpRegexSymbols = /[\-*\/!@#$%^&()=]{1,30}/g;   //valid special characters for the password

    const validatePassword = () => Yup.string()
        .matches(signUpRegexLettersLowerCase, { message: 'Password must contain at least 1 lowercase letter' })
        .matches(signUpRegexLettersUpperCase, { message: 'Password must contain at least 1 uppercase letter' })
        .matches(signUpRegexNumbers, { message: 'Password must contain at least 1 numeric letter' })
        .matches(signUpRegexSymbols, { message: 'Valid special characters for the password: -*/!@#$%^&()=' })
        .test('password to short', 'Minimum password length 6 characters',value => value.length > 6)
        .test('password to long', 'Maximum password length 30 characters', value => value.length < 30)
        .required('Password is required');

    const validateNickname = () => Yup.string()
        .matches(/^[A-Za-z0-9_-]+$/g, {
            message: 'Valid characters for nickname "A-Z a-z 0-9 _ -"'
        })
        .test('nickname to short', 'Nickname length must be more than 6 characters',value => value.length > 6)
        .test('nickname to long', 'Nickname length must not exceed 30 characters', value => value.length < 30)
        .required('Nickname is required');

    const schema = Yup.object().shape({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: validatePassword(),
        passwordRepeat: Yup.string().oneOf([Yup.ref('password'), null], 'Password mast match'),
        nickname: validateNickname()
    });
    return runValidation(data, schema);
}

module.exports = {
    signUpValidator,
    sigInValidator,
    createComplaintValidator
}
