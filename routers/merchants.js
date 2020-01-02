const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    Merchant = require("../modules/merchant");
    Wallet = require("../modules/wallet");
    jsonParser = express.json();
 
const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/merchants.html', isLoggedIn, visibilityApproval, function(req, res) {
    res.render("merchants.html");
});

router.get('/create-merchant', isLoggedIn, visibilityApproval, function(req, res) {
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


// @route GET /get-all-merchants
// @desc Get ALL Merchant
router.get("/get-all-merchants", jsonParser, async (req, res) => {
    const filter = req.body.filter;
    const merchants = await Merchant.find(filter).sort({"name": 1});
    res.send({
        merchants
    })
});


// @route POST /get-merchants-partly
// @desc Get Merchant Partly
router.post("/get-merchants-partly", jsonParser, async (req, res) => {
    const filter = req.body.filter
    const skip = req.body.skip
    const limit = req.body.limit

    const count = await Merchant.countDocuments(filter)
    const merchants = await Merchant.find(filter).sort({'name': 1}).skip(skip).limit(limit)

    res.send({
        merchants,
        count
    })
})


// @route POST /createMerchant
// @desc Create Merchant
router.post("/createMerchant", jsonParser, (req, res) => {
    const newMerchant = req.body.newMerchant;
    newMerchant["creation_date"] = new Date();

    const arr = [{
            "name": "AW Wallet USD",
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
            "merchant_name": req.body.newMerchant.name,
            "creation_date": new Date()
        },{
            "name": "AW Wallet EUR",
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
            "merchant_name": req.body.newMerchant.name,
            "creation_date": new Date()
        }];
    Wallet.insertMany(arr).then((docs) => {
        const wallet1ID = docs[0]._id;
        const wallet2ID = docs[1]._id;
        newMerchant["inside_wallets"] = [wallet1ID, wallet2ID];
        new Merchant(newMerchant).save()
    }).then(() => res.send("Merchant has been created successfully!"));
});


// @route POST /editMerchant
// @desc Edited one Merchant
router.post("/editMerchant", jsonParser, (req, res) => {
    console.log(req.body)
    const mechantName = req.body.mechantName;
    const newData = req.body.newData;
    Merchant.updateOne({"name": mechantName}, {$set: newData}, {returnOriginal: false}, (err, bank) => {
        if(err) return console.log("Error witch changing Merchant Data!", err);  
        res.send("Merchant has been changed successfully!")
    });
});


// @route POST /editMerchant
// @desc Edited one Merchant
router.post("/edit-merchant", jsonParser, async (req, res) => {
    const mechantName = req.body.mechantName;
    const newData = req.body.newData;
    try {
        await Merchant.updateOne({"name": mechantName}, {$set: newData});
        res.send("Merchant has been changed successfully!")
    } catch (e) {
        console.log('Error: ', e);
        res.send(e); 
    }
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
}


function visibilityApproval(req, res, next) {
    if ( req.user.role === 'Affiliate' || req.user.role === 'Solution Manager' ||  req.user.role === 'Merchant Manager' ||  req.user.role === 'Invoice Manager' ) {

        req.flash('error', 'Sorry, You don\'t have permission to see this page');
        res.redirect('/');
    } else {
        return next()
    }
}

module.exports = router;