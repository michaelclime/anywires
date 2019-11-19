let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let WalletSchema = new mongoose.Schema({
    name: String,
    type: String,
    balance: Number,
    currency: String,
    requisites: {
        beneficiary_name: String,
        beneficiary_address: String,
        bank_name: String, 
        bank_address: String, 
        account_number: String,
        iban: String,
        swift: String
    },
    creating_date: Date,
    created_by: String
});

WalletSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Wallet', WalletSchema);