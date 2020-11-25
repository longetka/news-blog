const {Schema, model} = require("mongoose");
const date = new Date();

const article = new Schema({
  head: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: date
  },
  theme: {
    type: String,
    required: true
  }
});

module.exports = model('article', article);