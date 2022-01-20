const mongoose = require('mongoose');
const AuthorModel = mongoose.model("Author")
const BookModel = mongoose.model("Book");

//services
const author_services = require("../services/author.service")



// Display list of all users.
const author_list = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const { limit, skip } = req.params;

    var final_result = await author_services.findAllAuthors(limit, skip);

    return res.json(final_result)
};


const author_details = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const { id } = req.params;

    var result = await author_services.getAuthorDetails(id);

    return res.json(result);
}












//Post a author
const post_author = async = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const { name } = req.body;
    var books = req.body.books;

    var final_result = await author_services.postAuthorService(name, books);
    //console.log(final_result)
    return res.json(final_result)
}

module.exports = {
    author_list,
    author_details,
    post_author,
}