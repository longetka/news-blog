const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs');
const config = require('../config/config');

const user = new Schema({
  online: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    lowercase: true,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 6,
  }
});

module.exports = model('user', user);