const jwt = require("jsonwebtoken");

//config
const config = require('../config/index')


async function setJWT(_id, custom_JWT_SECRET) {
    var JWT_EXPIRES = config.JWT_EXPIRES;
    console.log(JWT_EXPIRES)
    const JWT_SECRET = custom_JWT_SECRET || process.env.JWT_SECRET;
    var JWT_EXPIRES = Number(JWT_EXPIRES);
    const token = jwt.sign({ id: _id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return token
};


module.exports = {
    setJWT,
}