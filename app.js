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
    crypto = require('crypto'),
    xoauth2 = require('xoauth2'),
    multer = require("multer");

const url = 'mongodb://18.216.223.81:27017/anywires';
// const url = 'mongodb://localhost:27017/anywires';

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(url, { useUnifiedTopology: true });


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

app.get('/settlementReport.html', isLoggedIn, function(req, res) {
    res.render("settlementReport.html");
});

app.get('/settlementPreview.html', isLoggedIn, function(req, res) {
    res.render("settlementPreview.html");
});

app.get('/merchantReport.html', isLoggedIn, function(req, res) {
    res.render("merchantReport.html");
});

// Invoice generation process

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

app.get("/getMerchants", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{
        db.collection("merchants").find({}).toArray(function(err, merchants){
            if(err) return console.log("Error with upload Merchants!", err);
            db.close();
            res.send(merchants);
        })
    });
});

app.post("/getPart-Merchants", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
    var number = req.body.number;
    var filter = req.body.filter;

        db.collection("merchants")
        .find(filter, { score: { $meta: "textScore" } })
        .skip(number)
        .limit(10)
        .sort({ score: { $meta: "textScore" } })
        .toArray(function(err, merchants){
            if(err) return console.log("Error with upload Merchants!", err);
            db.close();
            res.send(merchants);
        })
    });
});

app.post("/getNumber-Merchants", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        var filter = req.body.filter;
        filter === undefined ? filter = {} : "";

        db.collection("merchants").find(filter).count(function(err, merchants){
            if(err) return console.log("Error with upload Number of Invoices!", err);
            
            db.close();
            res.send({"numbers": merchants});
        })
    });
});

app.post("/postMerchant",jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        db.collection("merchants").insertOne(req.body, function(err, result) {
            if(err) return console.log("Bad POST Merchants request!", err);
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
            if(err) return console.log("Error with upload Banks!", err);
            db.close();
            res.send(merchants);
        })
    });
});

app.post("/getPart-Banks", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        var number = req.body.number;
        var filter = req.body.filter;

        db.collection("banks")
        .find(filter, { score: { $meta: "textScore" } })
        .skip(number)
        .limit(10)
        .sort({ score: { $meta: "textScore" } })
        .toArray(function(err, bank){
            if(err) return console.log("Error with upload Banks Part!", err);
            db.close();
            res.send(bank);
        })
    });
});

app.post("/getNumber-Banks", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        var filter = req.body.filter;
        filter === undefined ? filter = {} : "";

        db.collection("banks").find(filter).count(function(err, bank){
            if(err) return console.log("Error with upload Number of Banks!", err);
            
            db.close();
            res.send({"numbers": bank});
        })
    });
});

app.post("/postBank",jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        db.collection("banks").insertOne(req.body, function(err, result) {
            if(err) return console.log("Bad POST Banks request!", err);
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
            if(err) return console.log("Error with upload Invoices!", err);
            db.close();
            res.send(invoices);
        })
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
    } 
    Obj[key] = {
        $gte: new Date(first),
        $lte: new Date(second),
    };
    return Obj;
}; 
// Function for Dates Range END.

app.post("/getPart-Invoices", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        var num = req.body.numbers;
        var filter = req.body.filter;
        filter === undefined ? filter = {} : "";

        // Cheking one or two days Creation START.
        var firstCrea = req.body.firstCr;
        var secondCrea = req.body.secondCr;
        if (firstCrea) {
            var creation = datesObj("dates.creation_date", firstCrea, secondCrea);
            Object.assign(filter, creation);
        } 
        // // Cheking one or two days Creation END.


        // Cheking one or two days Receive START.
        var firstRec = req.body.firstRe;
        var secondRec = req.body.secondRe;
        if (firstRec) {
            var receive = datesObj("dates.received_date", firstRec, secondRec);
            Object.assign(filter, receive);
        } 
        // Cheking one or two days Receive END.

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
        var filter = req.body.filter;
        filter === undefined ? filter = {} : "";

        // Cheking one or two days Creation START.
        var firstCrea = req.body.firstCr;
        var secondCrea = req.body.secondCr;
        if (firstCrea) {
            var creationD = datesObj("dates.creation_date", firstCrea, secondCrea);
            Object.assign(filter, creationD);
        } 
        // Cheking one or two days Creation END.

        // Cheking one or two days Receive START.
        var firstRec = req.body.firstRe;
        var secondRec = req.body.secondRe;
        if (firstRec) {
            var receive = datesObj("dates.received_date", firstRec, secondRec);
            Object.assign(filter, receive);
        } 
        // Cheking one or two days Receive END.

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
            if(err) return console.log("Error with upload Invoice Banks!", err);
            db.close();
            res.send(bank);
        });
    });
});


app.post("/getDocs", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        const id = new objectId(req.body.id);
        var filter = req.body.filter;
        if (id){
            var newFilter = {_id: id};
            Object.assign(filter, newFilter);
        }

        db.collection("documents").find(filter).toArray(function(err, doc){
            if(err) return console.log("Error with upload Docs!", err);
            db.close();
            res.send(doc);
        });
    });
});

app.post("/postComment", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        const number = req.body.number;
        var newComment = req.body.data;
        var now = new Date();
        var createBy = req.body.create_by;

        db.collection("invoices").updateOne({"number":number}, {$push: {comments: { "created_by": createBy, "creation_date": now, "message": newComment } } },
        {returnOriginal: false },function(err, result){
           if(err) return console.log(err);     
           const bank = result.value;
           res.send(bank);
       });
    });
});

app.post("/postEditedInvoice", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        const number = req.body.number;
        const data = req.body.newInvoice;

        db.collection("invoices").updateOne({"number": number}, {$set: data },
        {returnOriginal: false },function(err, result){
           if(err) return console.log(err);     
           const invoice = result.value;
           res.send(invoice);
       });
    });
});


// Init Multer for uploading files into MongoDB and Server
const upload = multer({dest:"uploads"});

// @route POST /upload
// @desc Uploads file to DB
app.post("/upload", upload.single("file"), jsonParser, (req, res) => {

    let file = req.file;
    if(!file) return res.send("Ошибка при загрузке файла");

    const type = req.body.type;
    const newDoc = {
        "type": type,
        "status": "Non-Verified",
        "filename": req.file.filename,
        "creation_date": new Date(),
        "creator": req.body.creator,
        "originalname": req.file.originalname,
        "encoding": req.file.encoding,
        "mimetype": req.file.mimetype,
        "size": req.file.size
    };
    var obj = {};
    const number = req.body.number;
    
    // First Step "Insert new document to Documents collection"
     mongo.connect(url, (err, db) => {
        db.collection("documents").insertOne(newDoc, (err) => {
            if (err) return console.log(err, "Error with inseerting Document!");

            var docId = new objectId(newDoc._id);
            type === "ID" ? obj = {"documents.id": {"id": docId, "status": "Non-Verified"} } : "";
            type === "Payment proof" ? obj = {"documents.payment_proof": {"id": docId, "status": "Non-Verified"} } : "";
            type === "Utility Bill" ? obj = {"documents.utility_bill": {"id": docId, "status": "Non-Verified"} } : "";
            type === "Declaration" ? obj = {"documents.declaration": {"id": docId, "status": "Non-Verified"} } : "";

            // Second step is insert new document to Invoice
            mongo.connect(url, (err, db) =>{
                if(err) return console.log(err);  
        
                db.collection("invoices").updateOne({"number": number}, {$push: obj},
                {returnOriginal: false }, function(err, result){
        
                   if(err) return console.log(err);   
                   res.send("Document successfully has been uploaded!");
               });
            });
        }), {returnOriginal: false }, (err, res) => {
            if(err) return console.log(err);
        };
    });
});


// Checking if type is supported for open in browser
var checkTypeOfDocument = (type, filePath, res) => {
    if(type !== "application/pdf" && type !== "image/jpeg" && type !== "image/png"){
        res.send("File type is not supported!");
    } else {
        fs.readFile(__dirname + filePath , (err, data) => {
            if (err) return console.log(err, "Can't open current file!");
            res.contentType(type);
            res.send(data);
        });
    }
};


// @route GET /upload/:filename 
// @desc Open file from PATH /upload
app.get("/upload/:filename", (req, res) => {
    const filename = req.params.filename;
    var filePath = `/uploads/${filename}`;

    mongo.connect(url, (err, db) => {
        if (err) return console.log(err, "Can't connect to database!");
        db.collection("documents").find({"filename": filename}).toArray(function(err, doc){
            if(err) return console.log("Error with openning file!", err);

            checkTypeOfDocument(doc[0].mimetype, filePath, res);
        });
    });
});


// @route POST /changeDocStatus
// @desc Changed Documents status
app.post("/changeDocStatus", jsonParser, (req, res) => {
    const filename = req.body.filename;
    const status = req.body.status;

    // 1. First, we need to find Document which we need and change status in Document for current status.
    mongo.connect(url, (err, db) => {
        if (err) return console.log(err, "Can't connect to database!");
        db.collection("documents").findOneAndUpdate({"filename": filename}, {$set: {"status": status}}, (function(err, doc){
            if(err) return console.log("Error with changing status for document!", err);
            
            const id = new objectId(doc.value._id);
            var obj = {};
            var objDel = {};
            const number = req.body.number;
            const type = req.body.type;

            // 2. Second, we need to delete old Document in Invoice.
            type === "ID" ? objDel = {"documents.id": {"id": id} } : "";
            type === "Payment proof" ? objDel = {"documents.payment_proof": {"id": id} } : "";
            type === "Utility Bill" ? objDel = {"documents.utility_bill": {"id": id} } : "";
            type === "Declaration" ? objDel = {"documents.declaration": {"id": id} } : "";

            // 3. After, we need to add new Document with new Status to Invoice
            type === "ID" ? obj = {"documents.id": {"id": id, "status": status} } : "";
            type === "Payment proof" ? obj = {"documents.payment_proof": {"id": id, "status": status} } : "";
            type === "Utility Bill" ? obj = {"documents.utility_bill": {"id": id, "status": status} } : "";
            type === "Declaration" ? obj = {"documents.declaration": {"id": id, "status": status} } : "";

            mongo.connect(url, (err, db) => {
                if (err) return console.log(err, "Can't connect to database!");
                db.collection("invoices").bulkWrite([
                    {
                        // Remove exist doc
                        updateOne: {
                            "filter": {"number": number},
                            "update": {"$pull": objDel },
                            "upsert" : true,
                            "collation": {"number": number}
                        }
                    },
                    {
                        // Add new doc
                        updateOne: {
                            "filter": {"number": number},
                            "update": {"$push": obj},
                            "upsert" : true,
                            "collation": {"number": number}
                        }
                    }
                ]), {returnOriginal: false}, (err, res) => {
                    if (err) return console.log(err, "Error with changing document status inside Invoice!");
                };
                res.send("Status were changed!");
            });
        }));
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
            if(err) return console.log("Error with upload Invoice Preview!", err);
            db.close();
            res.send(invoice);
        });
    });
});

app.post("/get-bankByName", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{

        db.collection("banks").find({name: req.body.name}).toArray(function(err, bank){
            if(err) return console.log("Error with upload Bank!", err);
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


//////////////////////////////
//                          //
//          USERS           //
//                          //
//////////////////////////////

app.post("/getPart-Users", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        var number = req.body.number;
        var filter = req.body.filter;

        // Cheking one or two days Last Login
        var startLog = req.body.startLog;
        var endLog = req.body.endLog;
        if (startLog) {
            var login = datesObj("last_login_date", startLog, endLog);
            Object.assign(filter, login);
        } 
        // // Cheking one or two days Last Login

        db.collection("users")
        .find(filter, { score: { $meta: "textScore" } })
        .skip(number)
        .limit(10)
        .sort({ score: { $meta: "textScore" } })
        .toArray(function(err, user){
            if(err) return console.log("Error with upload Users Part!", err);
            db.close();
            res.send(user);
        })
    });
});

app.post("/getNumber-Users", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        var filter = req.body.filter;
        filter === undefined ? filter = {} : "";

        // Cheking one or two days Creation START.
        var startLog = req.body.startLog;
        var endLog = req.body.endLog;
        if (startLog) {
            var login = datesObj("last_login_date", startLog, endLog);
            Object.assign(filter, login);
        } 
        // // Cheking one or two days Creation END.

        db.collection("users").find(filter).count(function(err, user){
            if(err) return console.log("Error with upload Number of Users!", err);
            
            db.close();
            res.send({"numbers": user});
        })
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
        dateCreation: new Date()
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
                user.resetPasswordExpires =  Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransporter = nodemailer.createTransport({
                // service: 'Gmail',
                // auth: {
                //   type: "login",
                //   user: "bogdan.melnik@brokers.expert",
                //   pass:  process.env.GMAILPW
                // }
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: 'OAuth2',     
                    user: "bogdan.melnik@brokers.expert",
                    clientId: '4299782568-tq6cm8spg6gmnjnrvuhs136vp6osaq4n.apps.googleusercontent.com',
                    clientSecret: 'w2qGL_wcL835Pt84iCHvJrLj',
                    refreshToken: '1/s8L2H1aqy32HycaRa0Zz7DagW-dJzZFMachf1ipJyQE',
                    accessToken: 'ya29.Il-UB0lqRnIoXkNvpiRSjevi6biQLn0uTUTaRm1uKpYgfPqii5uvRhiM2VE8USTM8auKmyU_Ao1ruJ8wkiEDia78YX60gLZky8MEyTFdZucI8GGNwscuAbJZZyXyHJSTQg'
                }
            });
            var mailOptions = {
                to: user.email,
                from: '"AnyWires" <bogdan.melnik@brokers.expert>',  
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
                user.resetPasswordExpires =  Date.now() + 3600000; // 1 hour

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
                // service: 'Gmail',
                // auth: {
                //   type: "login",
                //   user: "bogdan.melnik@brokers.expert",
                //   pass:  process.env.GMAILPW
                // }
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: 'OAuth2',     
                    user: "bogdan.melnik@brokers.expert",
                    clientId: '4299782568-tq6cm8spg6gmnjnrvuhs136vp6osaq4n.apps.googleusercontent.com',
                    clientSecret: 'w2qGL_wcL835Pt84iCHvJrLj',
                    refreshToken: '1/s8L2H1aqy32HycaRa0Zz7DagW-dJzZFMachf1ipJyQE',
                    accessToken: 'ya29.Il-UB0lqRnIoXkNvpiRSjevi6biQLn0uTUTaRm1uKpYgfPqii5uvRhiM2VE8USTM8auKmyU_Ao1ruJ8wkiEDia78YX60gLZky8MEyTFdZucI8GGNwscuAbJZZyXyHJSTQg'
                }
            });
            var mailOptions = {
                to: user.email,
                from: '"AnyWires" <bogdan.melnik@brokers.expert>',  
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

app.post('/singup', function(req, res) {
    let newMessage = 
    'Name: ' + req.body.name + '\n' +
    'Brand: ' + req.body.brand + '\n' +
    'SiteURL: ' + req.body.siteURL + '\n' +
    'Email: ' + req.body.email + '\n' +
    'PhoneNumber: ' + req.body.phoneNumber;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',     
            user: "bogdan.melnik@brokers.expert",
            clientId: '4299782568-tq6cm8spg6gmnjnrvuhs136vp6osaq4n.apps.googleusercontent.com',
            clientSecret: 'w2qGL_wcL835Pt84iCHvJrLj',
            refreshToken: '1/s8L2H1aqy32HycaRa0Zz7DagW-dJzZFMachf1ipJyQE',
            accessToken: 'ya29.Il-UB0lqRnIoXkNvpiRSjevi6biQLn0uTUTaRm1uKpYgfPqii5uvRhiM2VE8USTM8auKmyU_Ao1ruJ8wkiEDia78YX60gLZky8MEyTFdZucI8GGNwscuAbJZZyXyHJSTQg'
        }
    });

    let mailOptions = {
        to: "bogdan.melnik@brokers.expert",
        from: '"AnyWires" <bogdan.melnik@brokers.expert>',  
        subject: 'A New Client AnyWires', 
        text: newMessage
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Your request successfully created! \n \n We\'ll contact you ASAP!');
            res.redirect('/');
        }
    });
});

// =================================
// Dashboard
//==================================

app.get('/getInvListToday', function(req, res, next) {
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

app.get('/getInvListToday/:merchant', function(req, res, next) {
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

app.get('/getInvListWeek', function(req, res, next) {
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

app.get('/getInvListWeek/:merchant', function(req, res, next) {
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


app.get('/getInvListMonth', function(req, res, next) {
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

app.get('/getInvListMonth/:merchant', function(req, res, next) {
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

app.get('/getInvListAll', function(req, res, next) {
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

app.get('/getInvListAll/:merchant', function(req, res, next) {
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

app.get('/getWallet/:merchant', function(req, res, next) {
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

///////////////////////////////
//    SETTLEMENTS
///////////////////////////////

app.get('/availableInvs/:merchant', function(req, res, next) {
    let INVOIECES = [];
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('invoices').find({ 'status': 'Available',
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

app.get("/getWalletsList", (req, res) => {
    mongo.connect(url, (err, db) =>{
        db.collection("wallets").find({}).toArray(function(err, wallets){
            if(err) return console.log("Error with upload wallets!", err);
            db.close();
            res.send(wallets);
        })
    });
});

app.get("/getSettlementsList", (req, res) => {
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
            }
        ]).toArray(function(err, settlements) {
            if (err) throw err;
            res.send(settlements.reverse());
            db.close();
        });
    });
});

app.post('/addSettleComment/:id', jsonParser,  function(req, res) {
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

app.post('/addSettleCommision/:id', jsonParser,  function(req, res) {
    let newID =  objectId();

    mongo.connect(url, (err, db) => {
        db.collection("commissions").insertOne( {
            _id: newID,
            created_by: req.body.created_by, 
            amount: req.body.amount,
            type: req.body.type,
            percentage: ''
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

app.post('/changeSettleStatus/:id', jsonParser,  function(req, res) {
    
    mongo.connect(url, (err, db) => {
        if (req.body.sent_date) {
            db.collection("settlements").findOneAndUpdate( {
                _id: new objectId(req.params.id)
            }, { $set: { 
                    "status": req.body.newStatus,
                    "dates.sent_date":  req.body.sent_date
                }         
            });
        } else  if (req.body.received_date) {
            db.collection("settlements").findOneAndUpdate( {
                _id: new objectId(req.params.id)
            }, { $set: { 
                    "status": req.body.newStatus,
                    "dates.received_date":  req.body.received_date
                }         
            });
        } else {
            db.collection("settlements").findOneAndUpdate( {
                _id: new objectId(req.params.id)
            }, { $set: { 
                    "status": req.body.newStatus,
                    "dates.declined_date":  req.body.declined_date
                }         
            });
        }
    });
});

app.post("/uploadSettleDoc", upload.single("file"), jsonParser, (req, res) => {
   
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

// Running server
app.listen(3000, function() {
    console.log('Servering localhost 3000');
});
