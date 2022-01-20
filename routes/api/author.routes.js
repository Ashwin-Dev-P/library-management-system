const express = require('express')
const router = express.Router();


//Controller modules
var author_controller = require('../../controllers/author.controllers');

//Get all authors
router.get('/limit/:limit/skip/:skip', author_controller.author_list)

//Get particular author
router.get('/id/:id', author_controller.author_details)

//Post a author
router.post("/", author_controller.post_author)




module.exports = router;