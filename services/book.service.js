
//Modules
const mongoose = require('mongoose');

//Models
const BookModel = mongoose.model("Book")

//repositories
const { findByIdUser, updateUser } = require("../repositories/userRepository")
const { findBooks, deleteBookRepository, getBookDetailsById, issueBookRepository, findOneBook, updateOneBookById } = require("../repositories/bookRepository")
const { findAuthorById, updateAuthor } = require('../repositories/authorRepository');

//utils
const { validMongooseObjectId } = require("../utils/validMongooseObjectId");
const res = require('express/lib/response');
const jwtAuthentication = require('../utils/jwtAuthentication');
const containsObject = require('../utils/containsObject');

//services
const { return_book } = require('./user.service');


const findAllBooks = async (limit, skip) => {
    const select = "-__v"


    var final_result = {
        status: 200,
    }

    if (!limit) {
        limit = 10;
    }
    if (!skip) {
        skip = 0;
    }
    const books = await findBooks(select, limit, skip);

    final_result.data = books;
    return final_result;

}

const getBookDetails = async (_id) => {
    const select = "-_id name picture price available author number_of_times_issued users"
    const populate = 'author'
    const populate_fields = 'name _id'
    var result;

    //check if id is valid mongoose id
    if (!_id || ! await validMongooseObjectId(_id)) {
        result = {
            message: "Please enter a valid book id",
            status: 400,
        }

    } else {
        const data = await getBookDetailsById(_id, select, populate, populate_fields);
        result = {
            data: data,
            status: 200,
        }
    }


    return result;
}


async function validBook(name, author, price) {
    var message;
    if (!name || name.trim().length < 1) {
        message = "Please enter the name of the book";
        return message;

    }

    //Validate mongoose id here
    const valid_author_id = await validMongooseObjectId(author);
    if (!valid_author_id) {
        message = "Please enter a valid author id"
        return message;
    }

    //Check if price is a number here
    if (price && (isNaN(price))) {
        message = "Please enter a valid price. Price must be a number"
        return message;
    }
    return true;


}

const postBookService = async (name, author, price, date_published, available) => {
    var validData = await validBook(name, author, price);

    var result;
    if (validData !== true) {
        result = {
            message: validData,
            status: 400,
        }
        return result;
    }
    const book = new BookModel();
    book.name = name.trim();
    book.author = author.trim();

    if (price) {
        book.price = Number(price);
    }


    book.date_published = date_published;
    book.available = available || true;
    book.is_issued = false;

    var book_id;




    //Add the "book id" to the "authorsModel" field called "books"
    const authorObject = await findAuthorById(author);

    if (authorObject === null) {

        //If author not found
        result = {
            message: "Author does not exist",
            status: 404,
        }
        return result;

    } else {


        //Save book only if author is valid and exists
        try {
            const book_doc = await book.save();
            book_id = book_doc._id;
        } catch {
            result = {
                message: "Unable to save book",
                status: 500,
            }
            return result;
        }




    }

    //Save book id in author model
    if (!authorObject.books) {
        authorObject.books = [book_id]
    } else {
        authorObject.books.push(book_id);
    }


    const update = authorObject;
    const filter = { _id: author }
    author_updated = await updateAuthor(filter, update)


    if (author_updated.acknowledged !== true || author_updated.modifiedCount !== 1) {
        result = {
            message: "Unable to add book to author",
            status: 500,
        }
        return result;
    }






    result = {
        message: "Book saved successfully",
        status: 200,
    }
    return result;
}


const issueBook = async (jwt, book_id) => {
    //converting String to object type
    book_id = mongoose.Types.ObjectId(book_id);

    var result;

    //Login check
    const jwt_authentication_result = await jwtAuthentication(jwt);
    if (jwt_authentication_result.status !== 200) {
        result = jwt_authentication_result;
        return result;
    }


    //BOOK
    const user_id = jwt_authentication_result._id;
    const book_filter = {
        _id: book_id,
        available: { $ne: false },
        is_issued: { $ne: true },
    }
    const book_select = " number_of_times_issued users currently_issued_by is_issued available -_id "


    //Finding the book
    var book = await findOneBook(book_filter, book_select);

    if (!book || book === null) {
        result = {
            message: "Book not found",
            status: 400,
        }
        return result;
    }


    //Updating the book
    book.number_of_times_issued = book.number_of_times_issued + 1;
    book.users.push(user_id)
    book.currently_issued_by = user_id;


    //Previous book users
    var book_users_array = [];
    for (var i = 0; i < book.users.length; i++) {
        var present = await containsObject(book.users[i], book_users_array);
        if (!present) {
            book_users_array.push(book.users[i]);
        }
    }

    book.users = book_users_array


    const updatedBook = await updateOneBookById(book_id, book)

    if (updatedBook.modifiedCount !== 1) {
        result = {
            message: "unable to issue",
            status: 500,

        }

        return result;
    }






    //USER
    const user_filter = {
        _id: jwt_authentication_result._id,
    }
    const user_select = "-_id book_currently_issued books_issue_history"
    var user = await findByIdUser(user_id, user_select);

    if (!user || user === null) {
        result = {
            message: "User not found",
            status: 400,
        }

        return result;
    }



    user.book_currently_issued = {
        book: book_id,

    };


    var temp_books_issue_history = []
    if (!user.books_issue_history || user.books_issue_history.length < 1) {

        const book_object = {
            book: book_id,
            issue_date: Date.now(),

        }
        temp_books_issue_history.push(book_object);
    }

    else if (! await containsObject(book_id, user.books_issue_history)) {
        temp_books_issue_history = user.books_issue_history

        const book_object = {
            book: book_id,
        }
        temp_books_issue_history.push(book_object);

    }
    user.books_issue_history = temp_books_issue_history;


    const updatedUser = await updateUser(user_filter, user);

    if (updatedUser.acknowledged === true && updatedUser.modifiedCount === 1) {
        result = {
            message: "Book issued",
            status: 200,
            user,
            count: user.books_issue_history.length,
        }
    }






    return result;
}

const deleteBook = async (_id) => {
    if (!_id || _id.length < 1) {
        return res.json({
            message: "_id not present",
            status: 400,
        })
    }

    var final_result;
    //check if 'id' is valid mongoose id or not 
    if (! await validMongooseObjectId(_id)) {
        final_result = {
            message: "Invalid book id",
            status: 400,
        }
        return final_result;
    }

    const filter = {
        _id: _id
    }


    const result = await deleteBookRepository(filter);
    if (result.deletedCount === 1) {
        final_result = {
            message: "Book deleted successfully",
            status: 200,
        }
    } else if (result.deletedCount === 0) {
        final_result = {
            message: "Book to be deleted is not found",
            status: 400,
        }
    }

    return final_result;

}






module.exports = {
    findAllBooks,
    getBookDetails,
    deleteBook,
    postBookService,
    issueBook,
}