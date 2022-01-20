const express = require('express');
const app = express();


//User API routes
//app.use('/api', res.send("hello"))
app.use('/api/user', require('./user.routes'))
app.use('/api/book', require('./book.routes'))
app.use('/api/author', require('./author.routes'))

module.exports = app;