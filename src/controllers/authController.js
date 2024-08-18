const UserModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// const userRegister = async (req, res) => {
//   const { username, email, password, role } = req.body;
//   try {
//     if (!username || !email || !password) {
//       return res.status(400).json('All fields are required');
//     }

//     // Ensure valid role or default to 'user'
//     const validRoles = ['admin', 'user'];
//     const assignedRole = validRoles.includes(role) ? role : 'user';

//     const existUser = await UserModel.findOne({ email });
//     if (existUser) {
//       return res.status(409).json('An account with this email already exists. Please try to log in.');
//     }

//     const saltRounds = 10;
//     const hashPassword = await bcrypt.hash(password, saltRounds);

//     const newUser = new UserModel({ username, email, password: hashPassword, role: assignedRole });
//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully", user: newUser });
    
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

const userRegister = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json('All fields are required');
    }

    // Ensure valid role or default to 'user'
    const validRoles = ['admin', 'user'];
    const assignedRole = validRoles.includes(role) ? role : 'user';

    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(409).json('An account with this email already exists. Please try to log in.');
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserModel({ username, email, password: hashPassword, role: assignedRole });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Login
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json('All fields are required');
    }

    const existUser = await UserModel.findOne({ email });
    if (!existUser) {
      return res.status(404).json('Email is not registered. Please try to register.');
    }

    const isMatch = await bcrypt.compare(password, existUser.password);
    if (!isMatch) {
      return res.status(401).json('Incorrect password');
    }

    const payload = { email: existUser.email, id: existUser._id, role: existUser.role };
    const secret_key = process.env.SECRET;
    
    // JWT sign and create token
    jwt.sign(payload, secret_key, { expiresIn: '1d' }, (err, token) => {
      if (err) {
        console.log("JWT Sign Error:", err.message);
        return res.status(500).json('Error signing the token');
      }
      res.status(200).json({ user: existUser, token });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getAllUsers, userRegister, userLogin };
