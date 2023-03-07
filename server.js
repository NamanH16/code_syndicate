const express = require("express");
const connectDB = require('./config/db');

const app = express();

// Connect db
connectDB();

// Init Middleware
app.use(express.json({extended: false}));
/*The {extended: false} option specifies that the JSON data should not be parsed with the qs library, which is used for parsing 
URL-encoded data, and instead uses the built-in JSON.parse() method. 

Middleware is a function that sits in the middle of the request-response cycle and can intercept and modify the request or response
objects before passing them to the next middleware in the chain or sending them back to the client. 

Middleware functions are added to an Express application using the app.use() method and are executed in the order they are added. They
can be used for a variety of tasks such as logging, authentication, error handling, and data parsing, as in the case of express.json().
*/

const PORT = process.env.PORT || 5000;

app.get("/",(req, res)=>res.send("API running"));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));


app.listen(PORT, ()=>{
    console.log(`Server started at ${PORT}`);
});