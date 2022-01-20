const express = require('express')
const router = express.Router();


//Controller modules
var book_controller = require('../../controllers/book.controllers');

//Get all books
router.get('/limit/:limit/skip/:skip', book_controller.book_list)

//Get particular book
router.get('/id/:id', book_controller.book_details)

//Issue a book
router.patch('/issue/id/:id', book_controller.issue_book)

//Post a book
router.post('/', book_controller.post_book)

//Delete a book
router.delete('/', book_controller.delete_book);


module.exports = router;