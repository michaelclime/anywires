const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    jsonParser = express.json(),
    User = require('../modules/user'),
    Merchant = require('../modules/merchant'),
    Wallet = require('../modules/wallet'),
    assert = require('assert');

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/dashBoardMainPage.html', visibilityApproval, isLoggedIn, function(req, res) {
    res.render("dashBoardMainPage.html");
});

router.get('/getInvListToday', function(req, res, next) {
    let INVOIECES = [],
        nowDate = new Date();
        minDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate());
        maxDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate() + 1);
       
        mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('invoices').find({ 'dates.creation_date': { $gt: new Date(minDate), $lt: new Date(maxDate) },
                                                      'status': { $in: ['Received', 'Approved', 'Available', 'Settled']}  } );
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            INVOIECES.push(doc);
        }, function() {
            db.close();
            res.send(INVOIECES);
        });
    });
});

router.get('/getInvListToday/:merchant', function(req, res, next) {
    let INVOIECES = [],
        nowDate = new Date();
        minDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate());
        maxDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate() + 1);
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('invoices').find({ 'dates.creation_date': { $gt: new Date(minDate), $lt: new Date(maxDate) },
                                                      'status': { $in: ['Received', 'Approved', 'Available', 'Settled']},
                                                      'merchant': req.params.merchant  } );
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            INVOIECES.push(doc);
        }, function() {
            db.close();
            res.send(INVOIECES);
        });
    });
});

router.get('/getInvListWeek', function(req, res, next) {
    let INVOIECES = [],
        nowDate = new Date();
        minDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate() - 7);
        maxDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate() + 1);
        
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('invoices').find({ 'dates.creation_date': { $gt: new Date(minDate), $lt: new Date(maxDate) },
                                                      'status': { $in: ['Received', 'Approved', 'Available', 'Settled']}  } );
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            INVOIECES.push(doc);
        }, function() {
            db.close();
            res.send(INVOIECES);
        });
    });
});

router.get('/getInvListWeek/:merchant', function(req, res, next) {
    let INVOIECES = [],
        nowDate = new Date();
        minDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate() - 7);
        maxDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate() + 1);
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('invoices').find({ 'dates.creation_date': { $gt: new Date(minDate), $lt: new Date(maxDate) },
                                                      'status': { $in: ['Received', 'Approved', 'Available', 'Settled']},
                                                      'merchant': req.params.merchant  } );
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            INVOIECES.push(doc);
        }, function() {
            db.close();
            res.send(INVOIECES);
        });
    });
});


router.get('/getInvListMonth', function(req, res, next) {
    let INVOIECES = [],
        nowDate = new Date();
        minDate = nowDate.getFullYear() + '-' + (nowDate.getMonth()) + '-' + (nowDate.getDate());
        maxDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate() + 1);

        mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('invoices').find({ 'dates.creation_date': { $gt: new Date(minDate), $lt: new Date(maxDate) },
                                                      'status': { $in: ['Received', 'Approved', 'Available', 'Settled']}  } );
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            INVOIECES.push(doc);
        }, function() {
            db.close();
            res.send(INVOIECES);
        });
    });
});

router.get('/getInvListMonth/:merchant', function(req, res, next) {
    let INVOIECES = [],
        nowDate = new Date();
        minDate = nowDate.getFullYear() + '-' + (nowDate.getMonth()) + '-' + (nowDate.getDate());
        maxDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate() + 1);
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('invoices').find({ 'dates.creation_date': { $gt: new Date(minDate), $lt: new Date(maxDate) },
                                                      'status': { $in: ['Received', 'Approved', 'Available', 'Settled']},
                                                      'merchant': req.params.merchant  } );
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            INVOIECES.push(doc);
        }, function() {
            db.close();
            res.send(INVOIECES);
        });
    });
});

router.get('/getInvListAll', function(req, res, next) {
    let INVOIECES = [];
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('invoices').find( {'status': { $in: ['Received', 'Approved', 'Available', 'Settled']}} );
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            INVOIECES.push(doc);
        }, function() {
            db.close();
            res.send(INVOIECES);
        });
    });
});

router.get('/getInvListAll/:merchant', function(req, res, next) {
    let INVOIECES = [];
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('invoices').find({'merchant': req.params.merchant});
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            INVOIECES.push(doc);
        }, function() {
            db.close();
            res.send(INVOIECES);
        });
    });
});

router.get('/getWallet/:merchant', async function(req, res, next) {
    let wallets = [];
    
    let merchant = await Merchant.findOne({'name': req.params.merchant});

    for (let i = 0; i < merchant.wallets.length; i += 1) {
        let wallet = await Wallet.findById(merchant.wallets[i]);
        if (wallet) {
            wallets.push(wallet);
        }
    }

    res.status(200).send(wallets);
});

router.get("/getMerchListNames/:id", jsonParser, async (req, res) => {
    let user = await User.findById(req.params.id);

    const getList = async () => {
        let merchants =[];

        for (let i = 0; i < user.merchant.length; i += 1) {
            let merchant = await Merchant.findById(  user.merchant[i] );
            merchants.push(merchant.name);
        }

        return merchants;
    };

    getList().then( (result) => {
        res.status(200).send(result);
    }).catch((err) =>{
        res.status(400).send(err);
        console.log(err);
    })
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
}

function visibilityApproval(req, res, next) {
    if( req.user.role === 'Crm Admin' ||  req.user.role === 'Crm FinanceManager' 
        ||  req.user.role === 'Crm InvoiceManager' ||  req.user.role === 'Crm SuccessManager'
        ||  req.user.role === "Merchant Manager" || req.user.role === "Invoice Manager") {
        return next()
    }
    req.flash('error', 'Sorry, you don\'t have permission to see this page.');
    res.redirect('/');
}
   
module.exports = router;