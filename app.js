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
    nodemailer = require('nodemailer'),
    fs = require('fs'),
    flash = require('connect-flash'),
    jsonParser = express.json();
    objectId = require("mongodb").ObjectID;


const url = 'mongodb://18.216.223.81:27017/anywires';
// const url = 'mongodb://localhost:27017/anywires';

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
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
    res.locals.message = req.flash('error');
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

app.post("/invoices", function(req, res, next) {
    let newInvoice = {
        name: req.body.name,
        address:  req.body.address,
        country:  req.body.country,
        phone:  req.body.phone,
        email:  req.body.email,
        amount:  req.body.amount,
        currency:  req.body.currency,
        sepa:  req.body.sepa,
        merch:  req.body.merch,
        bank:  req.body.bank
    };

    mongo.connect(url, function(err, db) { 
        assert.equal(null, err);
        db.collection('invoices').insert(newInvoice, function(err, result) {
            assert.equal(null, err);
            console.log('Item inserted');
            db.close();
        });
    });
    res.redirect("/invoice-list.html");
});

// Merchants generation process

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

// Banks generation process

app.get("/getBank", (req, res) => {
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


// Invoice list generation process

app.get("/getInvoices", (req, res) => {
    mongo.connect(url, (err, db) =>{
        db.collection("invoices").find({}).toArray(function(err, invoices){
            if(err) return console.log("Error with upload Merchants!", err);
            db.close();
            res.send(invoices);
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
        fullname: req.body.fullname,
        typeClass: req.body.typeClass,
        role: req.body.role,
        merchant: req.body.merchant
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
        failureRedirect: '/'
    }), function(req, res) {
});

// LogOut process
app.get('/logout', function(req, res) {
    req.logOut();
    req.flash('error', 'Logged you out!');
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'Please LogIn First!');
    res.redirect('/');
}

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
              pass: "27finologycorp"
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
        
    }
    
    main().catch(console.error);
});

// Running server
app.listen(3000, function() {
    console.log('Servering localhost 3000');
});

