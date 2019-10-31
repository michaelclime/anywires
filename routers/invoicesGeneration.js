const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    Invoice = require('../modules/invoice'),
    User = require('../modules/user'),
    Bank = require('../modules/bank'),
    assert = require('assert'),
    objectId = require("mongodb").ObjectID;

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/InvoiceGeneration.html', isLoggedIn, function(req, res) {
    res.render("InvoiceGeneration.html");
});

router.post("/invoices/:fullname/:_id/:merchant", function(req, res, next) {
    var currency = "";
    req.body.currency === "USD" ? currency = "$" : currency = "€";

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        let coll = db.collection('invoices');
        coll.count().then((count) => {
            if (req.body.bank) {
                var newInvoice = {
                    number: count + 1,
                    client_details: {
                        full_name: req.body.name,
                        email:  req.body.email,
                        phone:  req.body.phone,
                        country:  req.body.country,
                        address:  req.body.address,
                        id_number: ''
                    },
                    type: 'c2b',
                    status: 'Requested',
                    amount: {
                        amount_requested: +req.body.amount,
                        amount_received: 0,
                        amount_sent: 0,
                        amount_approved: 0,
                        amount_available: 0
                    },
                    currency:  req.body.currency,
                    sepa:  (req.body.sepa + '').length < 4,
                    merchant:  req.body.merch,
                    bank:  req.body.bank,
                    dates: {
                        creation_date: new Date(),
                        sent_date: '',
                        received_date: '',
                        approved_date: '',
                        available_date: '',
                        declined_date: ''
                    }, 
                    documents: {
                        id: [],
                        payment_proof: [],
                        utility_bill: [],
                        declaration: []
                    },
                    created_by: {
                        id: objectId(req.params._id),
                        name: req.params.fullname
                    },
                    commissions: [],
                    comments: [
                        {
                            created_by:  req.params.fullname,
                            creation_date: new Date(),
                            message: `Invoice #${count + 1}. Transfer for ${currency}${req.body.amount} was Requested!`
                        }
                    ],
                    settleSelectedStatus: false
                };

                Invoice.create(newInvoice, async function(err, newlyCreated){
                    if(err){
                        console.log(err);
                    } else {
                        console.log('Item inserted');
                        if (req.body.currency == 'EUR') {
                            await Bank.findOneAndUpdate({name: req.body.bank}, { $inc: { "balance_EUR.balance_requested": +req.body.amount }});
                        } else if (req.body.currency == 'USD') {
                            await Bank.findOneAndUpdate({name: req.body.bank},  {$inc: { "balance_USD.balance_requested": +req.body.amount}});
                        }
                        let userInfo = await User.findOne({ _id: req.params._id});
                        
                        if ( userInfo.role == 'Invoice Manager') {
                                res.redirect('/personal-area.html');
                        } else {
                            res.redirect('/invoice-list.html');
                        }
                    }
                });
                } else {
                
                mongo.connect(url, function(err, db) {
                    let availableBanks = [];
                    assert.equal(null, err);
                    let bankList = db.collection('banks').find();
                    bankList.forEach(function(item, err) {
                        assert.equal(null, err);
                        let a = ((req.body.sepa + '').length < 4);
                        
                        if ( (item.sepa == a) && (item.country !== req.body.country) && (+req.body.amount <= +item.max_wire) &&
                        (+req.body.amount >= +item.min_wire) ) {
                            availableBanks.push(item.name);
                        }
                    }, function() {
                        
                        let availableBank = '';
                        mongo.connect(url, function(err, db) {
                            assert.equal(null, err);

                            if (req.body.merch) {
                                //console.log( chalk.red.inverse.bold(availableBanks) );
                                let merchantClient = db.collection('merchants');
                                merchantClient.findOne({name: req.body.merch}).then(
                                    (item) => {
                                        for (let i = 0; i < item.available_banks.length; i += 1) {
                                            if ( availableBanks.indexOf( item.available_banks[i] ) != -1) {
                                                //console.log( chalk.blue.inverse.bold(item.available_banks[i]) );
                                                availableBank = item.available_banks[i];
                                                break;
                                            }
                                        }

                                        if (!availableBank) {
                                            req.flash('error', 'Sorry, something went wrong. Please, change your invoice options or contact our support team.');
                                            res.redirect('/InvoiceGeneration.html');
                                        } else {
                                            var newInvoice = {
                                                number: count + 1,
                                                client_details: {
                                                    full_name: req.body.name,
                                                    email:  req.body.email,
                                                    phone:  req.body.phone,
                                                    country:  req.body.country,
                                                    address:  req.body.address,
                                                    id_number: ''
                                                },
                                                type: 'c2b',
                                                status: 'Requested',
                                                amount: {
                                                    amount_requested: +req.body.amount,
                                                    amount_received: 0,
                                                    amount_sent: 0,
                                                    amount_approved: 0,
                                                    amount_available: 0
                                                },
                                                currency:  req.body.currency,
                                                sepa:  (req.body.sepa + '').length < 4,
                                                merchant:  req.body.merch,
                                                bank:  availableBank,
                                                dates: {
                                                    creation_date: new Date(),
                                                    sent_date: '',
                                                    received_date: '',
                                                    approved_date: '',
                                                    available_date: '',
                                                    declined_date: ''
                                                }, 
                                                documents: {
                                                    id: [],
                                                    payment_proof: [],
                                                    utility_bill: [],
                                                    declaration: []
                                                },
                                                created_by: {
                                                    id: objectId(req.params._id),
                                                    name: req.params.fullname
                                                },
                                                commissions: [],
                                                comments: [
                                                    {
                                                        created_by:  req.params.fullname,
                                                        creation_date: new Date(),
                                                        message: `Invoice #${count + 1}. Transfer for ${currency}${req.body.amount} was Requested!`
                                                    }
                                                ],
                                                settleSelectedStatus: false
                                            };
                            
                                            Invoice.create(newInvoice, async function(err, newlyCreated){
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    console.log('Item inserted');
                                                    req.flash('success', 'Invoice successfully created!');
                                                    if (req.body.currency == 'EUR') {
                                                        await Bank.findOneAndUpdate({name: availableBank}, { $inc: { "balance_EUR.balance_requested": +req.body.amount }});
                                                    } else if (req.body.currency == 'USD') {
                                                        await Bank.findOneAndUpdate({name: availableBank},  {$inc: { "balance_USD.balance_requested": +req.body.amount}});
                                                    }
                                                    let userInfo = await User.findOne({ _id: req.params._id});
                                                   
                                                    if ( userInfo.role == 'Invoice Manager') {
                                                            res.redirect('/personal-area.html');
                                                    } else {
                                                        res.redirect('/invoice-list.html');
                                                    }
                                                }
                                            });
                                        }
                                    });
                                
                                } else {
                                let merchantClient = db.collection('merchants');
                                merchantClient.findOne({name: req.params.merchant}).then(
                                    (item) => {
                                        for (let i = 0; i < item.available_banks.length; i += 1) {
                                            if ( availableBanks.indexOf( item.available_banks[i] ) != -1) {
                                                //console.log( chalk.blue.inverse.bold(item.available_banks[i]) );
                                                availableBank = item.available_banks[i];
                                                break;
                                            }
                                        }

                                        if (!availableBank) {
                                            req.flash('error', 'Sorry, something went wrong. Please, change your invoice options or contact our support team.');
                                            res.redirect('/InvoiceGeneration.html');
                                        } else {
                                            var newInvoice = {
                                                number: count + 1,
                                                client_details: {
                                                    full_name: req.body.name,
                                                    email:  req.body.email,
                                                    phone:  req.body.phone,
                                                    country:  req.body.country,
                                                    address:  req.body.address,
                                                    id_number: ''
                                                },
                                                type: 'c2b',
                                                status: 'Requested',
                                                amount: {
                                                    amount_requested: +req.body.amount,
                                                    amount_received: 0,
                                                    amount_sent: 0,
                                                    amount_approved: 0,
                                                    amount_available: 0
                                                },
                                                currency:  req.body.currency,
                                                sepa:  (req.body.sepa + '').length < 4,
                                                merchant:  req.params.merchant,
                                                bank:  availableBank,
                                                dates: {
                                                    creation_date: new Date(),
                                                    sent_date: '',
                                                    received_date: '',
                                                    approved_date: '',
                                                    available_date: '',
                                                    declined_date: ''
                                                }, 
                                                documents: {
                                                    id: [],
                                                    payment_proof: [],
                                                    utility_bill: [],
                                                    declaration: []
                                                },
                                                created_by: {
                                                    id: objectId(req.params._id),
                                                    name: req.params.fullname
                                                },
                                                commissions: [],
                                                comments: [
                                                    {
                                                        created_by:  req.params.fullname,
                                                        creation_date: new Date(),
                                                        message: `Invoice #${count + 1}. Transfer for ${currency}${req.body.amount} was Requested!`
                                                    }
                                                ],
                                                settleSelectedStatus: false
                                            };
                            
                                            Invoice.create(newInvoice, async function(err, newlyCreated){
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    console.log('Item inserted');
                                                    req.flash('success', 'Invoice successfully created!');
                                                    if (req.body.currency == 'EUR') {
                                                        await Bank.findOneAndUpdate({name: availableBank}, { $inc: { "balance_EUR.balance_requested": +req.body.amount }});
                                                    } else if (req.body.currency == 'USD') {
                                                        await Bank.findOneAndUpdate({name: availableBank},  {$inc: { "balance_USD.balance_requested": +req.body.amount}});
                                                    }
                                                    let userInfo = await User.findOne({ _id: req.params._id});
                                                    if ( userInfo.role == 'Invoice Manager') {
                                                            res.redirect('/personal-area.html');
                                                    } else {
                                                        res.redirect('/invoice-list.html');
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                        });
                    });
                });
            };
        });
    });
});

router.get('/getInvNumber', isLoggedIn, async function(req, res) {
    let number = await Invoice.countDocuments();
    res.send(JSON.stringify(number));
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
}
    
module.exports = router;
