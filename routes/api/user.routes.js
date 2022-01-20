const express = require("express");
const router = express.Router();

//Controller modules
var user_controller = require("../../controllers/user.controllers");

//Get all users
router.get("/limit/:limit/skip/:skip", user_controller.user_list);

//Get particular users
router.get("/id/:id", user_controller.get_user_details);

//Get user profile details
router.post("/my_profile", user_controller.get_profile);

//Register user
router.post("/", user_controller.register_user);

//Login user
router.post("/login", user_controller.login_user);

//issue check
router.post("/issue_check/id/:id", user_controller.issue_check);

//return book
//Below route is not in production
router.patch("/return_book", user_controller.return_book);

module.exports = router;
