const express = require("express"),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./modules/user'),
    invoiceGenerationRouter = require('./routers/invoicesGeneration'),
    dashBoardMainPageRouter = require('./routers/dashBoardMainPage'),
    authorizationRouter = require('./routers/authorization'),
    settlementsRouter = require('./routers/settlements'),
    usersRouter = require('./routers/users'),
    merchantsRouter = require('./routers/merchants'),
    banksRouter = require('./routers/banks'),
    invoiceListRouter = require('./routers/invoice-list'),
    wallets = require("./routers/wallets"),
    affiliateReportRouter = require('./routers/affiliateReport');

const url = 'mongodb://18.216.223.81:27017/anywires';

// View Engine Setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
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

app.use(authorizationRouter);
app.use(invoiceGenerationRouter);
app.use(dashBoardMainPageRouter);
app.use(settlementsRouter);
app.use(usersRouter);
app.use(merchantsRouter);
app.use(banksRouter);
app.use(invoiceListRouter);
app.use(wallets);
app.use(affiliateReportRouter);


app.get('/personal-area.html', isLoggedIn, function(req, res) {
    res.render("personal-area.html");
});

app.get('/Dashboard-how-it-works.html', isLoggedIn, function(req, res) {
    res.render("Dashboard-how-it-works.html");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
}

// =====================
// Running server
// =====================

app.listen(3000, function() {
    console.log('Servering on port 3000');
});