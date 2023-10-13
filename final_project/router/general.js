const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;


    
    if (Object.keys(users).includes(username)) {
      return res.status(409).json({ message: "Username already exists." });
    }

 
    users[username] = { username, password };

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user." });
  }
});


public_users.get('/', function (req, res) {
  return new Promise((resolve, reject) => {
    const bookList = Object.values(books).map(book => {
      return {
        title: book.title,
        author: book.author,
        reviews: book.reviews
      };
    });

    const response = {
      message: "List of books:",
      books: bookList
    };

    resolve(response);
  })
  .then(response => {
    return res.status(200).json(response);
  })
  .catch(error => {
    return res.status(500).json({ message: "Error" });
  });
});


public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return new Promise((resolve, reject) => {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];

      const response = {
        message: "Books by ISBN",
        book: {
          isbn: isbn,
          title: book.title,
          author: book.author,
          reviews: book.reviews
        }
      };

      resolve(response);
    } else {
      reject(new Error("Not found."));
    }
  })
  .then(response => {
    return res.status(200).json(response);
  })
  .catch(error => {
    return res.status(404).json({ message: error.message });
  });
});



public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  return new Promise((resolve, reject) => {
    const matchingBooks = Object.keys(books).filter(isbn => books[isbn].author === author);

    if (matchingBooks.length > 0) {
      const bookDetails = matchingBooks.map(isbn => {
        const book = books[isbn];
        return {
          isbn: isbn,
          title: book.title,
          author: book.author,
          reviews: book.reviews
        };
      });

      const response = {
        message: "Books by author",
        books: bookDetails
      };

      resolve(response);
    } else {
      reject(new Error("Books not found."));
    }
  })
  .then(response => {
    return res.status(200).json(response);
  })
  .catch(error => {
    return res.status(404).json({ message: error.message });
  });
});



public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  return new Promise((resolve, reject) => {
    const matchingBooks = Object.keys(books).filter(isbn => books[isbn].title.toLowerCase().includes(title.toLowerCase()));

    if (matchingBooks.length > 0) {
      const bookDetails = matchingBooks.map(isbn => {
        const book = books[isbn];
        return {
          isbn: isbn,
          title: book.title,
          author: book.author,
          reviews: book.reviews
        };
      });

      const response = {
        message: "Book(s) by title.",
        books: bookDetails
      };

      resolve(response);
    } else {
      reject(new Error("No books found."));
    }
  })
  .then(response => {
    return res.status(200).json(response);
  })
  .catch(error => {
    return res.status(404).json({ message: error.message });
  });
});



public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; 


  if (books.hasOwnProperty(isbn)) {
    const bookReviews = books[isbn].reviews;

    const response = {
      message: "Reviews by ISBN",
      isbn: isbn,
      reviews: bookReviews
    };

    return res.status(200).json(response);
  } else {
  
    return res.status(404).json({ message: "Not found." });
  }
});



module.exports.general = public_users;