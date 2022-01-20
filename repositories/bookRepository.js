//Modules
const mongoose = require('mongoose');



//Models
const BookModel = mongoose.model("Book")

const findBooks = async (select, limit, skip) => {
    limit = Number(limit);
    skip = Number(skip);
    const books = await BookModel.find().skip(skip).limit(limit).select(select).lean();
    return books;
}

const findOneBook = async (filter, select) => {
    const book = await BookModel.findOne(filter).select(select).lean();
    return book;
}





const updateOneBookById = async (_id, update) => {

    _id = mongoose.Types.ObjectId(_id)

    const result = await BookModel.updateOne({ _id: _id }, update);
    return result;
}

const getBookDetailsById = async (_id, select, populate, populate_fields) => {
    const book_detail = await BookModel.findById(_id).select(select).populate(populate, populate_fields).lean();
    return book_detail;
}

const bookExists = async (filter) => {
    return BookModel.exists(filter);
}


const deleteBookRepository = async (filter) => {
    const result = await BookModel.deleteOne(filter);
    return result;

}

module.exports = {
    findBooks,

    getBookDetailsById,
    deleteBookRepository,
    updateOneBookById,
    findOneBook,
    bookExists,
}


