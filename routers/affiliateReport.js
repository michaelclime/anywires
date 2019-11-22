const express = require('express'),
    mongo = require('mongodb'),
    objectId = require("mongodb").ObjectID, 
    router = new express.Router(),
    jsonParser = express.json(),
    multer = require("multer"),
    upload = multer({dest:"uploads"}),
    Invoice = require('../modules/invoice'),
    Merchant = require('../modules/merchant'),
    assert = require('assert');

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/affiliateReport.html', isLoggedIn, function(req, res) {
    res.render("affiliateReport.html");
});

router.get('/getDatasList/:email/:date', async function(req, res) {
    const merchants = await Merchant.find( { 'users.affiliate': req.params.email });
    const merchantsName = [];
    merchants.forEach( merchant => merchantsName.push(merchant.name))

    let minDate = 0, maxDate = 0;
    if (req.params.date == 'now') {
        nowDate = new Date();
        minDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate());
        maxDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate() + 1);
    } else {
        nowDate = new Date();
        minDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate() - 1);
        maxDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate() + 1);
    }
    
    const invoices = await Invoice.find( { merchant: { $in: merchantsName }, 
                                        'dates.received_date': { $gt: new Date(minDate), $lt: new Date(maxDate) }} );
    
    res.status(200).send( {merchantsName, invoices});
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
}

module.exports = router;