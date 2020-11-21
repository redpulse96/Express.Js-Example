const mongoose = require('mongoose');

const driversSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  license_number: {
    type: String,
    required: true,
    unique: true
  },
  car_number: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone_number: {
    type: Number,
    required: true,
    unique: true
  },
  latitude: {
    type: String
  },
  longitude: {
    type: String
  },
});
module.exports = mongoose.model('drivers', driversSchema);