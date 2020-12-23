const express = require('express');
const router = express.Router();
const sqlite = require('sqlite3').verbose();

//Database file route
const database = 'student_information.db';

//Render Login Page
router.get('/login', (req,res) => {
    res.render('login');
});

//Render Register Page
router.get('/register', (req,res) => {
    res.render('register');
});

//Login
router.post('/login', (req,res) => {
    
    let email = req.body.email;
    let password = req.body.password;

    //Connecting to Database
    let db = new sqlite.Database(database);

    let query = `SELECT * FROM entities WHERE email = ? AND password = ?`;

    db.get(query, [email,password], (err,row) => {
        if(err){
            console.log(err);
        }
        return row
        ? res.render('dashboard', {
          row
        })
        : res.render('login');
    });
      
    //Closing database
    db.close();

});

//Register
router.post('/register', (req, res) => {
    const { fName, lName, email, password, password2 } = req.body;

    // if (!fName || lName || !email || !password || !password2) {
    //   res.render('register');
    // }

    // if (password != password2) {
    //   res.render('register');
    // }
    
    //Connecting to Database
    let db = new sqlite.Database(database);

    let query = `SELECT email FROM entities WHERE email = ?`;

    let isFree = true;

    db.get(query, [email], (err,row) => {
      if(err){
          console.log(err);
      }
      return row
      ? isFree = false
      : console.log('it is okay to use');
    });

    if(isFree && !fName && lName && !email && !password){
      db.run(`INSERT INTO entities (fName, lName, email, password) VALUES (?,?,?,?)`, [fName,lName,email,password], (err) => {
        if(err){
          console.log(err);
        }
        console.log('Inserted Successful');
      });
      res.render('login');
    }

    //Closing database
    db.close();
});

//Logout
router.get('/logout', (req, res) => {
    res.redirect('/users/login');
});

module.exports = router;