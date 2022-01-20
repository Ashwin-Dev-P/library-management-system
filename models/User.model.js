const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true,
        default: false,
    },
    book_currently_issued:
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        },
        issued_date: {
            type: Date,
            trim: true,
            default: Date.now(),
        }
    }
    ,
    books_issue_history: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book',
            },
            issued_date: {
                type: Date,
                trim: true,
                default: Date.now(),
            },
            return_date: {
                type: Date,
                trim: true,
            }
        }
    ]
}, {
    timestamps: true,
})


mongoose.model("User", userSchema)