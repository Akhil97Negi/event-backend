const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async (url) => {
    try {
        await mongoose.connect(url)
        console.log('MongoDB Connected');
    } catch (error) {
      console.log(error)
    }
};

module.exports = connectDB;
