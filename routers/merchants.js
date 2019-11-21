const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    Merchant = require("../modules/merchant");
    Wallet = require("../modules/wallet");
    jsonParser = express.json();
 
const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/merchants.html', isLoggedIn, function(req, res) {
    res.render("merchants.html");
});

router.get('/create-merchant', isLoggedIn, function(req, res) {
    res.render("create-merchant.html");
});

router.get('/merchantReport.html', isLoggedIn, function(req, res) {
    res.render("merchantReport.html");
});

router.get("/getMerchants", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{
        db.collection("merchants").find({}).sort({"name": 1}).toArray(function(err, merchants){
            if(err) return console.log("Error with upload Merchants!", err);
            res.send(merchants);
        })
    });
});

router.post("/getPart-Merchants", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
    var number = req.body.number;
    var filter = req.body.filter;

        db.collection("merchants")
        .find(filter)
        .sort({"name": 1})
        .skip(number)
        .limit(10)
        .toArray(function(err, merchants){
            if(err) return console.log("Error with upload Merchants!", err);
            db.close();
            res.send(merchants);
        })
    });
});

router.post("/getNumber-Merchants", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        var filter = req.body.filter;
        filter === undefined ? filter = {} : "";

        db.collection("merchants").find(filter).count(function(err, merchants){
            if(err) return console.log("Error with upload Number of Invoices!", err);
            
            db.close();
            res.send({"numbers": merchants});
        })
    });
});

router.post("/createMerchant", jsonParser, (req, res) => {
    const newMerchant = req.body.newMerchant;
    newMerchant["creation_date"] = new Date();
    const arr = [{
            "name": "AW Wallet",
            "type": "Anywires",
            "balance": 0,
            "currency": "USD",
            "requisites": {
                "beneficiary_name": "",
                "beneficiary_address": "",
                "bank_name": "",
                "bank_address": "",
                "account_number": "",
                "iban": "",
                "swift": ""
            },
            "created_by": req.body.newMerchant.created_by,
            "merchant_name": req.body.newMerchant.name
        },{
            "name": "AW Wallet",
            "type": "Anywires",
            "balance": 0,
            "currency": "EUR",
            "requisites": {
                "beneficiary_name": "",
                "beneficiary_address": "",
                "bank_name": "",
                "bank_address": "",
                "account_number": "",
                "iban": "",
                "swift": ""
            },
            "created_by": req.body.newMerchant.created_by,
            "merchant_name": req.body.newMerchant.name
        }];
    Wallet.insertMany(arr).then((docs) => {
        const wallet1ID = docs[0]._id;
        const wallet2ID = docs[1]._id;
        newMerchant["wallets"] = [wallet1ID, wallet2ID];
        new Merchant(newMerchant).save()
    }).then(() => res.send("Merchant has been created successfully!"));
});

// @route POST /editMerchant
// @desc Edited one Merchant
router.post("/editMerchant", jsonParser, (req, res) => {
    const mechantName = req.body.mechantName;
    const newData = req.body.newData;
    Merchant.updateOne({"name": mechantName}, {$set: newData}, {returnOriginal: false}, (err, bank) => {
        if(err) return console.log("Error witch changing Merchant Data!", err);  
        res.send("Merchant has been changed successfully!")
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
}

module.exports = router;