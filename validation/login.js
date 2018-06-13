const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateLoginInput = (data) => {
    let err = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    // Check handle err
    // Email err handler
    if (!validator.isEmail(data.email)) {
        err.email = 'Email is invalid'
    }
    if (validator.isEmpty(data.email)) {
        err.email = 'Email is required'
    }

    // password err handler
    if (validator.isEmpty(data.password)){
        err.password = 'Password is required'
    }

    return {
        err,
        isValid: isEmpty(err)
    }
};