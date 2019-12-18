const express = require('express'),
    mongo = require('mongodb'),
    objectId = require("mongodb").ObjectID, 
    router = new express.Router(),
    jsonParser = express.json(),
    multer = require("multer"),
    upload = multer({dest:"uploads"}),
    fs = require("fs"),
    Invoice = require('../modules/invoice'),
    User = require('../modules/user'),
    Merchant = require('../modules/merchant'),
    Wallet = require('../modules/wallet'),
    Settlement = require('../modules/settlement'),
    Document = require('../modules/document'),
    Commission = require('../modules/commission'),
    assert = require('assert');

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/settlements.html', isLoggedIn, visibilityApproval, function(req, res) {
    res.render("settlements.html");
});

router.get('/settlementReport.html', isLoggedIn, visibilityApproval, function(req, res) {
    res.render("settlementReport.html");
});

router.get('/settlementPreview', isLoggedIn, visibilityApproval, async function(req, res) {

    setTimeout( async () => {
        const SettlementId = Object.keys(req.query)[0];
        const settlement = await Settlement.findById(SettlementId);
        const wallet = await Wallet.findById(settlement.wallets);

        const settleDate = settlement.dates.creation_date;
        const settleNumber = settlement.number;
        const settleFor = wallet.merchant_name;
        const settleState = settlement.status;
        const settleWallet = wallet.name;
        const settleIBAN = wallet.requisites.iban;
        const settleBenName = wallet.requisites.beneficiary_name;
        const settleBenAdd = wallet.requisites.beneficiary_address;

        let table = ``;
        const loadInvoices = (list) => {
            list.slice(0, list.length).forEach((item, i) => {
                let invsList =  `
                <tr class="row">
                    <td class="column0">${settleNumber}</td> 
                    <td class="column1">${item.merchant}</td> 
                    <td class="column2">${formatStr(item.amount.amount_received)} ${item.currency}</td> 
                    <td class="column3">${formatStr(item.amount.amount_received - item.amount.amount_approved)} ${item.currency}</td> 
                    <th class="column4">${formatStr(item.amount.amount_approved)} ${item.currency}</th>
                </tr>
                `;   
                table += invsList;
            });
        }

        let totalSumReceived = 0;
        let totalSumApproved = 0;
        if (settlement.invoices.length) {
            let invoices = [];
            for (let i = 0; i < settlement.invoices.length; i += 1) {
                let invoice = await Invoice.findById(settlement.invoices[i]);
                totalSumReceived += invoice.amount.amount_received;
                totalSumApproved += invoice.amount.amount_approved;
                invoices.push(invoice);
            }

            loadInvoices(invoices);

            table += `
            <tr class="totalSumRow">
                <th class="column0"></th>
                <th class="column1"></th>
                <th class="column2">${totalSumReceived} ${settlement.currency}</th>
                <th class="column3"></th>
                <th class="column4">${totalSumApproved} ${settlement.currency}</th>
            </tr>
            `;   
        } else {
            table =  `
            <tr class="row">
                <td class="column0">${settleNumber}</td> 
                <td class="column1">${settleFor}</td> 
                <td class="column2"></td> 
                <td class="column3"></td> 
                <th class="column4">${formatStr(settlement.amount.amount_requested)} ${settlement.currency}</th>
            </tr>
            `;   
        }

        let commissionTable = ``;
        const loadCommissions = (list) => {
            list.slice(0, list.length).forEach((item, i) => {
                let commList =  `
                <tr class="row">
                    <td class="column0">${item.name}</td> 
                    <td class="column1">${formatStr(item.amount)} ${settlement.currency}</td>
                </tr>
                `;   
                commissionTable += commList;
            });
        }

        let totalSumComm = 0;
        if (settlement.commissions.length) {
            let commiss = [];
            for (let i = 0; i < settlement.commissions.length; i += 1) {
                let comms = await Commission.findById(settlement.commissions[i]);
                if (comms.type === 'Settlement Anywires Commission') {
                    totalSumComm += comms.amount;
                    commiss.push(comms);
                }
            }

            loadCommissions(commiss);

            commissionTable += `
            <tr class="totalSumRow">
                <th class="column0"></th>
                <th class="column1">${totalSumComm} ${settlement.currency}</th>
            </tr>
            `;   
        }

        let TOTAL = ``;
        if (settlement.invoices.length) {
            TOTAL = settlement.amount.amount_requested - totalSumComm + ` ${settlement.currency}`;
        } else {
            TOTAL = settlement.amount.amount_requested - totalSumComm + ` ${settlement.currency}`;
        }

        res.render("settlementPreview.html", { settleDate, settleNumber, settleFor, settleState, 
            settleWallet, settleIBAN, settleBenName, settleBenAdd, table, commissionTable, TOTAL
        });
     }, 1000);
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
                    foreignField: "_id",  // field in the merchants  collection
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

router.get("/getSettlementsList/:id", async (req, res) => {
    let user = await User.findById(req.params.id);

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
                    foreignField: "_id",  // field in the merchants  collection
                    as: "mercName"
                }
            }
        ]).toArray(function(err, settlements) {
            if (err) throw err;
            let result = []
            for (let i = 0; i < settlements.length; i += 1 ) {
                if (user.merchant.includes(settlements[i].merchant)) {
                    result.push(settlements[i]);
                }
            }
            res.send(result.reverse());
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
            name: req.body.name,
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
            const settlement1 = await Settlement.findById(req.params.id);
            let totalSumCommission = 0;
            
            for (let i = 0; i <  settlement1.commissions.length; i += 1) {
                let commission = await Commission.findById(settlement1.commissions[i]);
                
                if (commission.type !== 'Settlement Solution Commission') {
                    totalSumCommission += commission.amount;
                }
            }
            
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

                const settlementUpdate1 = await Settlement.findByIdAndUpdate(req.params.id, {
                    $set: { 
                        "status": req.body.newStatus,
                        "dates.sent_date":  req.body.sent_date,
                        "amount.amount_sent": settlement1.amount.amount_requested - totalSumCommission
                    }
                });
            } else {
                const settlementUpdate1 = await Settlement.findByIdAndUpdate(req.params.id, {
                    $set: { 
                        "status": req.body.newStatus,
                        "dates.sent_date":  req.body.sent_date,
                        "amount.amount_sent": settlement1.amount.amount_requested + totalSumCommission
                    }
                });
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

router.get("/upload/:filename", (req, res) => {
    const filename = req.params.filename;
    var filePath = `/../uploads/${filename}`;

    mongo.connect(url, (err, db) => {
        if (err) return console.log(err, "Can't connect to database!");
        db.collection("documents").find({"filename": filename}).toArray(function(err, doc){
            if(err) return console.log("Error with openning file!", err);

            checkTypeOfDocument(doc[0].mimetype, filePath, res);
        });
    });
});

router.post("/changeDocStatus", jsonParser, async (req, res) => {
   try {
    const doc = await Document.findByIdAndUpdate(req.body.id, {
        status: req.body.status
    });
    if (doc && doc !== null) {
        res.status(200).send('Ok');
    } else {
        res.status(500).send('False');
    }
   } catch (error) {
       console.log(error);
       res.status(500).send(error);
   }
    
});

router.get('/isDocProof/:id', async (req, res) => {
    let flag = false;
    let settlement = await Settlement.findById(req.params.id);

    for (let i = 0; i < settlement.documents.length; i += 1) {
        let doc = await Document.findById(settlement.documents[i]);
        if (doc) {
            if (doc.type === 'Payment proof' && doc.status === 'Approved') {
                flag = true;
            }
        }
    }
    
    res.status(200).send(flag);
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
    const count = await Settlement.count();

    const reducer = (accumulator, currentValue) => +accumulator + +currentValue;
    let totalSumInv = amounts.reduce(reducer);
    let newSettle = {
        number: count + 1,
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
    const count = await Settlement.countDocuments();

    let newSettle = {
        number: count + 1,
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

router.get("/getMerchants", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{
        db.collection("merchants").find({}).sort({"name": 1}).toArray(function(err, merchants){
            if(err) return console.log("Error with upload Merchants!", err);
            res.send(merchants);
        })
    });
});

router.get("/getMerchant/:id", jsonParser, async (req, res) => {
    let user = await User.findById(req.params.id);

    const getList = async () => {
        let merchants =[];

        for (let i = 0; i < user.merchant.length; i += 1) {
            let merchant = await Merchant.findById(  user.merchant[i] );
            merchants.push(merchant);
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

router.post("/getSettlementById", jsonParser, async (req, res) => {
    let settlement = await Settlement.findById({_id: req.body.number});
    
    if (settlement && settlement !== null) {
        res.status(200).send(settlement);
    }
});

// Checking if type is supported for open in browser
var checkTypeOfDocument = (type, filePath, res) => {
    if(type !== "application/pdf" && type !== "image/jpeg" && type !== "image/png"){
        res.send("File type is not supported!");
    } else {
        fs.readFile(__dirname + filePath , (err, data) => {
            if (err) return res.sendStatus(404);
            res.contentType(type);
            res.send(data);
        });
    }
};

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
        ||  req.user.role === "Merchant Manager") {
        return next()
    }
    req.flash('error', 'Sorry, you don\'t have permission to see this page.');
    res.redirect('/');
}

// Correct amount function

function formatStr(num) {
    let str = num + '';
    str = str.replace(/(\.(.*))/g, '');
    var arr = str.split('');
    var str_temp = '';
    if (str.length > 3) {
        for (var i = arr.length - 1, j = 1; i >= 0; i--, j++) {
            str_temp = arr[i] + str_temp;
            if (j % 3 == 0) {
                str_temp = ' ' + str_temp;
            }
        }
        return str_temp;
    } else {
        return str;
    }
}
    
module.exports = router;
