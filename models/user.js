
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  alias: String,
  password: String,
  avatar_url: String,
  created_at: Date,
  updated_at: Date
});

var User = mongoose.model('User', userSchema);

module.exports = User;
