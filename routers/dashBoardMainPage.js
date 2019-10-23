const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    assert = require('assert');

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/dashBoardMainPage.html', isLoggedIn, function(req, res) {
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
                                                      'status': { $in: ['Received', 'Approved', 'Available']}  } );
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
                                                      'status': { $in: ['Received', 'Approved', 'Available']},
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
                                                      'status': { $in: ['Received', 'Approved', 'Available']}  } );
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
                                                      'status': { $in: ['Received', 'Approved', 'Available']},
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
                                                      'status': { $in: ['Received', 'Approved', 'Available']}  } );
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
                                                      'status': { $in: ['Received', 'Approved', 'Available']},
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
        var cursor = db.collection('invoices').find( {'status': { $in: ['Received', 'Approved', 'Available']}} );
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

router.get('/getWallet/:merchant', function(req, res, next) {
    let idWallets = [],
        wallets = [];

    mongo.connect(url, function(err, db) {

        let merch = db.collection('merchants');
        merch.findOne({'name': req.params.merchant}).then( (item) => {
            idWallets.push(item);
            return idWallets;
        }).then( (result) => {
            if (result[0].wallets.length > 1) {
                let [id1, id2] = result[0].wallets;
            
                mongo.connect(url, function(err, db) {
                    db.collection('wallets').findOne({'_id': id1}).then( (item) => {
                        //console.log(chalk.red.bold(item.name));
                        wallets.push(item);
                        return wallets;
                    }).then( (wallets) => {
                        mongo.connect(url, function(err, db) {
                            db.collection('wallets').findOne({'_id': id2}).then( (item) => {
                                //console.log(chalk.red.bold(item.name));
                                wallets.push(item);
                                //console.log(wallets);
                                res.send(wallets);
                            });
                        });
            
                    });
                });
            } else {
                let id = result[0].wallets[0];
            
                mongo.connect(url, function(err, db) {
                    db.collection('wallets').findOne({'_id': id}).then( (item) => {
                        //console.log(chalk.red.bold(item.name));
                        wallets.push(item);
                        //console.log(wallets);
                        res.send(wallets);
                    });
                });
            }
        })
            
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