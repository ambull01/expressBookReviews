const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if(username && password) {
    if (!doesExist(username)) {
    users.push({"username":username, "password":password});
    return res.status(200).json({message: "User successfully registered"});
  } else {
    return res.status(404).json({message: "User already exists!"});
  }
 }
 return res.status(404).json({message: 'Unable to register user.'});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4))
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn;
  res.send(books[isbn])  

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  for(let i = 0; i < bookKeys.length; i++) {
    const book = books[bookKeys[i]];
    if(book.author === author) {
      return res.json(book);
    }
  }
  res.status(404).send('No books found for that author');
 });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  for(let i = 0; i < bookKeys.length; i++) {
    const book = books[bookKeys[i]];
    if(book.title === title) {
      return res.json(book);
    }
  }
  res.status(404).send('No books found for that title')
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let reviewsbyisbn = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["review"] === req.params.review) {
      reviewsbyisbn.push({"reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({reviewsbyisbn}, null, 4));
});

module.exports.general = public_users;

