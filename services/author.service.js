
//Modules
const mongoose = require('mongoose');

//Models
const AuthorModel = mongoose.model("Author")

//Repositories
const { findAllAuthorsRepository, findAuthorById } = require("../repositories/authorRepository");
const { bookExists } = require('../repositories/bookRepository');

//utils
const { validMongooseObjectId } = require('../utils/validMongooseObjectId');
const { onlyUnique } = require("../utils/onlyUnique")
const { getAllIndexes } = require("../utils/getAllIndexes")





const findAllAuthors = async (limit, skip) => {
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
    const authors = await findAllAuthorsRepository(select, limit, skip);
    final_result.data = authors;
    return final_result;
}


//Get details of one particular author
const getAuthorDetails = async (_id) => {

    const select = " -_id books name "
    const populate = "books"
    const populate_fields = "name price available picture"
    const author = await findAuthorById(_id, select, populate, populate_fields);
    console.log(author)
    var result = {
        data: author,
        status: 200,
    }

    return result;
}



//POST AN AUTHOR
//Async function to check if the input data is valid or not
async function validAuthor(name, books) {

    var message;
    var result;
    if (!name || name.trim().length < 1) {
        message = "Please enter an author name";
        result = {
            message,
            status: 400,
        }
        return result;
    }


    if (books) {

        //Filter out only unique values to prevent duplicate values
        books = books.filter(onlyUnique);
        var promises_array = []
        for (var i = 0; i < books.length; i++) {

            //Check if the mongodb id is valid
            if (! await validMongooseObjectId(books[i])) {
                message = books[i] + " is not a valid mongoDb id";
                result = {
                    message,
                    status: 400,
                }
                return result;
            }

            //Check the database if the id is present or not(Since the book may be deleted)
            const filter = {
                _id: books[i]
            }
            var book_exist_promise = bookExists(filter); //BookModel.exists(filter);
            promises_array.push(book_exist_promise);


        }


        //Check if the books are available. This check is done finally because it call backs to database which is very costly
        //Promise all is used to check if all the books are available in a single database call. This will imporve the performance
        const valid = await Promise.all(promises_array).then(async (results) => {



            const indexes = await getAllIndexes(results, false);

            if (indexes.length === 1) {
                message = `Book id ${books[indexes[0]]} does not exists`

                return message;
            }
            else if (indexes.length > 1) {
                message = "Book id "
                for (var i = 0; i < indexes.length; i++) {
                    message = message + `'${books[indexes[i]]}'`
                    if (i !== (indexes.length - 1)) {
                        message = message + ", "
                    }
                }
                message = message + " does not exist"

                return message;
            }

            return true


        })
        if (valid !== true) {
            message = valid;
            result = {
                message,
                status: 400,
            }
            return result;
        }

        //This will remove the duplicate values
        result = {
            books: books,
            status: 200,
        }
        return result;
    }




    result = {
        status: 200
    }
    return result;

}

const postAuthorService = async (name, books) => {
    const valid = await validAuthor(name, books);

    var result;
    if (valid.status === 200) {
        console.log(name);
        books = valid.books;
    } else {

        console.log(valid, name)
        result = {
            message: valid.message,
            status: valid.status,
        }

        return result;
    }







    const author = new AuthorModel();
    author.name = name;
    author.books = books;


    //Save the author details

    try {
        await author.save()
        result = {
            message: "Author saved successfully",
            status: 200,
        }

    } catch {
        result = {
            message: "Unable to save author",
            status: 400,
        }


    }
    return result;

}

module.exports = {
    findAllAuthors,
    postAuthorService,
    getAuthorDetails,
}