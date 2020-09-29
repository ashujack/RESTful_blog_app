var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

userSchema = mongoose.Schema({
    firstName: String,
    lastName: String, 
    address: String,
    age: Number,
    gender: String
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);