let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let InvoiceSchema = new mongoose.Schema({
    number: String,
    client_details: Object,
    type: String,
    status: String,
    amount: Object,
    currency: String,
    sepa: String,
    merchant: String,
    bank: String,
    dates: {
        creation_date: Date,
        sent_date: Date,
        received_date: Date,
        approved_date: Date,
        available_date: Date,
        declined_date: Date,
    },
    documents: Object,
    created_by: Object,
    commissions: String,
    comments: Array
});

InvoiceSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Invoice', InvoiceSchema);