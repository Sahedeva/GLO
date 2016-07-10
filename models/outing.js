var mongoose = require('mongoose');

var outingSchema = new mongoose.Schema({
  name: String,
  destination: String,
  time: String,
  lat: Number,
  lng: Number,
  created_at: Date,
  updated_at: Date
});

var Outing = mongoose.model('Outing', outingSchema);

module.exports = Outing;
