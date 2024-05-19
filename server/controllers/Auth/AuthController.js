// authController.js
const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bcrypt = require('bcrypt');

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
const User = require('../../models/User');
const router = express.Router();
const { db, executeQuery } = require('../../db/connection')
module.exports = {
  register: async (req, res) => {
    upload.single('file')(req, res, async (err) => {
      try {
        const { fullname, email, password } = req.body;

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({ fullname, email, password: hashedPassword });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });

        res.json({ token, user });
      } catch (error) {
        console.error('Registration failed:', error);
        res.status(500).json({ message: 'Registration failed. Please try again later.' });
      }
    });
  },

  login: async (req, res) => {
    upload.single('file')(req, res, async (err) => {
      try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, user });
      } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ message: 'Login failed. Please try again later.' });
      }
    });
  },
  getAllUsers: async (req, res) => {
    try {
    const users = await User.findAll(); 
    const userId = req.params.currentUser;
    const filtered = users.filter(user => user.id !== userId );
    const userData = Promise.all(filtered.map((user) => {
      return { user: { email: user.email, fullname: user.fullname,receiverId: user.id  } }
    }))
    res.json(await userData);
  } catch (error) {
    res.status(500).json({ message: 'Something went Wrong.' });
  }
  }
}
