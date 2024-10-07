const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique: true
  },
  currency: {
    type: Number,
    default: 1000, // !
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
