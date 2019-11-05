const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    objectId = require("mongodb").ObjectID,
    jsonParser = express.json(),
    Bank = require("../modules/bank");
 

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/banks.html', isLoggedIn, function(req, res) {
    res.render("banks.html");
});

router.get('/create-bank', isLoggedIn, function(req, res) {
    res.render("create-bank.html");
});

router.get("/getBanks", (req, res) => {
    mongo.connect(url, (err, db) =>{
        db.collection("banks").find({}).sort({"name": 1}).toArray(function(err, bank){
            if(err) return console.log("Error with upload Banks!", err);
            db.close();
            res.send(bank);
        })
    });
});

router.post("/getPart-Banks", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        var number = req.body.number;
        var filter = req.body.filter;

        db.collection("banks")
        .find(filter, { score: { $meta: "textScore" } })
        .skip(number)
        .limit(10)
        .sort({ score: { $meta: "textScore" } })
        .toArray(function(err, bank){
            if(err) return console.log("Error with upload Banks Part!", err);
            db.close();
            res.send(bank);
        })
    });
});

router.post("/getNumber-Banks", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        var filter = req.body.filter;
        filter === undefined ? filter = {} : "";

        db.collection("banks").find(filter).count(function(err, bank){
            if(err) return console.log("Error with upload Number of Banks!", err);
            
            db.close();
            res.send({"numbers": bank});
        })
    });
});

router.post("/createBank", jsonParser, (req, res) => {
    const newBank = req.body.newBank;
    mongo.connect(url, (err, db) => {
        db.collection("banks").insertOne(newBank, function(err, result) {
            if(err) return console.log("Bad POST Banks request!", err);
            res.send(req.body);
        });
    });
});

router.put("/putBank", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        const id = new objectId(req.body.id);
        let newStatus = {};
        req.body.active == null ? "" : newStatus.active = req.body.active;

        db.collection("banks").findOneAndUpdate({_id: id}, {$set: newStatus},
            {returnOriginal: false },function(err, result){
           if(err) return console.log(err);     
           const bank = result.value;
           res.send(bank);
       });
    });
});


// @route POST /editBank
// @desc Edited one Bank
router.post("/editBank", jsonParser, (req, res) => {
    const bankName = req.body.bankName;
    const newData = req.body.newData;
    Bank.updateOne({"name": bankName}, {$set: newData}, {returnOriginal: false}, (err, bank) => {
        if(err) return console.log("Error witch changing Bank Data!", err);  
        res.send("Bank has been changed successfully!")
    });
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
};

module.exports = router;