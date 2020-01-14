const express = require('express'),
      router = new express.Router(),
      objectId = require("mongodb").ObjectID,
      jsonParser = express.json(),
      Merchant = require("../modules/merchant"),
      Settlement = require('../modules/settlement'),
      Wallet = require("../modules/wallet");
 

router.get('/wallets', isLoggedIn, visibilityApproval, function(req, res) {
    res.render("wallets.html");
});


// @route POST /getWalletsPart
// @desc Get 10 Wallets and count them, also you can use filter
router.post('/getWalletsPart', jsonParser, async (req, res) => {
    const filter = req.body.filter
    const skip = req.body.skip
    const limit = req.body.limit

    try {
        // Get number of wallets
        const counts = await Wallet.countDocuments(filter)
        // Get 10 wallets
        const wallets = await  Wallet.find(filter).sort({_id:-1}).skip(skip).limit(limit)
        // Send DATA
        res.send({
            wallets,
            counts
        })
    } catch (e) {
        res.send(e)
    }
});


// @route POST /getWalletById
// @desc Get one Wallet by _id
router.post("/getWalletById", jsonParser, async (req, res) => {
    try {
        const wallet = await Wallet.find({"_id": new objectId(req.body.id)})
        res.send(wallet)
    } catch (e) {
        res.send(e)
    }
});


// @route POST /editWallet
// @desc Edited one Wallet
router.post("/editWallet", jsonParser, (req, res) => {
    const walletId = req.body.walletId;
    const editedWallet = req.body.editedWallet;
    Wallet.updateOne({"_id": new objectId(walletId)}, {$set: editedWallet}, 
    {returnOriginal: false}, (err, bank) => {
        if(err) return console.log("Error witch changing Wallet Data!", err);  
        res.send("Wallet has been changed successfully!")
    });
});


// @route POST /createWallet
// @desc Insert New Wallet
router.post('/createWallet', jsonParser, (req, res) => {
    const newWallet = req.body.newWallet;
    newWallet['creation_date'] = new Date();
    new Wallet(newWallet).save()
    .then( async (newWallet) => {
        if (newWallet.type === "Anywires") {
            try {
                await Merchant.updateOne({"name": newWallet.merchant_name}, {$push: {"inside_wallets": newWallet._id}});
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                await Merchant.updateOne({"name": newWallet.merchant_name}, {$push: {"wallets": newWallet._id}});
            } catch (e) {
                console.log(e);
            }
        }
    })
    .then(() => {
        res.send("Wallet has been created successfully!");
    });
});


// @route GET /get-settlement-by-wallet/:id
// @desc Take one settlement
router.get('/get-settlement-by-wallet/:id', async (req, res) => {
    const walletId = new objectId(req.params.id);
    const settlements = await Settlement.aggregate([
        { $match : { $or: [{'walletTo': walletId}, {'walletFrom': walletId}] } },
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
        },
        {
            $lookup: {
                from: "users",
                localField: 'created_by',    // field in the settlements collection
                foreignField: "_id",  // field in the users collection
                as: "createdBy"
            }
        }
    ]).sort({_id:-1});
    res.send({
        settlements
    });
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/');
};

function visibilityApproval (req, res, next) {
    if ( req.user.role === 'Affiliate' ||  req.user.role === 'Invoice Manager' || req.user.role === 'Solution Manager' ) {
        req.flash('error', 'Sorry, You don\'t have permission to see this page')
        res.redirect('/')
    } else {
        return next()
    }
}

module.exports = router;