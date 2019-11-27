const express = require('express'), 
    router = new express.Router(),
    Invoice = require('../modules/invoice'),
    Merchant = require('../modules/merchant');

const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/affiliateReport.html', isLoggedIn, visibilityApproval, function(req, res) {
    res.render("affiliateReport.html");
});

router.get('/getDatasList/:email/:date', async function(req, res) {
    const merchants = await Merchant.find( { 'users.affiliate': req.params.email });
    const merchantsName = [];
    merchants.forEach( merchant => merchantsName.push(merchant.name))

    let minDate = 0, maxDate = 0;
    if (req.params.date == 'now') {
        nowDate = new Date();
        minDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate());
        maxDate = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + (nowDate.getDate() + 1);
    } else {
        datesArr = req.params.date.split('-');
        for (let i = 0; i < datesArr.length; i += 1) {
            datesArr[i] = new Date(datesArr[i]);
        }
        minDate = datesArr[0].getFullYear() + '-' + (datesArr[0].getMonth() + 1) + '-' + (datesArr[0].getDate() );
        maxDate = datesArr[1].getFullYear() + '-' + (datesArr[1].getMonth() + 1) + '-' + (datesArr[1].getDate() + 1);
    }
    
    const invoices = await Invoice.find( { merchant: { $in: merchantsName }, 
                                        'dates.received_date': { $gt: new Date(minDate), $lt: new Date(maxDate) }} );
    
    res.status(200).send( {merchantsName, invoices});
});

function isLoggedIn(req, res, next) {
    if( req.isAuthenticated() ) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
}

function visibilityApproval(req, res, next) {
    if( req.user.role === 'Affiliate' ||  req.user.role === 'Crm Admin' ) {
        return next()
    }
    req.flash('error', 'Sorry, You don\'t have rigths to see this content');
    res.redirect('/');
}

module.exports = router;