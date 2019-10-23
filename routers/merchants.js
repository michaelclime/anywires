const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    jsonParser = express.json();
 
const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/merchants.html', isLoggedIn, function(req, res) {
    res.render("merchants.html");
});

router.get('/merchantReport.html', isLoggedIn, function(req, res) {
    res.render("merchantReport.html");
});

router.get("/getMerchants", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{
        db.collection("merchants").find({}).sort({"name": 1}).toArray(function(err, merchants){
            if(err) return console.log("Error with upload Merchants!", err);
            db.close();
            res.send(merchants);
        })
    });
});

router.post("/getPart-Merchants", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
    var number = req.body.number;
    var filter = req.body.filter;

        db.collection("merchants")
        .find(filter, { score: { $meta: "textScore" } })
        .skip(number)
        .limit(10)
        .sort({ score: { $meta: "textScore" } })
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

router.post("/postMerchant",jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        db.collection("merchants").insertOne(req.body, function(err, result) {
            if(err) return console.log("Bad POST Merchants request!", err);
            db.close();
            res.send(req.body);
        });
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