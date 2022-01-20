const mongoose = require("mongoose");

var authorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',

        }
    ]

}, {
    timestamps: true,
})


mongoose.model("Author", authorSchema)