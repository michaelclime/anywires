const express = require('express'),
    router = new express.Router(),
    objectId = require("mongodb").ObjectID, 
    passport = require('passport'),
    User = require('../modules/user'),
    crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    async = require('async');

router.get('/', function(req, res) {
    res.render("index.html");
});

// Register process
router.get('/registerForm', function(req, res) {
    res.render("registerForm.html");
});

router.get('/successfullRegister', function(req, res) {
    res.render("successfullRegister.html");
});

router.post('/register', function(req, res){
    let merchId = [];
    if (req.body.merchant && req.body.merchant !== null) {
        merchId = req.body.merchant.map( i => objectId(i));
    }

    let newUser = new User({
        username: req.body.username,
        email: req.body.username,
        fullname: req.body.fullname,
        typeClass: req.body.typeClass,
        role: req.body.role,
        merchant: merchId,
        dateCreation: new Date()
    });
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            res.render('registerForm.html');
        } else {
            req.flash('success', 'User successfully created!');
            res.status(201).redirect("users.html");
            // passport.authenticate('local')(req, res, function() {
            //     req.flash('success', 'User successfully created!');
            //     res.status(201).redirect("users.html");
            //     console.log('Successfully created user!');
            // });
        }
    });
});

// Login process

router.post('/login', passport.authenticate("local",
    {
        successRedirect: '/personal-area.html',
        failureRedirect: '/',
        failureFlash: true 
    }), function(req, res) {
});

// LogOut process
router.get('/logout', function(req, res) {
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

router.get('/resetPassword', function(req, res) {
    res.render("resetPassword.html");
});

router.post('/forgot', function(req, res, next) {
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

router.post('/persAreaReset', function(req, res, next) {
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

router.get('/resetPassword/:token', function(req, res) {
    User.findOne( { resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()} }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired!');
            return res.redirect('/');
        };
        res.render('resetPassword.html', {token: req.params.token});
    });
});

router.post('/resetPassword/:token', function(req, res) {
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

router.post('/singup', function(req, res) {
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

module.exports = router;