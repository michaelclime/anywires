let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let MerchantSchema = new mongoose.Schema({
    name: String,
    b2b: Boolean,
    fees: {
        in_c2b: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        in_b2b: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        settlement_btc: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        settlement_atm: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        settlement_c2b_wire: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        settlement_b2b_wire: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        settlement_recall: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        settlement_refund: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        settlement_b2c: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        fee_account_setup: {
            flat: Number,
            additional: Number
        },
        fee_account_mounthly: {
            flat: Number,
            additional: Number
        },
        fee_account_additional: {
            flat: Number,
            additional: Number
        },
        fee_account_dedicated: {
            flat: Number,
            additional: Number
        },
        fine_recall: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        fine_attitude_incorrect_payment_purpose: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        fine_attitude_wrong_amount: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        fine_attitude_more_then_1_payment: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        fine_attitude_payment_without_invoice: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        fine_attitude_payment_from_blocked: {
            percent: Number,
            flat: Number,
            additional: Number
        },
        fine_attitude_more_then_1percent_recalls: {
            percent: Number,
            flat: Number,
            additional: Number
        }
    },
    specifications: {
        background: String,
        first_color: String,
        second_color: String,
        logo: String,
        tagline: String
    },
    support_email: String,
    promo_code: String,
    users: {
        merchant_manager: Array,
        invoice_manager: Array,
        affiliate: String
    },
    wallets: Array,
    available_banks: Array,
    specifications_b2b: {
        beneficiary_name: String,
        beneficiary_address: String,
        bank_name: String,
        bank_address: String,
        iban: String,
        swift: String
    },
    creating_date: Date,
    created_by: Object,
    inside_wallets: Array,
    balance_EUR: {
        balance_received: Number,
        balance_approved: Number,
        balance_available: Number,
        balance_frozen: Number
    },
    balance_USD: {
        balance_received: Number,
        balance_approved: Number,
        balance_available: Number,
        balance_frozen: Number
    },
});

MerchantSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Merchant', MerchantSchema);