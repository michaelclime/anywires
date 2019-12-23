let mongoose = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

let BankSchema = new mongoose.Schema({
    name: String,
    beneficiary_name: String,
    solution_name: String,
    country: Array,
    currency: Array,
    beneficiary_address: String,
    max_wire: Number,
    min_wire: Number,
    iban_USD: String,
    iban_EUR: String,
    swift_bic: String,
    bank_address: String,
    company_site: String,
    stop_limit: Number,
    stop_limit_reached: Boolean,
    sepa: Boolean,
    b2b: Boolean,
    company_logo: String,
    balance_EUR: {
        balance_requested: Number,
        balance_sent: Number,
        balance_received: Number,
        balance_frozen: Number
    },
    balance_USD: {
        balance_requested: Number,
        balance_sent: Number,
        balance_received: Number,
        balance_frozen: Number
    },
    active: Boolean,
    balance_settlement: Number,
    description: String,
    creation_date: Date,
    created_by: String,
    solution_fees: {
        in_c2b:{
            percent: Number,
            flat: Number
        },
        in_b2b:{
            percent: Number,
            flat: Number
        },
        transfer:{
            percent: Number,
            flat: Number
        },
        settlement_btc:{
            percent: Number,
            flat: Number
        },
        settlement_atm:{
            percent: Number,
            flat: Number
        },
        settlement_c2b_wire:{
            percent: Number,
            flat: Number
        },
        settlement_b2b_wire:{
            percent: Number,
            flat: Number
        },
        settlement_recall:{
            percent: Number,
            flat: Number
        },
        fee_account_additional:{
            percent: Number,
            flat: Number
        },
        fee_account_dedicated:{
            percent: Number,
            flat: Number
        },
        fee_account_monthly:{
            percent: Number,
            flat: Number
        },
        fee_account_setup:{
            percent: Number,
            flat: Number
        },
        fee_account_setup:{
            percent: Number,
            flat: Number
        },
        fine_attitude_incorrect_payment_purpose:{
            percent: Number,
            flat: Number
        },
        fine_attitude_more_then_1percent_recalls:{
            percent: Number,
            flat: Number
        },
        fine_attitude_more_then_1_payment:{
            percent: Number,
            flat: Number
        },
        fine_attitude_payment_from_blocked:{
            percent: Number,
            flat: Number
        },
        fine_attitude_payment_without_invoice:{
            percent: Number,
            flat: Number
        },
        fine_attitude_wrong_amount:{
            percent: Number,
            flat: Number
        },
        fine_recall:{
            percent: Number,
            flat: Number
        },
        settlement_b2c:{
            percent: Number,
            flat: Number
        },
        settlement_refund:{
            percent: Number,
            flat: Number
        }
    }
}, {
    timestamps: true
});

BankSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Bank', BankSchema);