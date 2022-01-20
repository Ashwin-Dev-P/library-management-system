var compression = require('compression')
const helmet = require("helmet");

const express = require('express');
const app = express();

app.use(compression())
app.use(helmet());

//config
const config = require('./config/index')
const PORT = config.PORT;


//Serve static files(such as images)
app.use(express.static('./public/static/img/'));

//To enable .env file
require('dotenv').config()

//body parser deprecation replacement
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//MIDDLEWARES
//Redirect http to https protocol middleware
if (process.env.NODE_ENV === 'production') {
  const redirectToHttps = require('./middleware/redirectToHttps.middleware')
  app.use(redirectToHttps)
}




//Only this route is loaded before DB connection because this is the only route whoch does not require DB access 
//Default home API route
app.get('/', (req, res) => {
  return res.send("Library Management System API by Ashwin Dev");
})



//DB connection
require("./models");


//API routes can be loaded after DB connection
//API routes
const apis = require("./routes/api");
app.use(apis);

//Start server
app.listen(PORT, () => {
  console.log(`Server started on  port ${PORT}`);
  console.log(`http://localhost:${PORT}/api/`);
});


module.exports = app;