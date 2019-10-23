const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    jsonParser = express.json();
 

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/banks.html', isLoggedIn, function(req, res) {
    res.render("banks.html");
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

router.post("/postBank",jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        db.collection("banks").insertOne(req.body, function(err, result) {
            if(err) return console.log("Bad POST Banks request!", err);
            db.close();
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

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
};

module.exports = router;