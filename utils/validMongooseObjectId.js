var ObjectId = require('mongoose').Types.ObjectId;
async function validMongooseObjectId(_id) {
    return ObjectId.isValid(String(_id));
}

module.exports = {
    validMongooseObjectId,
}

