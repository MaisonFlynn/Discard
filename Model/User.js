const mongoose = require('mongoose');

const Player = new mongoose.Schema({
  ID: { // Discord ID
    type: String,
    required: true,
    unique: true
  },
  Dong: { // ₫
    type: Number,
    default: 1000, // !
  },
  Bet: {
    type: Number,
    default: 0,
  },
  Gayme: { // State
    pHand: {
      type: Array,
      default: []
    },
    dHand: {
      type: Array,
      default: []
    },
    kaput: {
      type: Boolean,
      default: false
    }
  }
});

const User = mongoose.model('User', Player);

module.exports = User;