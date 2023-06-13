const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Write code to check if the username is valid
  // For example, check for minimum length or allowed characters
  // Return true if valid, false otherwise
};

const authenticatedUser = (username, password) => {
  // Write code to check if the username and password match the ones we have in records
  // You can compare the username and password with the stored users' credentials
  // Return true if authenticated, false otherwise
};

// Register a new user
regd_users.post("/register", (req, res) => {
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

    // Generate a JWT token for the registered user
    const token = jwt.sign({ username }, "your_secret_key");
    // Return a success message
    return res.status(200).json({ message: "User registered successfully" });
});
  

// Add a book review
regd_users.put("/auth/review/:id", (req, res) => {
    const id = req.params.id;
    const review = req.query.review;
    const username = req.user.username;
  
    if (!id || !review) {
      return res.status(400).json({ message: "ID and review content are required." });
    }
  
    // Check if the book exists
    const book = Object.values(books).find(book => book.id === id);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    // Check if the user already has a review for the book
    if (book.reviews[username]) {
      // Modify the existing review
      book.reviews[username] = review;
      return res.json({ message: "Review modified successfully." });
    }
  
    // Add a new review for the book
    book.reviews[username] = review;
    return res.json({ message: "Review added successfully." });
  });
  
  regd_users.delete("/auth/review/:id", (req, res) => {
    const isbn = req.params.id;
    const username = req.user.username;
  
    if (!isbn) {
      return res.status(400).json({ message: "ISBN is required." });
    }
  
    // Check if the book exists
    const book = Object.values(books).find(book => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    // Check if the user has a review for the book
    if (!book.reviews[username]) {
      return res.status(404).json({ message: "Review not found for the given user." });
    }
  
    // Delete the review
    delete book.reviews[username];
    return res.json({ message: "Review deleted successfully." });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
