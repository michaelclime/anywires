let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let MerchantSchema = new mongoose.Schema({
    name: String,
    b2b: Boolean,
    fees: {
        setup_fee: Number,
        wire_recall: Number,
        settlement_fee_flat: Number,
        monthly_fee: Number,
        incoming_transfer: Number,
        incoming_wire: Number,
        settlement_fee_percent: Number,
        settlement_return: Number,
        refund_fee_flat: Number,
        refund_fee_percent: Number,
    },
    specifications: {
        background: String
    },
    support_email: String,
    promo_code: String,
    users: Object,
    wallets: Array,
    available_banks: Array,
    specifications_b2b: Object,
    creating_date: Date,
    created_by: Object,
    inside_wallets: Array
});

MerchantSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Merchant', MerchantSchema);