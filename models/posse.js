var mongoose = require('mongoose');

var posseSchema = new mongoose.Schema({
  name: String,
  members: String,
  created_at: Date,
  updated_at: Date
});

var Posse = mongoose.model('Posse', posseSchema);

module.exports = Posse;
