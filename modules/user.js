let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username: String,
    fullname: String,
    password: String,
    password: String,
    typeClass: String,
    role: String,
    merchant: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);