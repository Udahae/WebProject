var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  email: {type: String},
  title: {type: String},
  explain: {type: String},
  city: {type: String},
  address: {type: String},
  pay: {type: String},
  facility: {type: String},
  rule: {type: String},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Room = mongoose.model('Room', schema);

module.exports = Room;