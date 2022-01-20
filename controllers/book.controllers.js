
const mongoose = require('mongoose');
const BookModel = mongoose.model("Book")

//services
const book_services = require("../services/book.service")

// Display list of all books.
const book_list = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');


    const { limit, skip } = req.params;
    const books = await book_services.findAllBooks(limit, skip);
    return res.json(books)
};


const book_details = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const { id } = req.params;
    const book_detail = await book_services.getBookDetails(id);

    return res.json(book_detail)
}



//Post a book
const post_book = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var { name, author, price, date_published, available } = req.body;

    const result = await book_services.postBookService(name, author, price, date_published, available);

    return res.json(result);
};

//issue a book
const issue_book = async (req, res) => {
    const { id } = req.params;
    const { jwt } = req.body;

    const result = await book_services.issueBook(jwt, id);
    return res.json(result);
}


//delete a book
const delete_book = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const { _id } = req.body;

    const response = await book_services.deleteBook(_id);
    return res.json(response)
}



module.exports = {
    book_list,
    book_details,
    post_book,
    issue_book,
    delete_book,

}