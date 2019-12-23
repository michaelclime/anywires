let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    fullname: String,
    password: String,
    typeClass: String,
    role: String,
    merchant: Array,
    dateCreation: Date,
    lastLoginDate: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: true
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);