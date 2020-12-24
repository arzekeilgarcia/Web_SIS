const express = require('express');
const router = express.Router();
const sqlite = require('sqlite3').verbose();

//Database file route
const database = 'student_information.db';

//Render Login Page
router.get('/login', (req,res) => {
  res.render('login', {
    success: ''
  });
});

//Render Register Page
router.get('/register', (req,res) => {
  res.render('register');
});

//Login
router.post('/login', (req,res) => { 
  const {email, password} = req.body;
  let errors = [{msg: "Incorrect email or password"}];

  //Connecting to Database
  let db = new sqlite.Database(database);

  let query = `SELECT * FROM entities WHERE email = ? AND password = ?`;

  db.get(query, [email,password], (err,row) => {
      if(err){
          console.log(err);
      }
      return row
      ? res.render('dashboard', {
        row, 
        success: ''
      })
      : res.render('login', {
        errors,
        success: ''
      });
  });
    
  //Closing database
  db.close();

});

//Register
router.post('/register', (req, res) => {
  const { fName, lName, email, password, password2 } = req.body;
  let errors = [];
  if (password != password2) {
    errors.push({msg: 'Passwords do not match'});
  }
  if (!fName || !lName || !email || !password || !password2) {
    errors.push({msg: 'Please enter all fields'});
  }
  if(errors.length > 0){
    res.render('register', {
      errors
    });
  }
  else{
    //Connecting to Database
    let db = new sqlite.Database(database);

    let query = `SELECT email FROM entities WHERE email = ?`;

    errors.push({msg: 'this email is already in use'});

    db.get(query, [email], (err,row) => {
      if(err){
          console.log(err);
      }
      return row
      ? res.render('register', {
        errors
      })
      : db.run(`INSERT INTO entities (fName, lName, email, password) VALUES (?,?,?,?)`, [fName,lName,email,password], (err) => {
        if(err){
          return console.log(err.message);
        }
        res.render('login', {
          success: 'Successfully Registered'
        });
      });
    });

    //Closing database
    db.close();
  }    
  
});

//Logout
router.get('/logout', (req, res) => {
  res.render('login', {
    success: 'Successfully Logged Out'
  });
});

module.exports = router;