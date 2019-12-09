const express = require('express'),
    mongo = require('mongodb'),
    objectId = require("mongodb").ObjectID, 
    router = new express.Router(),
    jsonParser = express.json(),
    multer = require("multer"),
    upload = multer({dest:"uploads"}),
    Invoice = require('../modules/invoice'),
    Merchant = require('../modules/merchant'),
    Wallet = require('../modules/wallet'),
    Settlement = require('../modules/settlement'),
    Document = require('../modules/document'),
    assert = require('assert');

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/settlements.html', isLoggedIn, function(req, res) {
    res.render("settlements.html");
});

router.get('/settlementReport.html', isLoggedIn, function(req, res) {
    res.render("settlementReport.html");
});

router.get('/settlementPreview.html', isLoggedIn, function(req, res) {
    res.render("settlementPreview.html");
});

router.get('/availableInvs/:merchant', async function(req, res, next) {
    let INVOIECES = [];
     mongo.connect(url, function(err, db) {
        db.collection('merchants').findOne(objectId(req.params.merchant)).then(
            (result) => {
                mongo.connect(url, function(err, db) {
                    assert.equal(null, err);
                    var cursor = db.collection('invoices').find({ 'status': 'Available',
                                                                'merchant': result.name,
                                                                settleSelectedStatus: false } );
                    cursor.forEach(function(doc, err) {
                        assert.equal(null, err);
                        INVOIECES.push(doc);
                    }, function() {
                        db.close();
                        res.send(INVOIECES);
                    });
                });
            });
    });
});

router.get("/getWalletsList/:id", async (req, res) => {

    const merchant = await Merchant.findById(req.params.id);
    
    const getList = async () => {
        let walletList =[];

        // merchant.wallets.forEach(async (i) => {
        //     let wallet = await Wallet.findById(i);
        //     walletList.push(wallet);
        // });

        for (let i = 0; i < merchant.wallets.length; i += 1) {
            let wallet = await Wallet.findById( merchant.wallets[i] );
            walletList.push(wallet);
        }

        for (let i = 0; i < merchant.inside_wallets.length; i += 1) {
            let wallet = await Wallet.findById( merchant.inside_wallets[i] );
            walletList.push(wallet);
        }

        return walletList;
    };

    getList().then( (result) => {
        res.status(200).send(result);
    }).catch((err) =>{
        res.status(400).send(err);
        console.log(err);
    })
});

router.get("/getExternalWalletsList/:id", async (req, res) => {

    const merchant = await Merchant.findById(req.params.id);
    
    const getList = async () => {
        let walletList =[];

        for (let i = 0; i < merchant.wallets.length; i += 1) {
            let wallet = await Wallet.findById( merchant.wallets[i] );
            walletList.push(wallet);
        }

        return walletList;
    };

    getList().then( (result) => {
        res.status(200).send(result);
    }).catch((err) =>{
        res.status(400).send(err);
        console.log(err);
    })
});

router.get("/getInside_walletsList/:id", async (req, res) => {

    const merchant = await Merchant.findById(req.params.id);
   
    const getList = async () => {
        let walletList =[];

        for (let i = 0; i < merchant.inside_wallets.length; i += 1) {
            let wallet = await Wallet.findById( merchant.inside_wallets[i] );
            walletList.push(wallet);
        }
        return walletList;
    };

    getList().then( (result) => {
        res.status(200).send(result);
    }).catch((err) =>{
        res.status(400).send(err);
        console.log(err);
    })
});

router.get("/getSettlementsList", (req, res) => {
    mongo.connect(url, function(err, db) {
        db.collection('settlements').aggregate([
            {
            $lookup: {
                from: "wallets",
                localField: "wallets",    // field in the settlements collection
                foreignField: "_id",  // field in the wallets collection
                as: "wallet"
            }
            }, {
                $lookup: {
                    from: "documents",
                    localField: 'documents',    // field in the settlements collection
                    foreignField: "_id",  // field in the documents collection
                    as: "documentList"
                }
            }, {
                $lookup: {
                    from: "commissions",
                    localField: 'commissions',    // field in the settlements collection
                    foreignField: "_id",  // field in the commissions  collection
                    as: "commissionsList"
                }
            }, {
                $lookup: {
                    from: "merchants",
                    localField: 'merchant',    // field in the settlements collection
                    foreignField: "_id",  // field in the commissions  collection
                    as: "mercName"
                }
            }
        ]).toArray(function(err, settlements) {
            if (err) throw err;
            res.send(settlements.reverse());
            db.close();
        });
    });
});

router.post('/addSettleComment/:id', jsonParser,  function(req, res) {
    let newComment = {
        created_by: req.body.created_by,
        creation_date: req.body.creation_date,
        message: req.body.message
    };
    mongo.connect(url, (err, db) => {
        db.collection("settlements").findOneAndUpdate( {
             _id: new objectId(req.params.id)
        }, {
            $push: {comments: newComment}
        });
    });
});

router.post('/addSettleCommision/:id', jsonParser,  function(req, res) {
    let newID =  objectId();

    mongo.connect(url, (err, db) => {
        db.collection("commissions").insertOne( {
            _id: newID,
            created_by: req.body.created_by, 
            amount: req.body.amount,
            type: req.body.type,
            percentage: req.body.percentage,
            flat: req.body.flat,
            additional: req.body.additional,
            bank_commision: req.body.bank_commision,
            left_from_transfer: req.body.left_from_transfer,
            merchant: req.body.merchant,
            creation_date: new Date()
        });
    });

    mongo.connect(url, (err, db) => {
        db.collection("settlements").findOneAndUpdate( {
             _id: new objectId(req.params.id)
        }, {
            $push: {commissions: newID}
        });
    });
});

router.post('/changeSettleStatus/:id', jsonParser, async function(req, res) {
    
    switch (req.body.newStatus) {
        case 'Sent':
            const settlementUpdate1 = await Settlement.findByIdAndUpdate(req.params.id, {
                $set: { 
                    "status": req.body.newStatus,
                    "dates.sent_date":  req.body.sent_date
                }
            });
            const settlement1 = await Settlement.findById(req.params.id);
            if (settlement1.invoices.length) {
                for (let i = 0; i < settlement1.invoices.length; i += 1) {
                    let invoice1 = await Invoice.findById(settlement1.invoices[i]);
                    let invoiceUpdate1 = await Invoice.findByIdAndUpdate(settlement1.invoices[i], {
                        $set: { 
                            "status": 'Settled',
                            "dates.settled_date":  new Date(),
                            "amount.amount_settled": invoice1.amount.amount_available
                        }
                    } );
                }
            }
            break;

        case 'Received':
            const settlement2 = await Settlement.findByIdAndUpdate(req.params.id, {
                $set: { 
                    "status": req.body.newStatus,
                    "dates.received_date":  req.body.received_date
                }
            })
            break;

        case 'Declined':
            const settlementUpdate2 = await Settlement.findByIdAndUpdate(req.params.id, {
                $set: { 
                    "status": req.body.newStatus,
                    "dates.declined_date":  req.body.declined_date
                }
            });
            
            const settlement3 = await Settlement.findById(req.params.id);
            if (settlement3.invoices.length) {
                for (let i = 0; i < settlement3.invoices.length; i += 1) {
                    let invoiceUpdate3 = await Invoice.findByIdAndUpdate(settlement3.invoices[i], {
                        $set: { 
                            "status": 'Available',
                            "dates.settled_date":  '',
                            "amount.amount_settled": 0
                        }
                    } );
                }
            }
            break;
        default:
            break;
    }
    


    // mongo.connect(url, (err, db) => {
    //     if (req.body.sent_date) {
    //         db.collection("settlements").findOneAndUpdate( {
    //             _id: new objectId(req.params.id)
    //         }, { $set: { 
    //                 "status": req.body.newStatus,
    //                 "dates.sent_date":  req.body.sent_date
    //             }         
    //         });
    //     } else  if (req.body.received_date) {
    //         db.collection("settlements").findOneAndUpdate( {
    //             _id: new objectId(req.params.id)
    //         }, { $set: { 
    //                 "status": req.body.newStatus,
    //                 "dates.received_date":  req.body.received_date
    //             }         
    //         });
    //     } else {
    //         db.collection("settlements").findOneAndUpdate( {
    //             _id: new objectId(req.params.id)
    //         }, { $set: { 
    //                 "status": req.body.newStatus,
    //                 "dates.declined_date":  req.body.declined_date
    //             }         
    //         });
    //     }
    // });
});

router.post("/uploadSettleDoc", upload.single("file"), jsonParser, (req, res) => {
   
    let file = req.file;
    if(!file) return res.send("Error to download file");

    const newID = new objectId();

    const newDoc = {
        "_id": newID,
        "type": req.body.type,
        "status": "Non-Verified",
        "filename": req.file.filename,
        "creation_date": new Date(),
        "creator": req.body.creator,
        "originalname": req.file.originalname,
        "encoding": req.file.encoding,
        "mimetype": req.file.mimetype,
        "size": req.file.size
    };
    
     mongo.connect(url, (err, db) => {
        db.collection("documents").insertOne(newDoc, (err) => {
            if (err) return console.log(err, "Error with inseerting Document!");

            mongo.connect(url, (err, db) =>{
                if(err) return console.log(err);  
        
                db.collection("settlements").findOneAndUpdate(
                    {"_id": new objectId(req.body.numberID)},
                    {$push: 
                        { documents: newID}
                    },
                    {returnOriginal: false }, function(err, result){
        
                    if(err) return console.log(err);  
                    res.status(200).send("Document successfully has been uploaded!");
               });
            });
        })
    });
});

router.post('/creatSettle/:id', async (req, res) => {

    let amounts = [];
    let invoices = [];
    let currency, merchantID;
    if (Array.isArray(req.body.invoices)) {
        req.body.invoices.forEach((i) => {
            let infoArr = i.split('/');
            amounts.push(infoArr[0]);
            invoices.push( objectId(infoArr[2]) );
            currency = infoArr[1];
            merchantID = infoArr[3];
        });
    } else {
        let infoArr = req.body.invoices.split('/');
            amounts.push(infoArr[0]);
            invoices.push( objectId(infoArr[2]) );
            currency = infoArr[1];
            merchantID = infoArr[3];
    }
    
    let wallet = await Wallet.findById(req.body.wallets);


    const reducer = (accumulator, currentValue) => +accumulator + +currentValue;
    let totalSumInv = amounts.reduce(reducer);
    let newSettle = {
        dates: {
            creation_date: new Date()
        },
        amount: {
            amount_requested: totalSumInv,
            amount_sent: 0
        },
        currency:  currency,
        merchant: objectId(merchantID),
        status: 'Requested',
        invoices: invoices,
        type: wallet.type,
        created_by: objectId(req.params.id),
        wallets: [
            objectId(req.body.wallets)
        ]
    }

    const settlement = new Settlement(newSettle);

    for (let i = 0; i < invoices.length; i += 1) {
        let newStatusInv = await Invoice.findByIdAndUpdate(invoices[i], {
            settleSelectedStatus: true
        });
    }

    if (currency === 'USD') {
        let merchantUpdate = await Merchant.findByIdAndUpdate(merchantID, {
            "$inc": { "balance_USD.balance_available": - totalSumInv }
        });
    } else if (currency === 'EUR') {
        let merchantUpdate = await Merchant.findByIdAndUpdate(merchantID, {
            "$inc": { "balance_EUR.balance_available": - totalSumInv }
        });
    }

    if ( wallet.type === 'Anywires' ) {
        let walletBalUpd = await Wallet.findByIdAndUpdate(req.body.wallets, {
            "$inc": { "balance": totalSumInv }
        });
    }

    try {
        await settlement.save();
        req.flash('success', 'Settlement successfully created!');
        res.status(201).redirect("/settlements.html");
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }

   
});

router.post('/creatSettleFromAwWallet/:id', async (req, res) => {

    let walletAW = await Wallet.findByIdAndUpdate(req.body.AwWalletId, {
        "$inc": { "balance": - req.body.amountPaymentfromAW } 
    });
    
    let newSettle = {
        dates: {
            creation_date: new Date()
        },
        amount: {
            amount_requested: req.body.amountPaymentfromAW,
            amount_sent: 0
        },
        currency:  req.body.currency,
        merchant: objectId(req.body.merchantID),
        status: 'Requested',
        invoices: [],
        type: req.body.type,
        created_by: objectId(req.params.id),
        wallets: [
            objectId(req.body.wallet)
        ]
    };

    const settlement = new Settlement(newSettle);

    try {
        await settlement.save();
        req.flash('success', 'Settlement successfully created!');
        res.status(201).redirect("/settlements.html");
    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }  
});

router.get('/isDocProof/:id', async (req, res) => {
    let flag = false;
    let settlement = await Settlement.findById(req.params.id);

    for (let i = 0; i < settlement.documents.length; i += 1) {
        let doc = await Document.findById(settlement.documents[i]);
        if (doc) {
            if (doc.type === 'Payment proof') {
                flag = true;
            }
        }
    }
    
    res.status(200).send(flag);
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
}
    
module.exports = router;
