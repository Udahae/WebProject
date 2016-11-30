var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  send_email: {type: String},
  take_email: {type: String},
  room_id: {type: String},
  checkin: {type: Date}, 
  checkout: {type: Date},
  persons: {type: String},
  result: {type: String}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Hosting = mongoose.model('Hosting', schema);

module.exports = Hosting;