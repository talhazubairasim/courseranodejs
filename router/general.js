const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const jwt = require('jsonwebtoken');
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    if (users.find(user => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Add the new user to the users array
    users.push({ username, password });
  
    // Return a success message
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function(req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:id', async function (req, res) {
    const { id } = req.params;

    try {
        const response = await axios.get(`http://localhost:5000/books/${id}`);
        const book = response.data;
        res.send(JSON.stringify(book, null, 2));
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).send('Book not found');
        } else {
            console.error(error);
            res.status(500).send('Error retrieving book details');
        }
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const { author } = req.params;

    try {
        const response = await axios.get('http://localhost:5000/books');
        const bookList = response.data.filter(book => book.author.toLowerCase() === author.toLowerCase());
        if (bookList.length > 0) {
            res.send(JSON.stringify(bookList, null, 2));
        } else {
            res.status(404).send('No books found for the author');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving book details');
    }
});

// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
    const { title } = req.params;

    try {
        const response = await axios.get('http://localhost:5000/books');
        const bookList = response.data.filter(book => book.title.toLowerCase() === title.toLowerCase());
        if (bookList.length > 0) {
            res.send(JSON.stringify(bookList, null, 2));
        } else {
            res.status(404).send('No books found with the given title');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving book details');
    }
});

public_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Find the user with the provided username and password
    const user = users.find(user => user.username === username && user.password === password);
  
    // If the user is found, generate a JWT token
    if (user) {
      const token = jwt.sign({ username }, 'your_secret_key'); // Replace 'your_secret_key' with your actual secret key
  
      // Return the token as a response
      return res.status(200).json({ token });
    }
  
    // If the user is not found or the password is incorrect, return an error response
    return res.status(401).json({ message: "Invalid username or password" });
});

// Get book review
public_users.get('/review/:id', function (req, res) {
    const { id } = req.params;
  
    const book = books[id];
  
    if (book) {
      const reviews = book.reviews;
      res.send(JSON.stringify(reviews, null, 2));
    } else {
      res.status(404).send('Book not found');
    }
});

module.exports.general = public_users;
