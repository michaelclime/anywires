let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let CommissionSchema = new mongoose.Schema({
    created_by: String,
    amount: Number,
    currency: String,
    type: String,
    percentage: Number,
    flat: Number,
    additional: Number,
    creation_date: Date,
    bank_commision: Number,
    left_from_transfer: Number,
    bank: String,
    merchant: String
});

CommissionSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Commission', CommissionSchema);