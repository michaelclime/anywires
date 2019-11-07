let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let InvoiceSchema = new mongoose.Schema({
    number: String,
    client_details: Object,
    type: String,
    status: String,
    amount: {
        amount_requested: Number,
        amount_sent: Number,
        amount_received: Number,
        amount_approved: Number,
        amount_available: Number
    },
    currency: String,
    sepa: Boolean,
    merchant: String,
    bank: String,
    dates: {
        creation_date: Date,
        sent_date: Date,
        received_date: Date,
        approved_date: Date,
        available_date: Date,
        declined_date: Date,
        settled_date: Date,
        frozen_date: Date,
        unfrozen_date: Date,
        recall_date: Date
    },
    documents: Object,
    created_by: Object,
    commissions: Array,
    comments: Array,
    settleSelectedStatus: Boolean,
    before_freeze: String
}, {
    timestamps: true
});

InvoiceSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Invoice', InvoiceSchema);