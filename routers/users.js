const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    jsonParser = express.json();
    User = require("../modules/user");
 
const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/users.html', isLoggedIn, function(req, res) {
    res.render("users.html");
});

router.post("/getPart-Users", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        var number = req.body.number;
        var filter = req.body.filter;

        // Cheking one or two days Last Login
        var startLog = req.body.startLog;
        var endLog = req.body.endLog;
        if (startLog) {
            var login = datesObj("last_login_date", startLog, endLog);
            Object.assign(filter, login);
        } 
        // // Cheking one or two days Last Login

        db.collection("users")
        .find(filter, { score: { $meta: "textScore" } })
        .skip(number)
        .limit(10)
        .sort({ score: { $meta: "textScore" } })
        .toArray(function(err, user){
            if(err) return console.log("Error with upload Users Part!", err);
            db.close();
            res.send(user);
        })
    });
});

router.post("/getNumber-Users", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        var filter = req.body.filter;
        filter === undefined ? filter = {} : "";

        // Cheking one or two days Creation START.
        var startLog = req.body.startLog;
        var endLog = req.body.endLog;
        if (startLog) {
            var login = datesObj("last_login_date", startLog, endLog);
            Object.assign(filter, login);
        } 
        // // Cheking one or two days Creation END.

        db.collection("users").find(filter).count(function(err, user){
            if(err) return console.log("Error with upload Number of Users!", err);
            
            db.close();
            res.send({"numbers": user});
        })
    });
});

// @route POST /getUserByFilter
// @desc Create Merchant
router.post("/getUserByFilter", jsonParser, (req, res) => {
    const filter = req.body.filter;
    User.find(filter, (err, users) => {
        if(err) return console.log("Error with get user by filter!", err);
        res.send(users);
    });
    // mongo.connect(url, (err, db) =>{
    //     db.collection("merchants").find({}).sort({"name": 1}).toArray(function(err, merchants){
    //         if(err) return console.log("Error with upload Merchants!", err);
    //         res.send(merchants);
    //     })
    // });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
}

module.exports = router;