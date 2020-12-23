const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
//PORT Variable
const PORT = process.env.PORT || 3000;

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));


app.listen(PORT, (err) => {
    if(err){
        return console.log(err);
    }
    console.log(`Listening on Port ${PORT}`);
});