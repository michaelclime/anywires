let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let DocumentSchema = new mongoose.Schema({
    creator: String,
    type: String,
    status: String,
    filename: String,
    creation_date: Date,
    originalname: String,
    encoding: String,
    mimetype: String,
    size: Number
});

DocumentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Document', DocumentSchema);