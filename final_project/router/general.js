// import getBooks from "../handlers/book-handler.js"
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// const getBooks = require("../handlers/book-handler.js");

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  const getBooks = new Promise((resolve, reject) => {
  // Simulation of request to the database
    setTimeout(() => {
      return resolve(books);
    }, 1000);
  });

  return getBooks.then((result) => {
    return res.send(JSON.stringify(result, null, 4));
  });
});

// axios.get('/')
//   .then((response) => {
//     return response.send(JSON.stringify(books, null, 4));
//   });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  return res.send(books[ISBN]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksArray = Object.values(books);
  const bookFiltered = booksArray.filter((book) => {
    return book.author === author;
  });
  return res.send(bookFiltered);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksArray = Object.values(books);
  const bookFiltered = booksArray.filter((book) => {
    return book.title === title;
  });
  return res.send(bookFiltered);
});

//  Get book review by ISBN
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  return res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
