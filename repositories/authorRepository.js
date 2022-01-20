//Modules
const mongoose = require('mongoose');

//Models
const AuthorModel = mongoose.model("Author")

const findAllAuthorsRepository = async (select, limit, skip) => {
    limit = Number(limit);
    skip = Number(skip);
    return await AuthorModel.find().skip(skip).limit(limit).select(select).lean();
}



const findAuthorById = async (_id, select, populate, populate_fields) => {
    const details = await AuthorModel.findById(_id).select(select).populate(populate, populate_fields).lean();
    return details;
}


const updateAuthor = async (filter, update) => {
    const result = await AuthorModel.updateOne(filter, update);
    return result;
}
module.exports = {
    findAuthorById,
    findAllAuthorsRepository,
    updateAuthor,
}