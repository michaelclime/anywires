let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let BankSchema = new mongoose.Schema({
    name: String,
    beneficiary_name: String,
    solution_name: String,
    country: String,
    currency: Array,
    beneficiary_address: String,
    max_wire: Number,
    min_wire: Number,
    iban_usd: String,
    iban_eur: String,
    swift_bic: String,
    bank_address: String,
    company_site: String,
    stop_limit: Number,
    sepa: Boolean,
    b2b: Boolean,
    company_logo: String,
    balance_EUR: {
        balance_requested: Number,
        balance_sent: Number,
        balance_received: Number,
        balance_approved: Number,
        balance_available: Number,
        balance_settlement: Number
    },
    balance_USD: {
        balance_requested: Number,
        balance_sent: Number,
        balance_received: Number,
        balance_approved: Number,
        balance_available: Number,
        balance_settlement: Number
    },
    active: Boolean
});

BankSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Bank', BankSchema);