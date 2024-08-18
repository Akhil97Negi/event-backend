const express = require('express');
const { getAllUsers, userRegister, userLogin } = require('../controllers/authController');
const Auth = require('../middleware/authmiddleware');

const userRouter = express.Router();

// Get all users (admin only)
userRouter.get('/all', Auth(['admin']), getAllUsers);

// Register a new user
userRouter.post('/register', userRegister);

// Login
userRouter.post('/login', userLogin);

module.exports = userRouter;
