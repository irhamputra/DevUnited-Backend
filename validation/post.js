const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validatePostInput = () => {
    let err = {};

    data.text = !isEmpty(data.text) ? data.text : '';

    if(!validator.isLength(data.text, { min: 20, max: 100 })) {
        err.text = 'Character must be min 20 words and max 100 words'
    }

    if(validator.isEmpty(data.post)){
        err.text = 'text field is required'
    }

    return {
        err,
        isValid: isEmpty(err)
    }
};