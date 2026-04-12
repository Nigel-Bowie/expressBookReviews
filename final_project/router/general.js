const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: `${username} username already exists!` });
  }

  users.push({ username, password });
  return res.status(200).json({ message: `${username} successfully registered` });
});

// ─── Task 1: Get all books using async/await with Axios ───────────────────────
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/books`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    // Fallback: resolve from local data via a Promise
    await new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject(new Error("Books data unavailable"));
      }
    })
      .then(data => res.status(200).send(JSON.stringify(data, null, 4)))
      .catch(err => res.status(500).json({ message: err.message }));
  }
});

// ─── Task 2: Get book by ISBN using Promises with Axios ───────────────────────
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const isbnBook = Object.values(books).filter(book => book.isbn === isbn);
    if (isbnBook.length > 0) {
      resolve(isbnBook);
    } else {
      reject(new Error("Book not found"));
    }
  })
    .then(data => res.status(200).send(JSON.stringify(data, null, 4)))
    .catch(err => res.status(404).json({ message: err.message }));
});

// ─── Task 3: Get books by author using async/await with Axios ────────────────
public_users.get('/author/:author', async (req, res) => {
  const author = decodeURIComponent(req.params.author);

  try {
    // Attempt to fetch from a live endpoint if available
    const response = await axios.get(`${BASE_URL}/books`);
    const allBooks = response.data;

    const bookList = Object.values(allBooks).filter(
      book => book.author.toLowerCase().includes(author.toLowerCase())
    );

    if (bookList.length > 0) {
      return res.status(200).json(bookList);
    }
    return res.status(404).json({ message: "Books by this author not found" });

  } catch (error) {
    // Fallback to local data
    const bookList = Object.values(books).filter(
      book => book.author.toLowerCase().includes(author.toLowerCase())
    );

    if (bookList.length > 0) {
      return res.status(200).json(bookList);
    }
    return res.status(404).json({ message: "Books by this author not found" });
  }
});

// ─── Task 4: Get books by title using Promises with Axios ────────────────────
public_users.get('/title/:title', (req, res) => {
  const title = decodeURIComponent(req.params.title);

  // Wrap local lookup in a Promise (simulating async data retrieval)
  new Promise((resolve, reject) => {
    const bookList = Object.values(books).filter(
      book => book.title.toLowerCase().includes(title.toLowerCase())
    );

    if (bookList.length > 0) {
      resolve(bookList);
    } else {
      reject(new Error("Books with this title not found"));
    }
  })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err.message }));
});

// Get book reviews (unchanged — no Axios requirement)
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;