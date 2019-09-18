let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let InvoiceSchema = new mongoose.Schema({
    number: Number,
    client_details: Object,
    type: String,
    status: String,
    amount: Object,
    currency: Object,
    sepa: String,
    merchant: String,
    bank: Array,
    dates: Object,
    documents: Object,
    created_by: Object,
    commissions: String,
    comments: Array
});

InvoiceSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Invoice', InvoiceSchema);