const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  } else if (isValid(username)) {
    users.push({"username": username, "password": password});
    return res.status(200).json({message: "User successfully registered"});
  } else {      
  return res.status(300).json({message: "User already exists!"});
}});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let bookList = books;
  return res.send(JSON.stringify(bookList,null,4));
  return res.status(300).json({message: "The list of books is displayed"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book && book.length > 0) {
    return res.send(JSON.stringify(book, null, 4));
  }
  return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let bookList = Object.values(books).filter(book => book.author === author);
  if (bookList && bookList.length > 0) {
    return res.send(JSON.stringify(bookList, null, 4));
  }
  return res.status(404).json({message: "Books by this author not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let bookList = Object.values(books).filter(book => book.title === title);
  if (bookList && bookList.length > 0) {
    return res.send(JSON.stringify(bookList, null, 4));
  }
  return res.status(404).json({message: "Books with this title not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book && book.length > 0) {
    return res.send(JSON.stringify(book.reviews, null, 4));
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
