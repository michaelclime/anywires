const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    jsonParser = express.json(),
    multer = require("multer"),
    objectId = require("mongodb").ObjectID,
    fs = require("fs"),
    Invoice = require("../modules/invoice"),
    Bank = require("../modules/bank"),
    Merchant = require("../modules/merchant"),
    Commission = require("../modules/commission"),
    ejs =  require('ejs');
 
const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/invoice-list.html', isLoggedIn, function(req, res) {
    res.render("invoice-list.html");
});

router.get('/invoice-report.html', isLoggedIn, function(req, res) {
    res.render("invoice-report.html");
});

router.get("/invoice-preview", async function (req, res) {
    setTimeout( async () => {
        const invoiceNumber = Object.keys(req.query)[0];
        const invoice = await Invoice.find({number: invoiceNumber});
        const bank = await Bank.find({name: invoice[0].bank});
        
        const bankLogo = bank[0].company_logo;
        const bankBenefAddress = bank[0].beneficiary_address;
        const bankName = bank[0].name;
        const bankAddress = bank[0].bank_address;
        const bankSWIFT = bank[0].swift_bic;
        const bankSite = bank[0].company_site;
        const invBankBenefName = bank[0].beneficiary_name;
        const invoiceDate = invoice[0].dates.creation_date;
        const invAmount = invoice[0].amount.amount_requested;
        const invoiceCurrency = invoice[0].currency;
        const invClientName = invoice[0].client_details.full_name;
        const invClientEmail = invoice[0].client_details.email;
        const invClientAdress = invoice[0].client_details.address;
        const invClientID = invoice[0].client_details.id_number;
        const invClientPhone = invoice[0].client_details.phone;
        const bankIBAN_EUR = bank[0].iban_EUR;
        const bankIBAN_USD = bank[0].iban_USD;
    
        res.render("invoice-preview.html", { invoiceNumber, bankLogo, bankBenefAddress, bankName, invClientPhone, bankIBAN_EUR, bankIBAN_USD,
                    bankAddress, bankSWIFT, bankSite, invBankBenefName, invoiceDate, invAmount, invoiceCurrency, invClientName, invClientEmail, invClientAdress, invClientID });
    }, 1000);
});

router.get("/invoiceContract", async function (req, res) {
    const invoiceNumber = Object.keys(req.query)[0];
    const invoice = await Invoice.find({number: invoiceNumber});
    const bank = await Bank.find({name: invoice[0].bank});

   
    const bankBenefAddress = bank[0].beneficiary_address;
    const bankSite = bank[0].company_site;
    const invBankBenefName = bank[0].beneficiary_name;
    const invoiceDate = invoice[0].dates.creation_date;
    const invClientName = invoice[0].client_details.full_name;
    const invClientEmail = invoice[0].client_details.email;
    const invClientAdress = invoice[0].client_details.address;

    res.render("invoiceContract.html", { invoiceNumber, bankBenefAddress, bankSite, invBankBenefName, invoiceDate, invClientName, invClientEmail, invClientAdress });
});
router.get("/invoiceDecOfPay", async function (req, res) {
    const invoiceNumber = Object.keys(req.query)[0];
    const invoice = await Invoice.find({number: invoiceNumber});
    const bank = await Bank.find({name: invoice[0].bank});
    
    const bankLogo = bank[0].company_logo;
    const invClientCountry = invoice[0].client_details.country;
    const invClientID = invoice[0].client_details.id_number;
    const invBankBenefName = bank[0].beneficiary_name;
    const invoiceDate = invoice[0].dates.creation_date;
    const invAmount = invoice[0].amount.amount_sent;
    const invoiceCurrency = invoice[0].currency;

    res.render("invoiceDecOfPay.html", {bankLogo, invClientCountry, invClientID, invBankBenefName, invoiceDate, invAmount, invoiceCurrency});
});

router.get("/invoicePreviewBankVersion", async function (req, res) {
    const invoiceNumber = Object.keys(req.query)[0];
    const invoice = await Invoice.find({number: invoiceNumber});
    const bank = await Bank.find({name: invoice[0].bank});
    
    const bankLogo = bank[0].company_logo;
    const bankBenefAddress = bank[0].beneficiary_address;
    const bankName = bank[0].name;
    const bankAddress = bank[0].bank_address;
    const bankSWIFT = bank[0].swift_bic;
    const bankSite = bank[0].company_site;
    const invBankBenefName = bank[0].beneficiary_name;
    const invoiceDate = invoice[0].dates.creation_date;
    const invAmount = invoice[0].amount.amount_requested;
    const invoiceCurrency = invoice[0].currency;
    const invClientName = invoice[0].client_details.full_name;
    const invClientEmail = invoice[0].client_details.email;
    const invClientAdress = invoice[0].client_details.address;
    const invClientID = invoice[0].client_details.id_number;
    const invClientPhone = invoice[0].client_details.phone;
    const bankIBAN_EUR = bank[0].iban_EUR;
    const bankIBAN_USD = bank[0].iban_USD;

    res.render("invoicePreviewBankVersion.html", { invoiceNumber, bankLogo, bankBenefAddress, bankName, invClientPhone, bankIBAN_EUR, bankIBAN_USD,
                bankAddress, bankSWIFT, bankSite, invBankBenefName, invoiceDate, invAmount, invoiceCurrency, invClientName, invClientEmail, invClientAdress, invClientID });
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

router.post("/getPart-Invoices", jsonParser, (req, res) => {
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
        .sort({_id:-1})
        .skip(num)
        .limit(10)
        .toArray(function(err, invoices){
            if(err) return console.log("Error with upload Get Part Invoices!", err);
            db.close();
            res.send(invoices);
        })
    });
});

router.post("/getNumber-Invoices", jsonParser, (req, res) => {
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


router.post("/getDocs", jsonParser, (req, res) => {
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


router.post("/postComment", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        const number = req.body.number;
        var newComment = req.body.data;
        var now = new Date();
        var createBy = req.body.create_by;

        db.collection("invoices").updateOne({"number": number}, {$push: {comments: { "created_by": createBy, "creation_date": now, "message": newComment } } },
        {returnOriginal: false },function(err, result){
           if(err) return console.log(err);  
           res.send("Comment was add!");
       });
    });
});


router.post("/postEditedInvoice", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {
        const number = req.body.number;
        const data = req.body.newInvoice;
        const comment = req.body.comment;
        const createdBy = req.body.createdBy;

        /////////////////////////////////////////////////////
        //// 1. Change Invoice details and push Comment ////
        ///////////////////////////////////////////////////
        db.collection("invoices").findOneAndUpdate({"number": number}, {
            $set: data,
            $push: {
                "comments": {
                    "created_by": createdBy, 
                    "creation_date": new Date(), 
                    "message": `Invoice #${number}. ${comment}`
                }
            }
        },
        {returnOriginal: false },function(err, inv){
           if(err) return console.log(err);  
        
            const currecyChanged = req.body.currecyChanged;
            const chnagedAmountReq = req.body.chnagedAmountReq;
            const amountReqOld = req.body.amountReqOld;
            const chnagedAmountSent = req.body.chnagedAmountSent;
            const amountSentOld = req.body.amountSentOld;
            const changedBank = req.body.changedBank;
            const oldBank = req.body.oldBank;

            //////////////////////////////////////////////////////////
            //// 2. If only currency has been changed than ...   ////
            ////////////////////////////////////////////////////////
            if (currecyChanged && !chnagedAmountReq && !chnagedAmountSent && !changedBank) {
                var newBalance = {};

                // If Status Sent
                if (inv.value.status === "Sent"){
                   if (inv.value.currency === "USD"){ // If status Sent and currency USD
                        newBalance = {"balance_EUR.balance_sent": -inv.value.amount.amount_sent, "balance_USD.balance_sent": +inv.value.amount.amount_sent};
                   } else if (inv.value.currency === "EUR"){ // If status Sent and currency EUR
                        newBalance = {"balance_USD.balance_sent": -inv.value.amount.amount_sent, "balance_EUR.balance_sent": +inv.value.amount.amount_sent};
                   }
                }

                // If Status Requested
                if (inv.value.status === "Requested"){
                    if (inv.value.currency === "USD"){ // If status Requested and currency USD
                        newBalance = {"balance_EUR.balance_requested": -inv.value.amount.amount_requested, "balance_USD.balance_requested": +inv.value.amount.amount_requested};
                   } else if (inv.value.currency === "EUR"){ // If status Requested and currency EUR
                        newBalance = {"balance_USD.balance_requested": -inv.value.amount.amount_requested, "balance_EUR.balance_requested": +inv.value.amount.amount_requested};
                   }
                }

                Bank.updateOne({"name": inv.value.bank}, {$inc: newBalance}, 
                {returnOriginal: false}, (err, bank) => {
                    if(err) return console.log(err, "Error with changing Invoice currency for Bank!"); 
                });
            }

            /////////////////////////////////////////////////////////////////////////////
            ////  3. If amount Requested was changed, AND currency has been changed  ///
            ///////////////////////////////////////////////////////////////////////////
            if (chnagedAmountReq && currecyChanged && !changedBank) {
                var newBalance = {};
                if (inv.value.currency === "USD"){ 
                    newBalance = {"balance_EUR.balance_requested": -amountReqOld, "balance_USD.balance_requested": +inv.value.amount.amount_requested};

                } else  if (inv.value.currency === "EUR"){ 
                    newBalance = {"balance_USD.balance_requested": -amountReqOld, "balance_EUR.balance_requested": +inv.value.amount.amount_requested};
                }

                Bank.updateOne({"name": inv.value.bank}, {$inc: newBalance}, 
                {returnOriginal: false}, (err, bank) => {
                    if(err) return console.log(err, "Error with changing Invoice currency and amount Requested for Bank!"); 
                });
            }

            /////////////////////////////////////////////////////////////////////////////
            ////  4. If amount Sent was changed, AND currency has been changed  ////////
            ///////////////////////////////////////////////////////////////////////////
            if (chnagedAmountSent && currecyChanged && !changedBank) {
                var newBalance = {};
                if (inv.value.currency === "USD"){ 
                    newBalance = {"balance_EUR.balance_sent": -amountSentOld, "balance_USD.balance_sent": +inv.value.amount.amount_sent};

                } else  if (inv.value.currency === "EUR"){ 
                    newBalance = {"balance_USD.balance_sent": -amountSentOld, "balance_EUR.balance_sent": +inv.value.amount.amount_sent};
                }

                Bank.updateOne({"name": inv.value.bank}, {$inc: newBalance}, 
                {returnOriginal: false}, (err, bank) => {
                    if(err) return console.log(err, "Error with changing Invoice currency and amount Sent for Bank!"); 
                });
            }

            //////////////////////////////////////////////
            ////  5. If ONLY amount Sent was changed  ///
            ////////////////////////////////////////////
            if (chnagedAmountSent && !currecyChanged && !chnagedAmountReq && !changedBank) {
                var newBalance = {};
                var finalySum = amountSentOld - +(inv.value.amount.amount_sent);
                if (inv.value.currency === "USD"){
                    newBalance = {"balance_USD.balance_sent": -finalySum};
                } else if (inv.value.currency === "EUR") {
                    newBalance = {"balance_EUR.balance_sent": -finalySum};
                }

                Bank.updateOne({"name": inv.value.bank}, {$inc: newBalance}, 
                {returnOriginal: false}, (err, bank) => {
                    if(err) return console.log(err, "Error with changing Invoice amount Sent for Bank!"); 
                });
            }

            ///////////////////////////////////////////////////
            ////  6. If ONLY amount Requested was changed  ///
            /////////////////////////////////////////////////
            if (chnagedAmountReq && !chnagedAmountSent && !currecyChanged && !changedBank) {
                var newBalance = {};
                var finalySum = amountReqOld - +(inv.value.amount.amount_requested);
                if (inv.value.currency === "USD"){
                    newBalance = {"balance_USD.balance_requested": -finalySum};
                } else if (inv.value.currency === "EUR") {
                    newBalance = {"balance_EUR.balance_requested": -finalySum};
                }

                Bank.updateOne({"name": inv.value.bank}, {$inc: newBalance}, 
                {returnOriginal: false}, (err, bank) => {
                    if(err) return console.log(err, "Error with changing Invoice amount Requested for Bank!"); 
                });
            }

            ///////////////////////////////////////
            ////  7. If ONLY Bank was changed  ///
            /////////////////////////////////////
            if (changedBank && !chnagedAmountReq && !chnagedAmountSent && !currecyChanged) {
                var oldBalance = {};
                var newBalance = {};

                // If Status Requested
                if (inv.value.status === "Requested") {
                    if (inv.value.currency === "USD") {
                        oldBalance = {"balance_USD.balance_requested": -inv.value.amount.amount_requested};
                        newBalance = {"balance_USD.balance_requested": +inv.value.amount.amount_requested};
                    } 
                    if (inv.value.currency === "EUR") {
                        oldBalance = {"balance_EUR.balance_requested": -inv.value.amount.amount_requested};
                        newBalance = {"balance_EUR.balance_requested": +inv.value.amount.amount_requested}
                    }
                }

                // If Status Sent
                if (inv.value.status === "Sent") {
                    if (inv.value.currency === "USD") {
                        oldBalance = {"balance_USD.balance_sent": -inv.value.amount.amount_sent};
                        newBalance = {"balance_USD.balance_sent": +inv.value.amount.amount_sent};
                    } 
                    if (inv.value.currency === "EUR") {
                        oldBalance = {"balance_EUR.balance_sent": -inv.value.amount.amount_sent};
                        newBalance = {"balance_EUR.balance_sent": +inv.value.amount.amount_sent};
                    }
                }

                Bank.updateOne({"name": oldBank}, {$inc: oldBalance}, 
                {returnOriginal: false}, (err, Oldbank) => {
                    if(err) return console.log(err, "Error with changing old Bank in Invoice!"); 
                });

                Bank.updateOne({"name": inv.value.bank}, {$inc: newBalance}, 
                {returnOriginal: false}, (err, newBank) => {
                    if(err) return console.log(err, "Error with changing new Bank in Invoice!"); 
                });
            }

            ////////////////////////////////////////////////////////////////////////////////
            ////  8. If Bank, Currency and Amount Requested or Amount Sent was changed  ///
            //////////////////////////////////////////////////////////////////////////////
            if (changedBank && currecyChanged && chnagedAmountReq || changedBank && currecyChanged && chnagedAmountSent) {
                var oldBalance = {};
                var newBalance = {};

                // If Status Requested
                if (inv.value.status === "Requested") {
                    if (inv.value.currency === "USD") {
                        oldBalance = {"balance_EUR.balance_requested": -amountReqOld};
                        newBalance = {"balance_USD.balance_requested": +inv.value.amount.amount_requested};
                    }
                    if (inv.value.currency === "EUR") {
                        oldBalance = {"balance_USD.balance_requested": -amountReqOld};
                        newBalance = {"balance_EUR.balance_requested": +inv.value.amount.amount_requested};
                    }
                }

                // If Status Sent
                if (inv.value.status === "Sent") {
                    if (inv.value.currency === "USD") {
                        oldBalance = {"balance_EUR.balance_sent": -amountSentOld};
                        newBalance = {"balance_USD.balance_sent": +inv.value.amount.amount_sent};
                    }
                    if (inv.value.currency === "EUR") {
                        oldBalance = {"balance_USD.balance_sent": -amountSentOld};
                        newBalance = {"balance_EUR.balance_sent": +inv.value.amount.amount_sent};
                    }
                }
                
                Bank.updateOne({"name": oldBank}, {$inc: oldBalance}, {returnOriginal: false}, (err, oldBank) => {
                    if(err) return console.log(err, "Error with changing old Bank at Invoice! Changing all!"); 
                });

                Bank.updateOne({"name": inv.value.bank}, {$inc: newBalance}, {returnOriginal: false}, (err, newBank) => {
                    if(err) return console.log(err, "Error with changing new Bank at Invoice! Changing all!"); 
                });
            }

            ////////////////////////////////////////////////
            ////  9. If Bank and Currency  was changed  ///
            //////////////////////////////////////////////
            if (changedBank && currecyChanged && !chnagedAmountReq && !chnagedAmountSent) {
                var oldBalance = {};
                var newBalance = {};

                // If Status Requested
                if (inv.value.status === "Requested") {
                    if (inv.value.currency === "USD") {
                        oldBalance = {"balance_EUR.balance_requested": -inv.value.amount.amount_requested};
                        newBalance = {"balance_USD.balance_requested": +inv.value.amount.amount_requested};
                    }
                    if (inv.value.currency === "EUR") {
                        oldBalance = {"balance_USD.balance_requested": -inv.value.amount.amount_requested};
                        newBalance = {"balance_EUR.balance_requested": +inv.value.amount.amount_requested};
                    }
                }

                 // If Status Sent
                 if (inv.value.status === "Sent") {
                    if (inv.value.currency === "USD") {
                        oldBalance = {"balance_EUR.balance_sent": -inv.value.amount.amount_sent};
                        newBalance = {"balance_USD.balance_sent": +inv.value.amount.amount_sent};
                    }
                    if (inv.value.currency === "EUR") {
                        oldBalance = {"balance_USD.balance_sent": -inv.value.amount.amount_sent};
                        newBalance = {"balance_EUR.balance_sent": +inv.value.amount.amount_sent};
                    }
                }

                Bank.updateOne({"name": oldBank}, {$inc: oldBalance}, {returnOriginal: false}, (err, oldBank) => {
                    if(err) return console.log(err, "Error with changing new old Bank at Invoice! Changing Bank and Currency!"); 
                });

                Bank.updateOne({"name": inv.value.bank}, {$inc: newBalance}, {returnOriginal: false}, (err, newBank) => {
                    if(err) return console.log(err, "Error with changing new Bank at Invoice! Changing Bank and Currency!"); 
                });
            }

            ////////////////////////////////////////////////////////////////
            ////  10. If Bank and Amount Sent or Requested was changed  ///
            //////////////////////////////////////////////////////////////
            if (chnagedAmountReq && changedBank && !currecyChanged || 
                chnagedAmountSent && changedBank && !currecyChanged) {
                var oldBalance = {};
                var newBalance = {};

                // If Status Requested
                if (inv.value.status === "Requested") {
                    if (inv.value.currency === "USD") {
                        oldBalance = {"balance_USD.balance_requested": -amountReqOld};
                        newBalance = {"balance_USD.balance_requested": +inv.value.amount.amount_requested};
                    }
                    if (inv.value.currency === "EUR") {
                        oldBalance = {"balance_EUR.balance_requested": -amountReqOld};
                        newBalance = {"balance_EUR.balance_requested": +inv.value.amount.amount_requested};
                    }
                }

                // If Status Sent
                if (inv.value.status === "Sent") {
                    if (inv.value.currency === "USD") {
                        oldBalance = {"balance_USD.balance_sent": -amountSentOld};
                        newBalance = {"balance_USD.balance_sent": +inv.value.amount.amount_sent};
                    }
                    if (inv.value.currency === "EUR") {
                        oldBalance = {"balance_EUR.balance_sent": -amountSentOld};
                        newBalance = {"balance_EUR.balance_sent": +inv.value.amount.amount_sent};
                    }
                }

                Bank.updateOne({"name": oldBank}, {$inc: oldBalance}, {returnOriginal: false}, (err, oldBank) => {
                    if(err) return console.log(err, "Error with changing new old Bank at Invoice! Changing Bank and Currency!"); 
                });

                Bank.updateOne({"name": inv.value.bank}, {$inc: newBalance}, {returnOriginal: false}, (err, newBank) => {
                    if(err) return console.log(err, "Error with changing new Bank at Invoice! Changing Bank and Currency!"); 
                });
            }

            res.send("Invoice has been edited successfully!");
       });
    });
});


// Init Multer for uploading files into MongoDB and Server
const upload = multer({dest:"uploads"});

// @route POST /upload
// @desc Uploads file to DB
router.post("/upload", upload.single("file"), jsonParser, (req, res) => {

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

            var comment = {"comments": {
                "created_by": req.body.creator, 
                "creation_date": new Date(), 
                "message": `Invoice #${number}. ${type} was Uploaded!`
            }};

            Object.assign(obj, comment);
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
            if (err) return res.sendStatus(404);
            res.contentType(type);
            res.send(data);
        });
    }
};


// @route GET /upload/:filename 
// @desc Open file from PATH /upload
router.get("/upload/:filename", (req, res) => {
    const filename = req.params.filename;
    var filePath = `/../uploads/${filename}`;

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
router.post("/changeDocStatus", jsonParser, (req, res) => {
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
            const createdBy = req.body.createdBy;

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
                    },
                    {
                        // Add new Comment
                        updateOne: {
                            "filter": {"number": number},
                            "update": {"$push": {"comments": {"created_by": createdBy, "creation_date": new Date(), "message": `Invoice #${number}. ${type} was ${status}!` } }},
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


// @route POST /sentStatus
// @desc Change all data to sent
router.post("/sentStatus", jsonParser, (req, res) => {
    const invNumber = req.body.invNumber;
    const amountSent = req.body.amountSent;
    const currency = req.body.currency;
    const creator = req.body.creator;
    mongo.connect(url, (err, db) => {
        if (err) return console.log(err, "Can't connect to database!");
        db.collection("invoices").findOneAndUpdate({"number": invNumber}, {
            $set: {
                "status":"Sent", 
                "dates.sent_date": new Date(), 
                "amount.amount_sent": amountSent
        }, $push: {comments: { 
                "created_by": creator, 
                "creation_date": new Date(), 
                "message": `Invoice #${invNumber}. Transfer for ${currency}${amountSent} was Sent!` 

        }}}, {returnOriginal: false}, (err, inv) => {
            if(err) return console.log(err, "Error with change status to Sent!");
            const bankName = inv.value.bank;
            const reqAmount = inv.value.amount.amount_requested;

            // Check currency of Invoice
            var obj = {"balance_EUR.balance_sent": amountSent, "balance_EUR.balance_requested": -reqAmount};
            if(inv.value.currency === "USD"){
                obj = {"balance_USD.balance_sent": amountSent, "balance_USD.balance_requested": -reqAmount};
            }
            
            mongo.connect(url, (err, db) => {
                if (err) return console.log(err, "Can't connect to database!");
                db.collection("banks").updateOne({"name": bankName}, {$inc: obj}, 
                {returnOriginal: false}, (err, result) => {
                    if(err) return console.log(err, "Error with change balance at Bank!");
                    res.send("Sent status has been set successfully!");
                });
            });

        });
    });
});


// @route POST /requestStatus
// @desc Change all data to requested
router.post("/requestStatus", jsonParser, (req, res) => {
    var invoiceNum = req.body.invoiceNum;
    var sentAmount = req.body.sentAmount;
    var currency = req.body.currency;
    var amountRequested = req.body.amountRequested;
    var creator = req.body.creator;
    
    mongo.connect(url, (err, db) => {
        if (err) return console.log(err, "Can't connect to database!");
        db.collection("invoices").findOneAndUpdate({"number": invoiceNum}, {
            $set: {
                "status": "Requested", 
                "dates.sent_date": null, 
                "amount.amount_sent": 0 
                },
                $push: {comments: { 
                    "created_by": creator, 
                    "creation_date": new Date(), 
                    "message": `Invoice #${invoiceNum}. Transfer for ${currency}${amountRequested} was Requested!` 
        
                }}}, {returnOriginal: false}, (err, result) => {
            if(err) return console.log(err, "Error with change status to Requested!");
            var bankName = result.value.bank;

            // Check if Invoice currency USD
            var obj = {"balance_EUR.balance_sent": -sentAmount, "balance_EUR.balance_requested": +amountRequested};
            if(result.value.currency === "USD"){
                obj = {"balance_USD.balance_sent": -sentAmount, "balance_USD.balance_requested": +amountRequested};
            }

            mongo.connect(url, (err, db) => {
                if (err) return console.log(err, "Can't connect to database!");

                db.collection("banks").findOneAndUpdate({"name": bankName}, {$inc: obj}, 
                {returnOriginal: false}, (err, bank) => {
                    if(err) return console.log(err, "Error with change bank balance!");
                    res.send("Requested status has been set successfully!");
                });
            });

        });
    });
});


// @route POST /receivedStatus
// @desc Change all data to received
router.post("/receivedStatus", jsonParser, (req, res) => {
    var invNumber = req.body.invNumber;
    var typedAmount = +(req.body.typedAmount);
    var createdBy = req.body.createdBy;
    var amountCommission = req.body.amountCommission;
    var percentCommission = req.body.percentCommission;
    var currency = req.body.currency;
    var symbol = "";
    currency === "USD" ? symbol = "$" : symbol =  "€";

    // Change Invoice status, amounts and date
    mongo.connect(url, (err, db) => {
        if (err) return console.log(err, "Can't connect to database!");
        db.collection("invoices").findOneAndUpdate({"number": invNumber}, {$set: {
            "status": "Received", 
            "amount.amount_received": typedAmount, 
            "dates.received_date": new Date()
        }, $push: {comments: { 
            "created_by": createdBy, 
            "creation_date": new Date(), 
            "message": `Invoice #${invNumber}. Transfer for ${symbol}${typedAmount} was Received!` 

        }}},{returnOriginal: false}, (err, inv) => {
            if(err) return console.log(err, "Error with change invoice to received status!");
            var bankName = inv.value.bank;
            var amountSent = +(inv.value.amount.amount_sent);

            // Check if Invoice currency USD
            var obj = {"balance_EUR.balance_received": typedAmount, "balance_EUR.balance_sent": -amountSent};
            if(currency === "USD"){
                obj = {"balance_USD.balance_received": typedAmount, "balance_USD.balance_sent": -amountSent};
            }

            // Change Bank Balance
            mongo.connect(url, (err, db) => {
                if (err) return console.log(err, "Can't connect to database!");
                db.collection("banks").findOneAndUpdate({"name": bankName}, {$inc: obj },
                {returnOriginal: false}, (err, bank) => {
                    if(err) return console.log(err, "Error with change bank received details!");

                    // Inserted new commission
                    mongo.connect(url, (err, db) => {
                        if (err) return console.log(err, "Can't connect to database!");
                        var newComment = {
                            "created_by": createdBy,
                            "amount": amountCommission,
                            "currency": inv.value.currency,
                            "type": "Incoming Bank Commission",
                            "percentage": percentCommission,
                            "creation_date": new Date(),
                            "bank": bankName,
                            "merchant": inv.value.merchant
                        };
                        db.collection("commissions").insertOne(newComment, (err) => {
                            if(err) return console.log(err, "Error with add commission!");
                            var commissionId = new objectId(newComment._id);

                            // Insert Commission ID into Invoice 
                            mongo.connect(url, (err, db) => {
                                if (err) return console.log(err, "Can't connect to database!");
                                db.collection("invoices").updateOne({"number": invNumber}, {$push:{"commissions": commissionId}}, 
                                {returnOriginal:false}, (err, result) => {
                                    if(err) return console.log(err, "Error with pushing commission to Invoice!");

                                    // Check if Invoice currency
                                    var objMerch = {"balance_EUR.balance_received": typedAmount};
                                    if(currency === "USD"){
                                        objMerch = {"balance_USD.balance_received": typedAmount};
                                    }
                                    
                                    Merchant.updateOne({"name": inv.value.merchant}, {$inc: objMerch}, 
                                    {returnOriginal: false}, (err, merch) => {

                                        res.send("Received status has been set successfully!")
                                    });
                                });
                            });
                        });
                    });

                });
            });
        });
    });
}); 


// @route POST /approvedStatus
// @desc Change all data to approved
router.post("/approvedStatus", jsonParser, (req, res) => {
    const invNumber = req.body.invNumber;
    const createBy = req.body.createBy;
    const amountApproved = +req.body.amountApproved;

    // || 1.Change Invoice info to Approved ||
    Invoice.findOneAndUpdate({"number": invNumber}, {$set:{
        "status": "Approved", 
        "dates.approved_date": new Date(), 
        "amount.amount_approved": +amountApproved,
    }, $push: {comments: { 
        "created_by": createBy, 
        "creation_date": new Date(), 
        "message": `Invoice #${invNumber}. Transfer for ${req.body.currency}${amountApproved} was Approved!` 
    }}}, 
    {returnOriginal: false}, (err, inv) => {
        if(err) return console.log(err, "Error with changing Invoice to Approved!");
        //  || 2. Change Bank Balance for Approved ||
        var merchantName = inv.merchant;
        var amountReceived = +inv.amount.amount_received;

        // Check if Invoice currency USD
        var obj = {"balance_EUR.balance_approved": amountApproved, "balance_EUR.balance_received": -amountReceived};
        if(inv.currency === "USD"){
            obj = {"balance_USD.balance_approved": amountApproved, "balance_USD.balance_received": -amountReceived};
        }

        Merchant.updateOne({"name": merchantName}, {$inc: obj}, {returnOriginal: false}, async (err, bank) => {
            if(err) return console.log(err, "Error with changing Merhcnant to Balance to Approved!");

            //  || 3. Add new Commission to collection ||
            const comm = new Commission({
                // AnyWires Commission
                    "created_by": createBy,
                    "amount": +req.body.totalAny,
                    "currency": inv.currency,
                    "type": "Anywires commission",
                    "percentage": +req.body.anywiresPercent,
                    "flat": +req.body.anyFeeFlat,
                    "additional": +req.body.AdditionaFee,
                    "creation_date": new Date(),
                    "bank": inv.bank,
                    "merchant": merchantName
                });
            try {
                await comm.save();
                var commId1 = new objectId(comm._id);
            } catch (error) {
                console.log("Err with first commission!", err);
            }
            
            const comm2 = new Commission({
                // Solution Commission
                    "created_by": createBy,
                    "amount": +req.body.totalSolution,
                    "currency": inv.currency,
                    "type": "Incoming solution commission",
                    "percentage": +req.body.solutionPercent,
                    "flat": +req.body.solutionFlat,
                    "additional": 0,
                    "creation_date": new Date(),
                    "bank_commision": +req.body.bankCommission,
                    "left_from_transfer": +req.body.leftFromTransfer,
                    "bank": inv.bank,
                    "merchant": merchantName
            });
            try {
                await comm2.save();
                var commId2 = new objectId(comm2._id);
            } catch (error) {
                console.log("Error with second commission!", err);
            }

            // || 4. Add new CommissionID to Invoice ||
            Invoice.updateOne({"number": invNumber}, {$push: {"commissions":{$each: [commId1, commId2]} }}, 
            {returnOriginal: false}, (err, result) => {
                if(err) return console.log("Err with pushing commissions to invoice");
                res.send("Approved status has been set successfully!")
            });
            
        });
    });
});


// @route POST /availableStatus
// @desc Change all data to Available
router.post("/availableStatus", jsonParser, (req, res) => {
    const invNumber = req.body.invNumber;
    const amountAvailable = req.body.amountAvailable;
    const currency = req.body.currency;
    const createBy = req.body.createBy;

    Invoice.findOneAndUpdate({"number": invNumber}, {$set: {
        "status": "Available", 
        "dates.available_date": new Date(), 
        "amount.amount_available": amountAvailable
    }, $push: {"comments": { 
        "created_by": createBy, 
        "creation_date": new Date(), 
        "message": `Invoice #${invNumber}. Transfer for ${currency}${amountAvailable} was Available!` 

    }}}, {returnOriginal: false}, (err, inv) => {
        if(err) return console.log("Err with changing Invoice to Available!");
        const amountApproved = inv.amount.amount_approved;

        // Check if Invoice currency USD
        var obj = {"balance_EUR.balance_available": +amountAvailable, "balance_EUR.balance_approved": -amountApproved};
        if(inv.currency === "USD"){
            obj = {"balance_USD.balance_available": +amountAvailable, "balance_USD.balance_approved": -amountApproved};
        }

        Merchant.updateOne({"name": inv.merchant}, {$inc: obj}, {returnOriginal: false}, (err, result) => {
            if(err) return console.log("Err with changing Merchant Balance to Available!");
            res.send("Available status has been set successfully!")
        });
    });
});


// @route POST /declinedStatus
// @desc Change all data to Declined
router.post("/declinedStatus", jsonParser, (req, res) => {
    const invNumber = req.body.invNumber;
    const amountDeclined = req.body.amountDeclined;
    const currency = req.body.currency;
    const createdBy = req.body.createdBy;
    const oldInvStatus = req.body.oldInvStatus;
    

    // Request for chnaging Invoice to Declined
    Invoice.findOneAndUpdate({"number": invNumber}, {
        $set: {
            "status": "Declined",
            "dates.declined_date": new Date()
        },
        $push: {
            "comments": {
                "created_by": createdBy, 
                "creation_date": new Date(), 
                "message": `Invoice #${invNumber}. Transfer for ${currency}${amountDeclined} was Declined!` 
            }
        }
    }, {returnOriginal: false}, (err, inv) => {
        if(err) return console.log("Error with changing Invoice to Declined!");

        // Checking Invoice Status to know wich balance from Bank we need to remove
        var invCurrency = `balance_${inv.currency.toUpperCase()}`;
        var invAmount = `balance_${oldInvStatus.toLowerCase()}`;
        var result = `${invCurrency}.${invAmount}`;
        var obj = {};
        obj[result] = -amountDeclined;

        // Request for chnaging Bank Balance 
        Bank.updateOne({"name": inv.bank}, {$inc: obj}, 
        {returnOriginal: false}, (err, bank) => {
            if(err) return console.log("Error with changing Bank Balance to Declined!");
            res.send("Declined status has been set successfully!");
        });
    });
});


// @route POST /settledStatus
// @desc Change all data to Settled
router.post("/settledStatus", jsonParser, (req, res) => {
    const invNumber = req.body.invNumber;
    const createdBy = req.body.createdBy;
    const currencySymbol = req.body.currencySymbol;
    const amountSettled = req.body.amountSettled;

    // Change Invoice date to Settled
    Invoice.findOneAndUpdate({"number": invNumber}, {
        $set: {
            "status": "Settled", 
            "settleSelectedStatus": true, 
            "dates.settled_date": new Date()
        },
        $push: {"comments": {
            "created_by": createdBy, 
            "creation_date": new Date(), 
            "message": `Invoice #${invNumber}. Transfer for ${currencySymbol}${amountSettled} was Settled!`
        }}
    }, 
    {returnOriginal: false}, (err, inv) => {
        if(err) return console.log("Error with changing Invoice data to Settled!");
        const oldInvStatus = req.body.oldInvStatus;
        var invCurrency = `balance_${inv.currency.toUpperCase()}`;
        var invAmount = `balance_${oldInvStatus.toLowerCase()}`;
        var result = `${invCurrency}.${invAmount}`;
        var obj = {};
        obj[result] = -amountSettled;

        Bank.updateOne({"name": inv.bank}, {$inc: obj}, {returnOriginal: false}, (err, bank) => {
            if(err) return console.log("Error with changing Bank data to Settled!");
            res.send("Settled status has been set successfully!");
        });
    });
    
});


// @route POST /frozenStatus
// @desc Change all data to Frozen
router.post("/frozenStatus", jsonParser, (req, res) => {
    const invNumber = req.body.invNumber;
    const invStatus = req.body.invStatus;
    const createdBy = req.body.createdBy;
    const currencySymbol = req.body.currencySymbol;
    const amountFrozen = req.body.amountFrozen;
    const amountReceived = req.body.amountReceived;

    // 1. Change Invoice to Frozen
    Invoice.findOneAndUpdate({"number": invNumber}, {
        $set: {
            "status": "Frozen",
            "dates.frozen_date": new Date(), 
            "before_freeze": invStatus
        },
        $push: { 
            "comments": {
                "created_by": createdBy, 
                "creation_date": new Date(), 
                "message": `Invoice #${invNumber}. Transfer for ${currencySymbol}${amountFrozen} was Frozen!`
            }
        }}, {returnOriginal: false}, (err, inv) => {
            if(err) return console.log("Error with changing Invoice data to Frozen!", err);

            // Check if Invoice currency USD
            var objBank = {"balance_EUR.balance_frozen": +amountReceived, "balance_EUR.balance_received": -amountReceived};
            if(inv.currency === "USD"){
                objBank = {"balance_USD.balance_frozen": +amountReceived, "balance_USD.balance_received": -amountReceived};
            }

            // 2. Change Bank balance to Frozen
            Bank.updateOne({"name": inv.bank}, {$inc: objBank}, {returnOriginal: false}, (err, bank) => {
                if(err) return console.log("Error with changing bank balance to Frozen!", err);

                // Check if Invoice currency USD
                var invCurrency = `balance_${inv.currency.toUpperCase()}`;
                var invAmount = `balance_${invStatus.toLowerCase()}`;
                var result = `${invCurrency}.${invAmount}`;

                var objMerch = {"balance_EUR.balance_frozen": +amountFrozen};
                if(inv.currency === "USD"){
                    objMerch = {"balance_USD.balance_frozen": +amountFrozen};
                }
                objMerch[result] = -amountFrozen;

                // 3. Change Merchant balance to Frozen
                Merchant.updateOne({"name": inv.merchant}, {$inc: objMerch}, {returnOriginal: false}, (err, merch) => {
                    if(err) return console.log("Error with changing merchant balance to Frozen!");
                    res.send("Frozen status has been set successfully!");
                });

            });
    });
});


// @route POST /unfrozenStatus
// @desc Change all data to Unfrozen
router.post("/unfrozenStatus", jsonParser, (req, res) => {
    const invNumber = req.body.invNumber;
    const createdBy = req.body.createdBy;
    const currencySymbol = req.body.currencySymbol;
    const amountUnfrozen = req.body.amountUnfrozen;
    const beforeFreezeStatus = req.body.beforeFreezeStatus;
    const amountReceived = req.body.amountReceived;
    
    // 1. Change Invoice to Unfrozen
    Invoice.findOneAndUpdate({"number": invNumber}, {
        $set: {
            "status": beforeFreezeStatus,
            "dates.unfrozen_date": new Date(), 
            "before_freeze": "Unfrozen"
        },
        $push: {
            "comments":{
                "created_by": createdBy, 
                "creation_date": new Date(), 
                "message": `Invoice #${invNumber}. Transfer for ${currencySymbol}${amountUnfrozen} was Unfrozen!`
            }
        }
    }, 
    {returnOriginal: false}, (err, inv) => {
        if(err) return console.log("Error with changing Invoice data to Unfrozen!", err);

        // Check if Invoice currency USD
        var objBank = {"balance_EUR.balance_frozen": -amountReceived, "balance_EUR.balance_received": +amountReceived};
        if(inv.currency === "USD"){
            objBank = {"balance_USD.balance_frozen": -amountReceived, "balance_USD.balance_received": +amountReceived};
        }

        // 2. Change Bank balance to Unfrozen
        Bank.updateOne({"name": inv.bank}, {$inc: objBank}, 
        {returnOriginal: false}, (err, bank) => {
            if(err) return console.log("Error with changing bank balance to Unfrozen!", err);

            // Check if Invoice currency USD
            var invCurrency = `balance_${inv.currency.toUpperCase()}`;
            var invAmount = `balance_${beforeFreezeStatus.toLowerCase()}`;
            var result = `${invCurrency}.${invAmount}`;

            var objMerch = {"balance_EUR.balance_frozen": -amountUnfrozen};
            if(inv.currency === "USD"){
                objMerch = {"balance_USD.balance_frozen": -amountUnfrozen};
            }
            objMerch[result] = +amountUnfrozen;

            // 3. Change Merchant balance to Unfrozen
            Merchant.updateOne({"name": inv.merchant}, {$inc: objMerch}, 
            {returnOriginal: false}, (err, merch) => {
                if(err) return console.log("Error with changing merchant balance to Unfrozen!");
                res.send("Unfrozen status has been set successfully!");
            });
        });
    });
});


// @route POST /recallStatus
// @desc Change all Invoice Bank and Merchant data to Recall
router.post("/recallStatus", jsonParser, (req, res) => {
    const invNumber = req.body.invNumber;
    const createdBy = req.body.createdBy;
    const currencySymbol = req.body.currencySymbol;
    const amountRecall = req.body.amountRecall;
    const amountReceived = req.body.amountReceived;
    const beforeRecallStatus = req.body.beforeRecallStatus; 

    // 1. Change Invoice to Recall
    Invoice.findOneAndUpdate({"number": invNumber}, {
        $set: {
            "status": "Recall",
            "dates.recall_date": new Date()
        },
        $push: {
            "comments":{
                "created_by": createdBy, 
                "creation_date": new Date(), 
                "message": `Invoice #${invNumber}. Transfer for ${currencySymbol}${amountRecall} was Recall!`
            }
        }
    }, 
    {returnOriginal: false}, (err, inv) => {
        if(err) return console.log("Error with changing Invoice data to Recall!", err);

        // Check if Invoice currency USD
        var invCurrency = `balance_${inv.currency.toUpperCase()}`;
        var invAmount = `balance_${beforeRecallStatus.toLowerCase()}`;
        var result = `${invCurrency}.${invAmount}`;

        var objMerch = {};
        objMerch[result] = -amountRecall;

        var total = req.body.totalComm;
        var merchAvailable = `${invCurrency}.balance_available`;
        objMerch[merchAvailable] = -req.body.totalComm;

        // 3. Change Merchant balance to Recall
        Merchant.findOneAndUpdate({"name": inv.merchant}, {$inc: objMerch}, 
        {returnOriginal: false}, (err, merch) => {
            if(err) return console.log("Error with changing merchant balance to Recall!");

            // 4. Change Bank balance to Recall "remove invoice cuurent amount"
            var objBank = {};
            var bankAmount = `${invCurrency}.balance_received`;
            objBank[bankAmount] = -amountReceived;
            
            Bank.updateOne({"name": inv.bank}, {$inc: objBank}, 
            {returnOriginal: false}, (err, bank) => {
                if(err) return console.log("Error with changing bank balance to Recall!", err);

                // 5. Add new Commission to DB
                var percentCommission = (100*total)/amountReceived;
                var newComm = {
                    "created_by": createdBy,
                    "amount": total,
                    "currency": inv.currency,
                    "type": "Recall Commission",
                    "percentage": percentCommission,
                    "creation_date": new Date()
                };

                Commission.create(newComm, (err, comm) => {
                    if(err) return console.log(err, "Error with insert commission, Recall!");
                    var commissionId = new objectId(comm._id);

                    // 6. Pushing new Commission to Invoice
                    Invoice.updateOne({"number": invNumber}, {$push:{"commissions": commissionId}}, 
                    {returnOriginal: false}, (err, result) => {
                        if(err) return console.log(err, "Error with pushing new commission to Invoice, Recall!");
                        res.send("Recall status has been set successfully!");
                    });
                });
            });
        });
    });

});


//////////////////////////////
//                          //
// Invoice Preview Proccess //
//                          //
//////////////////////////////

router.post("/get-invoiceByNumber", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) => {

        db.collection("invoices").find({number: req.body.number}).toArray(function(err, invoice){
            if(err) return console.log("Error with upload Invoice Preview!", err);
            db.close();
            res.send(invoice);
        });
    });
});

router.post("/get-bankByName", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{

        db.collection("banks").find({name: req.body.name}).toArray(function(err, bank){
            if(err) return console.log("Error with upload Bank!", err);
            db.close();
            res.send(bank);
        });
    });
});

router.post("/get-merchantByName", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{

        db.collection("merchants").find({name: req.body.name}).toArray(function(err, merchant){
            if(err) return console.log("Error with upload Invoice Merchant!", err);
            db.close();
            res.send(merchant);
        });
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