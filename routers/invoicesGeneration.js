const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    Invoice = require('../modules/invoice'),
    User = require('../modules/user'),
    Bank = require('../modules/bank'),
    assert = require('assert'),
    objectId = require("mongodb").ObjectID,
    request = require('request'),
    chalk = require('chalk');

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/InvoiceGeneration.html', isLoggedIn, function(req, res) {
    res.render("InvoiceGeneration.html");
});

router.post("/invoices/:fullname/:_id/:merchant", function(req, res, next) {
    
    var currency = "";
    req.body.currency === "USD" ? currency = "$" : currency = "€";

    mongo.connect(url, function(err, db) {

        let coll = db.collection('invoices');

        coll.count().then( async (count) => {
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
                        amount_sent: 0,
                        amount_received: 0,
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

                let bank = await Bank.findOne({name: req.body.bank});
                let invoicesByBank = await Invoice.find({bank: req.body.bank});
                const url = 'https://api.exchangeratesapi.io/latest';

                let DollarToEuro = await request.get({url, json: true}, async (error,  {body}) => {
                      let coefficient = body.rates.USD;
                      let invoicesLimitSum = +req.body.amount * 0.25;
                      if (req.body.currency == 'USD') {invoicesLimitSum /= coefficient}
                      for (let i = 0; i < invoicesByBank.length; i += 1) {
                          if (invoicesByBank[i].currency == 'USD') {
                            invoicesLimitSum +=  (invoicesByBank[i].amount.amount_requested / coefficient * 0.25 ) + 
                                (invoicesByBank[i].amount.amount_sent / coefficient * 0.8) + ( invoicesByBank[i].amount.amount_received  / coefficient);
                          } else {
                            invoicesLimitSum +=  (invoicesByBank[i].amount.amount_requested * 0.25) + 
                                (invoicesByBank[i].amount.amount_sent * 0.8) + ( invoicesByBank[i].amount.amount_received);
                          }
                        }
                        
                    if (invoicesLimitSum >= bank.stop_limit) {
                        let a = invoicesLimitSum - (+req.body.amount * 0.25);
                        if ((bank.stop_limit - a) <= 1000) {
                            await Bank.findOneAndUpdate({name: req.body.bank}, {active: false, stop_limit_reached: true});
                            req.flash('error', 'Sorry, this bank isn\'t available now!');
                            res.redirect('/InvoiceGeneration.html');
                        } else {
                            req.flash('error', 'Sorry, limit bank has reached. Decrease invoice amount or chose another bank!');
                            res.redirect('/InvoiceGeneration.html');
                        }
                    } else {
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
                    }
                });
                } else {
                
                mongo.connect(url, async function(err, db) {

                    let availableBanks = [];
                    let bankList = db.collection('banks').find({active: true});

                    bankList.forEach( async function(item, err) {
            
                        let a = ((req.body.sepa + '').length < 4);
                        
                        if ( (item.sepa == a) && (item.country !== req.body.country) && (+req.body.amount <= +item.max_wire) &&
                        (+req.body.amount >= +item.min_wire) && (item.active) ) {
                            //console.log( chalk.blue.inverse.bold(item.name) );
                            let invoicesByBank = await Invoice.find({bank: item.name});
                           
                            let coefficient = 1.1;
                            let invoicesLimitSum = +req.body.amount * 0.25;
                            if (req.body.currency == 'USD') {invoicesLimitSum /= coefficient;}
                            for (let i = 0; i < invoicesByBank.length; i += 1) {
                                if (invoicesByBank[i].currency == 'USD') {
                                    invoicesLimitSum +=  (invoicesByBank[i].amount.amount_requested / coefficient * 0.25 ) + 
                                        (invoicesByBank[i].amount.amount_sent / coefficient * 0.8) + ( invoicesByBank[i].amount.amount_received  / coefficient);
                                } else {
                                    invoicesLimitSum +=  (invoicesByBank[i].amount.amount_requested * 0.25) + 
                                        (invoicesByBank[i].amount.amount_sent * 0.8) + ( invoicesByBank[i].amount.amount_received);
                                }
                                }
                                //console.log( chalk.red.inverse.bold(invoicesLimitSum) );

                            if (invoicesLimitSum >= item.stop_limit) {
                                let a = invoicesLimitSum - (+req.body.amount * 0.25);
                                if ((item.stop_limit - a) <= 1000) {
                                    await Bank.findOneAndUpdate({name: item.name}, {active: false, stop_limit_reached: true});
                                } 
                            } else {
                                //console.log('Available Bank: ---' + item.name)
                                availableBanks.push(item.name);
                            }
                        }
                    }, function() {
                        
                        let availableBank = '';
                        mongo.connect(url, function(err, db) {
                         
                                let merchantClient = db.collection('merchants');
                                merchantClient.findOne({name: req.body.merch}).then(
                                    (item) => {
                                        for (let i = 0; i < item.available_banks.length; i += 1) {
                                            if ( availableBanks.indexOf( item.available_banks[i] ) != -1) {
                                                
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
                                                    amount_sent: 0,
                                                    amount_received: 0,
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
                                
                               // } //else {
                                // let merchantClient = db.collection('merchants');
                                // merchantClient.findOne({name: req.params.merchant}).then(
                                //     (item) => {
                                //         for (let i = 0; i < item.available_banks.length; i += 1) {
                                //             if ( availableBanks.indexOf( item.available_banks[i] ) != -1) {
                                //                 console.log( chalk.blue.inverse.bold(item.available_banks[i]) );
                                //                 availableBank = item.available_banks[i];
                                //                 break;
                                //             }
                                //         }

                                //         if (!availableBank) {
                                //             req.flash('error', 'Sorry, something went wrong. Please, change your invoice options or contact our support team.');
                                //             res.redirect('/InvoiceGeneration.html');
                                //         } else {
                                //             var newInvoice = {
                                //                 number: count + 1,
                                //                 client_details: {
                                //                     full_name: req.body.name,
                                //                     email:  req.body.email,
                                //                     phone:  req.body.phone,
                                //                     country:  req.body.country,
                                //                     address:  req.body.address,
                                //                     id_number: ''
                                //                 },
                                //                 type: 'c2b',
                                //                 status: 'Requested',
                                //                 amount: {
                                //                     amount_requested: +req.body.amount,
                                //                     amount_received: 0,
                                //                     amount_sent: 0,
                                //                     amount_approved: 0,
                                //                     amount_available: 0
                                //                 },
                                //                 currency:  req.body.currency,
                                //                 sepa:  (req.body.sepa + '').length < 4,
                                //                 merchant:  req.params.merchant,
                                //                 bank:  availableBank,
                                //                 dates: {
                                //                     creation_date: new Date(),
                                //                     sent_date: '',
                                //                     received_date: '',
                                //                     approved_date: '',
                                //                     available_date: '',
                                //                     declined_date: ''
                                //                 }, 
                                //                 documents: {
                                //                     id: [],
                                //                     payment_proof: [],
                                //                     utility_bill: [],
                                //                     declaration: []
                                //                 },
                                //                 created_by: {
                                //                     id: objectId(req.params._id),
                                //                     name: req.params.fullname
                                //                 },
                                //                 commissions: [],
                                //                 comments: [
                                //                     {
                                //                         created_by:  req.params.fullname,
                                //                         creation_date: new Date(),
                                //                         message: `Invoice #${count + 1}. Transfer for ${currency}${req.body.amount} was Requested!`
                                //                     }
                                //                 ],
                                //                 settleSelectedStatus: false
                                //             };
                            
                                //             Invoice.create(newInvoice, async function(err, newlyCreated){
                                //                 if(err){
                                //                     console.log(err);
                                //                 } else {
                                //                     console.log('Item inserted');
                                //                     req.flash('success', 'Invoice successfully created!');
                                //                     if (req.body.currency == 'EUR') {
                                //                         await Bank.findOneAndUpdate({name: availableBank}, { $inc: { "balance_EUR.balance_requested": +req.body.amount }});
                                //                     } else if (req.body.currency == 'USD') {
                                //                         await Bank.findOneAndUpdate({name: availableBank},  {$inc: { "balance_USD.balance_requested": +req.body.amount}});
                                //                     }
                                //                     let userInfo = await User.findOne({ _id: req.params._id});
                                //                     if ( userInfo.role == 'Invoice Manager') {
                                //                             res.redirect('/personal-area.html');
                                //                     } else {
                                //                         res.redirect('/invoice-list.html');
                                //                     }
                                //                 }
                                //             });
                                //         }
                                //     });
                                //}
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

router.get("/getActiveBanks", (req, res) => {
    mongo.connect(url, (err, db) =>{
        db.collection("banks").find({active: true}).sort({"name": 1}).toArray(function(err, bank){
            if(err) return console.log("Error with upload Banks!", err);
            db.close();
            res.send(bank);
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
