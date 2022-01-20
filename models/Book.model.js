const mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    author: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',

    },
    price: {
        type: Number,
        trim: true,
    },
    date_published: {
        type: Date,
        trim: true,
    },
    number_of_times_issued: {
        type: Number,
        trim: true,
        default: 0,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    available: {
        type: Boolean,
        default: true,
    },
    is_issued: {
        type: Boolean,
        default: false,

    },
    currently_issued_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    picture: {
        type: String,
        trim: true,
        default: "/books/default.jpg",
        required: true,
    }

}, {
    timestamps: true,
})


mongoose.model("Book", bookSchema)