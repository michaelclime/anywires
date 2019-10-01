let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    fullname: String,
    password: String,
    typeClass: String,
    role: String,
    merchant: String,
    merchant2: String,
    dateCreation: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);