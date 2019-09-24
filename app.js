let express = require("express"),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    assert = require('assert'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./modules/user'),
    Invoice = require('./modules/invoice'),
    nodemailer = require('nodemailer'),
    fs = require('fs'),
    flash = require('connect-flash'),
    jsonParser = express.json();
    objectId = require("mongodb").ObjectID,
    async = require('async'),
    chalk = require('chalk'),
    crypto = require('crypto');


const url = 'mongodb://18.216.223.81:27017/anywires';
// const url = 'mongodb://localhost:27017/anywires';

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(url, { useUnifiedTopology: true });
app.use(flash());

//Passport config
app.use(require('express-session')({
    secret: 'AnyWires Project Clone',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Page routs
app.get('/', function(req, res) {
    res.render("index.html");
});

app.get('/howItWorks.html', function(req, res) {
    res.render("howItWorks.html");
});

app.get('/personal-area.html', isLoggedIn, function(req, res) {
    res.render("personal-area.html");
});

app.get('/dashBoardMainPage.html', isLoggedIn, function(req, res) {
    res.render("dashBoardMainPage.html");
});

app.get('/InvoiceGeneration.html', isLoggedIn, function(req, res) {
    res.render("InvoiceGeneration.html");
});

app.get('/invoice-list.html', isLoggedIn, function(req, res) {
    res.render("invoice-list.html");
});

app.get('/invoice-report.html', isLoggedIn, function(req, res) {
    res.render("invoice-report.html");
});

app.get('/wallets.html', isLoggedIn, function(req, res) {
    res.render("wallets.html");
});

app.get('/settlements.html', isLoggedIn, function(req, res) {
    res.render("settlements.html");
});

app.get('/merchants.html', isLoggedIn, function(req, res) {
    res.render("merchants.html");
});

app.get('/users.html', isLoggedIn, function(req, res) {
    res.render("users.html");
});

app.get('/merchants.html', isLoggedIn, function(req, res) {
    res.render("merchants.html");
});

app.get('/banks.html', isLoggedIn, function(req, res) {
    res.render("banks.html");
});

app.get('/affiliateReport.html', isLoggedIn, function(req, res) {
    res.render("affiliateReport.html");
});

app.get('/Dashboard-how-it-works.html', isLoggedIn, function(req, res) {
    res.render("Dashboard-how-it-works.html");
});

app.get('/how-it-works-dok', isLoggedIn, function(req, res) {
    var filePath = "docs/DOP.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.get("/invoice-preview", isLoggedIn, function (req, res) {
    res.render("invoice-preview.html");
});

// Invoice generation process

app.get('/getList', function(req, res, next) {
    let INVOIECES = [];
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('invoices').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            INVOIECES.push(doc);
        }, function() {
            db.close();
            res.send(INVOIECES);
        });
    });
});

app.post("/invoices/:fullname/:_id/:merchant", function(req, res, next) {

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
                        amount_requested: req.body.amount,
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
                        creation_date: Date.now(),
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
                        id: req.params._id,
                        name: req.params.fullname
                    },
                    commissions: '',
                    comments: [
                        {
                            created_by:  req.params.fullname,
                            creation_date: Date.now(),
                            message: `Invoice ${count + 1} for ${req.body.amount} ${req.body.currency} was Requested!`
                        }
                    ]
                };

                Invoice.create(newInvoice, function(err, newlyCreated){
                    if(err){
                        console.log(err);
                    } else {
                        console.log('Item inserted');
                        req.flash('success', 'Invoice successfully created!');
                        res.redirect("/invoice-list.html");
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
                                                    amount_requested: req.body.amount,
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
                                                    creation_date: Date.now(),
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
                                                    id: req.params._id,
                                                    name: req.params.fullname
                                                },
                                                commissions: '',
                                                comments: [
                                                    {
                                                        created_by:  req.params.fullname,
                                                        creation_date: Date.now(),
                                                        message: `Invoice ${count + 1} for ${req.body.amount} ${req.body.currency} was Requested!`
                                                    }
                                                ]
                                            };
                            
                                            Invoice.create(newInvoice, function(err, newlyCreated){
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    console.log('Item inserted');
                                                    req.flash('success', 'Invoice successfully created!');
                                                    res.redirect("/invoice-list.html");
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
                                                    amount_requested: req.body.amount,
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
                                                    creation_date: Date.now(),
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
                                                    id: req.params._id,
                                                    name: req.params.fullname
                                                },
                                                commissions: '',
                                                comments: [
                                                    {
                                                        created_by:  req.params.fullname,
                                                        creation_date: Date.now(),
                                                        message: `Invoice ${count + 1} for ${req.body.amount} ${req.body.currency} was Requested!`
                                                    }
                                                ]
                                            };
                            
                                            Invoice.create(newInvoice, function(err, newlyCreated){
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    console.log('Item inserted');
                                                    req.flash('success', 'Invoice successfully created!');
                                                    res.redirect("/invoice-list.html");
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


//////////////////////////////////
//                              //
// Merchants generation process //
//                              //                                            
//////////////////////////////////

app.get("/getMerchants", (req, res) => {
    mongo.connect(url, (err, db) =>{
        db.collection("merchants").find({}).toArray(function(err, merchants){
            if(err) return console.log("Error with upload Merchants!", err);
            db.close();
            res.send(merchants);
        })
    });
});

app.post("/postMerchant",jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        db.collection("merchants").insertOne(req.body, function(err, result) {
            if(err) return console.log("Bad POST request!", err);
            db.close();
            res.send(req.body);
        });
    });
});


//////////////////////////////
//                          //
// Banks generation process //
//                          //
//////////////////////////////

app.get("/getBanks", (req, res) => {
    mongo.connect(url, (err, db) =>{
        db.collection("banks").find({}).toArray(function(err, merchants){
            if(err) return console.log("Error with upload Merchants!", err);
            db.close();
            res.send(merchants);
        })
    });
});

app.post("/postBank",jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        db.collection("banks").insertOne(req.body, function(err, result) {
            if(err) return console.log("Bad POST request!", err);
            db.close();
            res.send(req.body);
        });
    });
});

app.put("/putBank", jsonParser, (req, res) => {
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


/////////////////////////////////////
//                                 //
// Invoice list generation process //
//                                 //
/////////////////////////////////////

app.get("/getInvoices", (req, res) => {
    mongo.connect(url, (err, db) => {

        db.collection("invoices").find({}).toArray(function(err, invoices){
            if(err) return console.log("Error with upload Merchants!", err);
            db.close();
            res.send(invoices);
        })
    });
});

app.post("/getPart-Invoices", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        const num = req.body.numbers;
        const filter = req.body.filter;
        var firstDate = req.body.first;
        var secondDate = req.body.second;

        // Перевіряємо чи одна дата чи дві
        if (firstDate && secondDate) {
            var createDateRange = {
                "dates.creation_date": {
                    $gte: new Date(firstDate),
                    $lte: new Date(secondDate),
                }
            };
            req.body.first ? Object.assign(filter, createDateRange) : ""; 

        } else if(secondDate === false){
            var month = new Date(firstDate).getMonth();
            var day = new Date(firstDate).getDate();
            var year = new Date(firstDate).getFullYear();

            secondDate = (month+1) +"/"+ (day+1) +"/"+ year;
            secondDate = new Date(secondDate);

            var createDateRange = {
                "dates.creation_date": {
                    $gte: new Date(firstDate),
                    $lte: new Date(secondDate),
                }
            };
            req.body.first ? Object.assign(filter, createDateRange) : ""; 
        }
        // Перевіряємо чи одна дата чи дві

        db.collection("invoices")
        .find(filter)
        .skip(num)
        .limit(10)
        .toArray(function(err, invoices){
            if(err) return console.log("Error with upload Get Part Invoices!", err);
            db.close();
            res.send(invoices);
        })
    });
});

app.post("/getNumber-Invoices", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
    const filter = req.body.filter;
    var firstDate = req.body.first;
    var secondDate = req.body.second;

        // Перевіряємо чи одна дата чи дві
        if (firstDate && secondDate) {
            var createDateRange = {
                "dates.creation_date": {
                    $gte: new Date(firstDate),
                    $lte: new Date(secondDate),
                }
            };
            req.body.first ? Object.assign(filter, createDateRange) : ""; 
            console.log("first");

        } else if(secondDate === false){
            var month = new Date(firstDate).getMonth();
            var day = new Date(firstDate).getDate();
            var year = new Date(firstDate).getFullYear();

            secondDate = (month+1) +"/"+ (day+1) +"/"+ year;
            secondDate = new Date(secondDate);

            var createDateRange = {
                "dates.creation_date": {
                    $gte: new Date(firstDate),
                    $lte: new Date(secondDate),
                }
            };
            req.body.first ? Object.assign(filter, createDateRange) : ""; 
        }
        // Перевіряємо чи одна дата чи дві 

        db.collection("invoices").find(filter).count(function(err, invoices){
            if(err) return console.log("Error with upload Number of Invoices!", err);
            
            db.close();
            res.send({"numbers": invoices});
        })
    });
});

app.post("/getInvoiceMerchant", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{
        const id = new objectId(req.body.id);

        db.collection("merchants").find({_id: id}).toArray(function(err, merchant){
            if(err) return console.log("Error with upload Invoice Merchant!", err);
            db.close();
            res.send(merchant);
        });
    });
});

app.post("/getInvoiceBanks", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{
        const id = new objectId(req.body.id);

        db.collection("banks").find({_id: id}).toArray(function(err, bank){
            if(err) return console.log("Error with upload Invoice Merchant!", err);
            db.close();
            res.send(bank);
        });
    });
});


//////////////////////////////
//                          //
// Invoice Preview Proccess //
//                          //
//////////////////////////////

app.post("/get-invoiceByNumber", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{

        db.collection("invoices").find({number: req.body.number}).toArray(function(err, invoice){
            if(err) return console.log("Error with upload Invoice Merchant!", err);
            db.close();
            res.send(invoice);
        });
    });
});

app.post("/get-bankByName", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{

        db.collection("banks").find({name: req.body.name}).toArray(function(err, bank){
            if(err) return console.log("Error with upload Invoice Merchant!", err);
            db.close();
            res.send(bank);
        });
    });
});

app.post("/get-merchantByName", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{

        db.collection("merchants").find({name: req.body.name}).toArray(function(err, merchant){
            if(err) return console.log("Error with upload Invoice Merchant!", err);
            db.close();
            res.send(merchant);
        });
    });
});

//==================
// Authorization
//==================

// Register process
app.get('/register', function(req, res) {
    res.render("registerForm.html");
});

app.get('/successfullRegister', function(req, res) {
    res.render("successfullRegister.html");
});

app.post('/register', function(req, res){
    let newUser = new User({
        username: req.body.username,
        email: req.body.username,
        fullname: req.body.fullname,
        typeClass: req.body.typeClass,
        role: req.body.role,
        merchant: req.body.merchant,
        merchant2: req.body.merchant2,
        date: Date.now()
    });
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            res.render('registerForm.html');
        } else {
            passport.authenticate('local')(req, res, function() {
                res.redirect('/successfullRegister');
                console.log('Successfully created user!');
            });
        }
    });
});

// Login process

app.post('/login', passport.authenticate("local",
    {
        successRedirect: '/dashBoardMainPage.html',
        failureRedirect: '/',
        failureFlash: true 
    }), function(req, res) {
});

// LogOut process
app.get('/logout', function(req, res) {
    req.logOut();
    req.flash('success', 'Logged you out!');
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
}

// Reset Password

app.get('/resetPassword', function(req, res) {
    res.render("resetPassword.html");
});

app.post('/forgot', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({email: req.body.email}, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists!');
                    return res.redirect('/');
                };
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  type: "login",
                  user: "bogdan.melnik@brokers.expert",
                  pass:  process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: '"AnyWires" <AnyWires@gmail.com>',  
                subject: 'Reset Password', 
                text: 'You are receiving this because you (someone else) have requested the reset of the password for your AnyWires account.' + 
                        'Please click on the following link to complete this process:' + '\n\n' +
                        'http://' + req.headers.host + '/resetPassword/' + token + '\n\n' +
                        'If you didn\'t request it, please ignore this email!'
            };
            smtpTransporter.sendMail(mailOptions, function(err) {
                console.log('mail sent');
                req.flash('success', 'An email has been sent to you with futher instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/');
    });
});

app.post('/persAreaReset', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({email: req.user.email}, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists!');
                    return res.redirect('/');
                };
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            res.redirect('http://' + req.headers.host + '/resetPassword/' + token);
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/');
    });
});

app.get('/resetPassword/:token', function(req, res) {
    User.findOne( { resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()} }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired!');
            return res.redirect('/');
        };
        res.render('resetPassword.html', {token: req.params.token});
    });
});

app.post('/resetPassword/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne( { resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()} }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired!');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user)
                            });
                        });
                    });
                } else {
                    req.flash('error', 'Password don\'t match');
                    return res.redirect('back');
                }
            });
        },
        function(user, done) {
            var smtpTransporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  type: "login",
                  user: "bogdan.melnik@brokers.expert",
                  pass: "27finologycorp"
                }
            });
            var mailOptions = {
                to: user.email,
                from: '"AnyWires" <AnyWires@gmail.com>',  
                subject: 'Your password has been changed', 
                text: 'This is a confirmation, that password for your AnyWires account has been changed.'
            };
            smtpTransporter.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        } 
    ], function(err) {
        res.redirect('/personal-area.html');
    });
});

// Sign up menu and sending email

app.post('/sigup', function(req, res) {
    let newMessage = 
        'Name: ' + req.body.name + '\n' +
        'Brand: ' + req.body.brand + '\n' +
        'SiteURL: ' + req.body.siteURL + '\n' +
        'Email: ' + req.body.email + '\n' +
        'PhoneNumber: ' + req.body.phoneNumber;

    async function main() {

        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              type: "login", // default
              user: "bogdan.melnik@brokers.expert",
              pass: process.env.GMAILPW
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"AnyWires" <AnyWires@gmail.com>', 
            to: 'm.clime@brokers.expert', 
            subject: 'A New Client AnyWires', 
            text: newMessage
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        req.flash('success', 'Your request successfully created! \n \n We\'ll contact you ASAP!');
        res.redirect('/');
    }
    
    main().catch(console.error);
});

// Running server
app.listen(3000, function() {
    console.log('Servering localhost 3000');
});

