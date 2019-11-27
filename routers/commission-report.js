const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    objectId = require("mongodb").ObjectID,
    jsonParser = express.json(),
    Commission = require("../modules/commission"),
    Invoice = require("../modules/invoice");
 

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/commission-report', isLoggedIn, function(req, res) {
    res.render("commission-report.html");
});


// @route POST /getCommissionsPart
// @desc Get 10 Commissions and count them, also you can use filter
router.post('/getCommissionsPart', jsonParser, async (req, res) => {
    const filter = req.body.filter;
    const number = req.body.number;
    let resObj = {};

    // Get 10 Commissions
    Commission
    .find(filter, async (err, commissions) => {
        if (err) return res.send("Error with get part Commissions!");
        resObj["commissions"] = commissions;
        
        // Get number of commissions
        resObj["counts"] = await Commission.countDocuments(filter);

        // // Get Bank for every Commission
        // for (let i = 0; i < commissions.length; i++) {
        //     const answer = await Invoice.find({"commissions": new objectId(commissions[i]._id)}, {"merchant": 1, "bank": 1});
        //     resObj["commissions"][i]["merchant"] = answer[0].merchant;
        //     resObj["commissions"][i]["bank"] = answer[0].bank;
        // }
        
        res.send(resObj);
    })
    .sort({_id:-1})
    .skip(number)
    .limit(10);
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
};

module.exports = router;