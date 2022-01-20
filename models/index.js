const mongoose = require('mongoose');
//var uri = "mongodb+srv://" + process.env.MONGODB_USERNAME  +":"+ process.env.MONGODB_PASSWORD +"@mycluster.gi2hp.mongodb.net/CMS?retryWrites=true&w=majority" 
const config = require('../config/index')
const USE_MONGODB_ATLAS = config.USE_MONGODB_ATLAS;

if (USE_MONGODB_ATLAS === true || process.env.NODE_ENV === "production") {
    //Uses mongodb atlas cloud service
    var uri = "mongodb+srv://" + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + "@mycluster.gi2hp.mongodb.net/LMS?retryWrites=true&w=majority";
}
else {
    //Uses mongodb compass localhost storage
    var uri = "mongodb://localhost:27017"
}


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    if (error) {

        console.log("Error connecting to the database");
        console.log(error)

        return res.json({
            message: "Error connecting to the database",
            status: 500,
            error
        })
    }
});

const User = require("./User.model")
const Book = require("./Book.model")
const Author = require("./Author.model"); const res = require('express/lib/response');

