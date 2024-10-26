const mongoose = require('mongoose');

const Player = new mongoose.Schema({
  ID: { // Discord ID
    type: String,
    required: true,
    unique: true
  },
  Dong: { // ₫
    type: Number,
    default: 50, // !
  },
  Bet: {
    type: Number,
    default: 0,
  },
  Date: { // Daily ₫
    type: Date,
    default: null
  },
  Time: { // Voice Channel
    type: Number,
    default: null
  },
  Msg: { // Msg. User?
    type: Boolean,
    default: false // !
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

const User = mongoose.model('User', Player, 'User');

module.exports = User;