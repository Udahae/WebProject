var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  name : {type: String},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  password: {type: String},
  bookplace: {type: String},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var User = mongoose.model('User', schema);

module.exports = User;
