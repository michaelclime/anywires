const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    objectId = require("mongodb").ObjectID,
    jsonParser = express.json(),
    Bank = require("../modules/bank");
 

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/banks.html', isLoggedIn, visibilityApproval, function(req, res) {
    res.render("banks.html");
});

router.get('/create-bank', isLoggedIn, function(req, res) {
    res.render("create-bank.html");
});

router.get("/getBanks", (req, res) => {
    mongo.connect(url, (err, db) =>{
        db.collection("banks").find({}).sort({"name": 1}).toArray(function(err, bank){
            if(err) return console.log("Error with upload Banks!", err);
            res.send(bank);
        })
    });
});


router.post("/get-all-banks", jsonParser, async (req, res) => {
    const filter = req.body.filter;
    const banks = await Bank.find(filter).sort({"name": 1});
    res.send({
        banks
    })
});


router.post("/get-banks-partly", jsonParser, async (req, res) => {
    const filter = req.body.filter
    const skip = req.body.skip;
    const limit = req.body.limit;

    // If there is solution filter we need to find filed wit Object ID
    filter.solution_name ? filter.solution_name = new objectId(filter.solution_name) : null;
    // 
    const count = await Bank.countDocuments(filter);
    const banks = await Bank.aggregate([
        { $match : filter },
        {
            $lookup: {
                from: "users",
                localField: "solution_name",    // field in the settlements collection
                foreignField: "_id",  // field in the wallets collection
                as: "solutionData"
            }
        }
    ]).sort({'name': 1}).skip(skip).limit(limit)


    res.send({
        banks,
        count
    })
})


router.post("/createBank", jsonParser, (req, res) => {
    const newBank = req.body.newBank;
    newBank["creation_date"] = new Date();
    newBank.solution_name = new objectId(newBank.solution_name);
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

function visibilityApproval(req, res, next) {
    if ( req.user.role === 'Affiliate' ||  req.user.role === 'Crm InvoiceManager' ||  
        req.user.role === 'Crm SuccessManager' ||  req.user.role === 'Merchant Manager' ||  req.user.role === 'Invoice Manager' ) {

        req.flash('error', 'Sorry, You don\'t have permission to see this page');
        res.redirect('/');
    } else {
        return next()
    }
}

module.exports = router;