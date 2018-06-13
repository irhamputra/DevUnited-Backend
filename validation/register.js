const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateRegisterInput = (data) => {
    let err = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.passwordConfirm = !isEmpty(data.passwordConfirm) ? data.passwordConfirm : '';
    
    // Check handle err
    // Name err handler
    if (!validator.isLength(data.name, { min: 2, max: 30 })){
        err.name = 'Name must be between 2 and 30 characters'
    }
    if (validator.isEmpty(data.name)){
        err.name = 'Name field is required'
    }
    
    // Email err handler
    if (validator.isEmpty(data.email)) {
        err.email = 'Email field is required'
    }
    if (!validator.isEmail(data.email)) {
        err.email = 'Email is invalid'
    }

    // password err handler
    if (!validator.isLength(data.password, { min: 6, max: 35 })){
        err.password = 'Password must be at least 6 characters'
    }
    if (validator.isEmpty(data.password)){
        err.password = 'Password is required'
    }

    // password confirm err handler
    if (validator.isEmpty(data.passwordConfirm)){
        err.passwordConfirm = 'Password is required'
    }
    if (!validator.equals(data.password, data.passwordConfirm)){
        err.passwordConfirm = 'password did not match'
    }

    return {
        err,
        isValid: isEmpty(err)
    }
};