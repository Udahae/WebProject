var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  room_id: {type: String},
  reviewer: {type: String},
  content: {type: String},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Commend = mongoose.model('Commend', schema);

module.exports = Commend;