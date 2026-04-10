const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  } 
  
  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

// Get all books
public_users.get('/', (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  let isbn = req.params.isbn;

  let isbnBook = Object.values(books).filter(book => book.isbn === isbn);

  if (isbnBook.length > 0) {
    return res.status(200).send(JSON.stringify(isbnBook, null, 4));
  }

  return res.status(404).json({ message: "Book not found" });
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
  let author = decodeURIComponent(req.params.author);

  let bookList = Object.values(books).filter(
    book => book.author.toLowerCase().includes(author.toLowerCase())
  );

  if (bookList.length > 0) {
    return res.status(200).json(bookList);
  }

  return res.status(404).json({ message: "Books by this author not found" });
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
  let title = decodeURIComponent(req.params.title);

  let bookList = Object.values(books).filter(
    book => book.title.toLowerCase().includes(title.toLowerCase())
  );

  if (bookList.length > 0) {
    return res.status(200).json(bookList);
  }

  return res.status(404).json({ message: "Books with this title not found" });
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  let isbn = req.params.isbn;
  let book = Object.values(books).filter(book => book.isbn === isbn);

  if (book) {
    return res.status(200).json(book.reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;