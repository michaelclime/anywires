let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let InvoiceSchema = new mongoose.Schema({
    number: Number,
    client_details: Object,
    type: String,
    status: String,
    amount: Object,
    currency:  Object,
    sepa:  String,
    merchant:String,
    dates: Object
});

InvoiceSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Invoice', InvoiceSchema);