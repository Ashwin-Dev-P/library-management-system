//Utils
const { validEmail } = require('./validEmail');

//Check for email and password validity using the below function
async function emailAndPasswordValidity(email, password) {
    var result = {

    }


    if (!email || email.trim().length < 1) {
        result.status = 400;
        result.message = "Please enter an email id";

        return result;
    } else if ((await validEmail(email)) !== true) {
        result.status = 400;
        result.message = "Please enter a valid email id";
        return result;
    }

    if (!password || password.trim().length < 1) {
        result.status = 400;
        result.message = "Please enter a password";
        return result;
    }

    return true;
}

module.exports = {
    emailAndPasswordValidity
}