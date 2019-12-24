const express = require('express'),
    router = new express.Router(),
    objectId = require("mongodb").ObjectID,
    jsonParser = express.json(),
    Invoice = require("../modules/invoice"),
    Wallet = require("../modules/wallet");
    Merchant = require("../modules/merchant");


router.get('/merchant-report', isLoggedIn, function(req, res) {
    res.render("merchant-report.html");
});


// @route POST /get-merchant-report
// @desc Create Merchant
router.post("/get-merchant-report", jsonParser, async (req, res) => {
    const filter = req.body.filter
    const number = req.body.number
    const limit = req.body.limit
    let resObj = {}

    // Filter by date
    if (req.body.dateFrom) {
        const dateFrom = req.body.dateFrom
        const dateTill = req.body.dateTill
        const creation = datesObj("creation_date", dateFrom, dateTill)
        Object.assign(filter, creation)
    }
    
    try {
        // Get count of Merchant
        const count = await Merchant.countDocuments(filter)
        // Get 10 Merchant
        const merchants = await Merchant.aggregate([
            { $match : filter },
            { 
                $lookup: { 
                    from: 'wallets',
                    localField: 'inside_wallets',
                    foreignField: '_id',
                    as: 'walletsReport'
                }
            }
        ]).sort({"name": 1}).skip(number).limit(limit)
        
        resObj["merchants"] = merchants;

        // Count invoices for every merchants
        for (let i = 0; i < merchants.length; i++) {
            const countInvoice = await Invoice.countDocuments({"merchant": merchants[i].name});
            resObj[`merchants`][i]["countInvoice"] = countInvoice;
        }

        res.send({
            merchants: resObj.merchants,
            count
        })
    } catch (e) {
        res.send(e)
    }
})


// Function for Dates Range START.
var datesObj = (key, first, second) => {
    var Obj = {};
    if (second === false) {
        var month = new Date(first).getMonth();
        var day = new Date(first).getDate();
        var year = new Date(first).getFullYear();
        second = (month+1) +"/"+ (day+1) +"/"+ year;
        second = new Date(second);
        second.setHours(23);
        second.setMinutes(59);
        second.setSeconds(59);
    } 
    Obj[key] = {
        $gte: new Date(first),
        $lte: new Date(second),
    };
    return Obj;
}; 
// Function for Dates Range END.

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
};

module.exports = router;