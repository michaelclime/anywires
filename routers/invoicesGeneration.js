const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    Invoice = require('../modules/invoice'),
    User = require('../modules/user'),
    Bank = require('../modules/bank'),
    assert = require('assert'),
    objectId = require("mongodb").ObjectID,
    request = require('request'),
    chalk = require('chalk'),
    jsonParser = express.json();

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/InvoiceGeneration.html', visibilityApproval, isLoggedIn, function(req, res) {
    res.render("InvoiceGeneration.html");
});

router.post("/invoiceGenerate/:fullname/:_id", function(req, res, next) {
    
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
                        amount_settled: 0,
                        amount_available: 0
                    },
                    currency:  req.body.currency,
                    merchant:  req.body.merch,
                    bank:  req.body.bank,
                    dates: {
                        creation_date: new Date(),
                        sent_date: '',
                        received_date: '',
                        approved_date: '',
                        settled_date: '',
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
                const url = 'https://api.exchangeratesapi.io/latest';

                let DollarToEuro = await request.get({url, json: true}, async (error,  {body}) => {
                      let coefficient = body.rates.USD;
                      let invoicesLimitSum = +req.body.amount * 0.25;
                      if (req.body.currency == 'USD') {invoicesLimitSum /= coefficient;};
                      
                      invoicesLimitSum += bank.balance_EUR.balance_requested * 0.25 + bank.balance_EUR.balance_sent * 0.8 +  bank.balance_EUR.balance_received +
                                            bank.balance_USD.balance_requested / coefficient * 0.25 + bank.balance_USD.balance_sent / coefficient * 0.8 +  bank.balance_USD.balance_received / coefficient;
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
                                //console.log('Item inserted');
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
                        
                        if ( (item.country.includes(req.body.country)) && (+req.body.amount <= +item.max_wire) &&
                        (+req.body.amount >= +item.min_wire) && (item.active) ) {
                            //console.log( chalk.blue.inverse.bold(item.name) );
                           
                           
                            let coefficient = 1.1;
                            let invoicesLimitSum = +req.body.amount * 0.25;
                            if (req.body.currency == 'USD') {invoicesLimitSum /= coefficient;}
                           
                            invoicesLimitSum += item.balance_EUR.balance_requested * 0.25 + item.balance_EUR.balance_sent * 0.8 +  item.balance_EUR.balance_received +
                                                item.balance_USD.balance_requested / coefficient * 0.25 + item.balance_USD.balance_sent / coefficient * 0.8 +  item.balance_USD.balance_received / coefficient;
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
                        
                        let availableBanksFinal = [];
                        mongo.connect(url, function(err, db) {
                            //console.log( chalk.yellow.inverse.bold(availableBanks) );
                                let merchantClient = db.collection('merchants');
                                merchantClient.findOne({name: req.body.merch}).then(
                                    async (item) => {
                                        for (let i = 0; i < item.available_banks.length; i += 1) {
                                            //console.log( chalk.red.inverse.bold(item.available_banks[i]) );
                                            if ( availableBanks.includes( item.available_banks[i] ) ) {
                                                availableBanksFinal.push(item.available_banks[i]);
                                            }
                                        }
                                        if (!availableBanksFinal.length) {
                                            req.flash('error', 'Sorry, something went wrong. Please, change your invoice options or contact our support team.');
                                            res.redirect('/InvoiceGeneration.html');
                                        } else {
                                            let finalBank = availableBanksFinal[0];
                                            let banksInfo = [];

                                            if (availableBanksFinal.length > 1) {
                                                for (let i = 0; i < availableBanksFinal.length; i += 1) {
                                                    let bank = await Bank.find({name: availableBanksFinal[i]});
                                                    banksInfo.push(bank);
                                                }

                                                let updatedBanksInfo = banksInfo.map( bank => {
                                                    let coefficient = 1.1;
                                                    let invoicesLimitSum = bank[0].balance_EUR.balance_requested * 0.25 + bank[0].balance_EUR.balance_sent * 0.8 +  bank[0].balance_EUR.balance_received +
                                                    bank[0].balance_USD.balance_requested / coefficient * 0.25 + bank[0].balance_USD.balance_sent / coefficient * 0.8 +  bank[0].balance_USD.balance_received / coefficient;
    
                                                    bank.push(bank[0].stop_limit - invoicesLimitSum);
                                                    return bank;
                                                });

                                                let sortedBanks = updatedBanksInfo.sort( (a, b) => b[1] - a[1]);

                                                finalBank = sortedBanks[0][0].name;
                                            }

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
                                                    amount_settled: 0,
                                                    amount_available: 0
                                                },
                                                currency:  req.body.currency,
                                                merchant:  req.body.merch,
                                                bank:  finalBank,
                                                dates: {
                                                    creation_date: new Date(),
                                                    sent_date: '',
                                                    received_date: '',
                                                    approved_date: '',
                                                    settled_date: '',
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
                                                    //console.log('Item inserted');
                                                    req.flash('success', 'Invoice successfully created!');
                                                    if (req.body.currency == 'EUR') {
                                                        await Bank.findOneAndUpdate({name: finalBank}, { $inc: { "balance_EUR.balance_requested": +req.body.amount }});
                                                    } else if (req.body.currency == 'USD') {
                                                        await Bank.findOneAndUpdate({name: finalBank},  {$inc: { "balance_USD.balance_requested": +req.body.amount}});
                                                    }
                                                    let userInfo = await User.findOne({ _id: req.params._id});
                                                   
                                                    res.redirect('/invoice-list.html');
                                                    
                                                }
                                            });
                                        }
                                    });
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

router.get("/getMerchantsForInv", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{
        db.collection("merchants").find({}).sort({"name": 1}).toArray(function(err, merchants){
            if(err) return console.log("Error with upload Merchants!", err);
            res.send(merchants);
        })
    });
});

router.get("/getMerchantsById/:id", jsonParser, async (req, res) => {
    let user = await User.findById(req.params.id);
    let merchList = user.merchant.map( item => objectId(item));
    
    mongo.connect(url, (err, db) =>{
        db.collection("merchants").find({ _id: {$in: merchList}}).sort({"name": 1}).toArray(function(err, merchants){
            if(err) return console.log("Error with upload Merchants!", err);
            res.send(merchants);
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
