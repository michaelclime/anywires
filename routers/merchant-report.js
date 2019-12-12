const express = require('express'),
    router = new express.Router(),
    objectId = require("mongodb").ObjectID,
    jsonParser = express.json(),
    Promise = require("promise"),
    Invoice = require("../modules/invoice"),
    Wallet = require("../modules/wallet");
    Merchant = require("../modules/merchant");

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/merchant-report', isLoggedIn, function(req, res) {
    res.render("merchant-report.html");
});

// @route POST /getMerchantReportList
// @desc Create Merchant
router.post("/getMerchantReportList", jsonParser, async (req, res) => {
    const filter = req.body.filter;
    const number = req.body.number;
    const limit = req.body.limit;
    let resObj = {};

    // Filter by date
    if (req.body.dateFrom) {
        const dateFrom = req.body.dateFrom;
        const dateTill = req.body.dateTill;
        const creation = datesObj("creation_date", dateFrom, dateTill);
        Object.assign(filter, creation);
    }

    // Get 10 Merchant
    const merchants = await Merchant.find(filter).sort({"name": 1}).skip(number).limit(limit);
    resObj["merchants"] = merchants;

    // Get count of Merchant
    const count = await Merchant.countDocuments(filter);
    resObj["count"] = count;
    
    // Get invoice count
    const invoiceCount = async () => {
        for (let i = 0; i < merchants.length; i++) {
            const countInvoice = await Invoice.countDocuments({"merchant": merchants[i].name});
            resObj[`merchants`][i]["countInvoice"] = countInvoice;

            const wallets = [];
            for (let n = 0; n < merchants[i].inside_wallets.length; n++) {
                const wallet = await Wallet.find({"_id": new objectId(merchants[i].inside_wallets[n]._id)});
                wallets.push({"name": wallet[0].name, "balance": wallet[0].balance, "currency": wallet[0].currency});
            }
            resObj["merchants"][i]["walletsReport"] = wallets;
        }
    };

    invoiceCount().then( () => {
        res.status(200).send(resObj);
    }).catch((err) =>{
        res.status(400).send(err);
        console.log(err);
    })
});

var datesObj = (key, first, second) => {
    var Obj = {};
    if (second === false) {
        var month = new Date(first).getMonth();
        var day = new Date(first).getDate();
        var year = new Date(first).getFullYear();
        second = (month+1) +"/"+ (day+1) +"/"+ year;
        second = new Date(second);
    } 
    Obj[key] = {
        $gte: new Date(first),
        $lte: new Date(second),
    };
    return Obj;
}; 

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
};

module.exports = router;