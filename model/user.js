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
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 6,
  }
});

module.exports = model('user', user);

// module.exports.getUserByEmail = function(email, callback) {
//   const query = {email: email};
//   user.findOne(query, callback);
// };

// module.exports.comparePass = function(passFromDb, userPass, callback) {
//   bcrypt.compare(passFromDb, userPass, (err, isMatch) => {
//     if (err) throw err;
//     callback(null, isMatch);
//   })
// }