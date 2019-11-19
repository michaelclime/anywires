const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    objectId = require("mongodb").ObjectID,
    jsonParser = express.json(),
    Wallet = require("../modules/wallet");
 

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/wallets', isLoggedIn, function(req, res) {
    res.render("wallets.html");
});


// @route POST /getWalletsPart
// @desc Get 10 Wallets and count them, also you can use filter
router.post('/getWalletsPart', jsonParser, async (req, res) => {
    const filter = req.body.filter;
    const number = req.body.number;
    let resObj = {};

    // Get 10 wallets
    Wallet
    .find(filter, async (err, wallets) => {
        if (err) return res.send("Error with get part Wallets!");
        resObj["wallets"] = wallets;
        
        // Get number of wallets
        resObj["counts"] = await Wallet.countDocuments();
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