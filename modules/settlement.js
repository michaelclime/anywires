let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');
let ObjectId = mongoose.Schema.ObjectId;

let SettlementSchema = new mongoose.Schema({
    number: Number,
    dates: {
        creation_date: Date,
        sent_date: Date,
        received_date: Date,
        declined_date: Date
    },
    amount: {
        amount_requested: Number,
        amount_sent: Number
    },
    currency: String,
    merchant: Object,
    status: String,
    invoices: Array,
    comments: Array,
    wallets: Array,
    walletTo: ObjectId,
    walletFrom: ObjectId,
    commissions: Array,
    type: String,
    documents: Array,
    created_by: Object  
}, {
    timestamps: true
});

SettlementSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Settlement', SettlementSchema);