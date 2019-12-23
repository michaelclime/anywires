const express = require('express'),
    router = new express.Router(),
    jsonParser = express.json();
    objectId = require("mongodb").ObjectID,
    User = require("../modules/user");

    
router.get('/users.html', isLoggedIn, function(req, res) {
    res.render("users.html");
});


// @route POST /getUserByFilter
// @desc Create Merchant
router.post("/getUserByFilter", jsonParser, (req, res) => {
    const filter = req.body.filter;
    User.find(filter, (err, users) => {
        if(err) return console.log("Error with get user by filter!", err);
        res.send(users);
    });
});


// @route POST /get-user-partly
// @desc Get users Partly
router.post('/get-user-partly', jsonParser, async (req, res) => {
    const filter = req.body.filter;
    const skip = req.body.skip;
    const limit = req.body.limit;

    // Cheking one or two days Creation START.
    const firstCrea = req.body.firstCrea;
    const secondCrea = req.body.secondCrea;
    if (firstCrea) {
        const creation = datesObj("dateCreation", firstCrea, secondCrea);
        Object.assign(filter, creation);
    } 
    //

    // If there is merchant filter we need to find filed wit Object ID
    filter.merchant ? filter.merchant = new objectId(filter.merchant) : null;
    // 

    const count = await User.countDocuments(filter);
    const users = await User.aggregate([
        { $match : filter },
        { 
            $lookup: { 
                from: 'merchants',
                localField: 'merchant',
                foreignField: '_id',
                as: 'merchantsList'
            }
        }
    ]).sort({"fullname": 1}).skip(skip).limit(limit);
    res.send({
        users,
        count
    });
});


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
}

module.exports = router;