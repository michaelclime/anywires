let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let WalletSchema = new mongoose.Schema({
    name: String,
    type: String,
    balance: Number,
    currency: String,
    requisites: Object,
    creating_date: Date,
    created_by: Object
});

WalletSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Wallet', WalletSchema);