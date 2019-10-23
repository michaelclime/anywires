const express = require('express'),
    router = new express.Router(),
    mongo = require('mongodb'),
    jsonParser = express.json(),
    multer = require("multer");
 
const url = 'mongodb://18.216.223.81:27017/anywires';

router.get('/invoice-list.html', isLoggedIn, function(req, res) {
    res.render("invoice-list.html");
});

router.get('/invoice-report.html', isLoggedIn, function(req, res) {
    res.render("invoice-report.html");
});

router.get("/invoice-preview", isLoggedIn, function (req, res) {
    res.render("invoice-preview.html");
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


// @route POST /sentStatus
// @desc Change all data to sent
router.post("/sentStatus", jsonParser, (req, res) => {
    const invNumber = req.body.invNumber;
    const amountSent = req.body.amountSent;
    mongo.connect(url, (err, db) => {
        if (err) return console.log(err, "Can't connect to database!");
        db.collection("invoices").findOneAndUpdate({"number": invNumber}, {$set: {"status":"Sent", "dates.sent_date": new Date(), "amount.amount_sent": amountSent} }, 
        {returnOriginal: false}, (err, inv) => {
            if(err) return console.log(err, "Error with change status to Sent!");
            const bankName = inv.value.bank;
            
            mongo.connect(url, (err, db) => {
                if (err) return console.log(err, "Can't connect to database!");
                db.collection("banks").updateOne({"name": bankName}, {$inc: {"balance_sent": amountSent, "balance_requested": -amountSent} }, 
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
    var reqAmount = '';
    var bankName = '';
    mongo.connect(url, (err, db) => {
        if (err) return console.log(err, "Can't connect to database!");
        db.collection("invoices").findOneAndUpdate({"number": invoiceNum}, {
            $set: {
                "status":"Requested", 
                "dates.sent_date": "", 
                "amount.amount_sent": 0 
                }
            }, {returnOriginal: false}, (err, result) => {
            if(err) return console.log(err, "Error with change status to Requested!");
            reqAmount = result.value.amount.amount_requested;
            bankName = result.value.bank;

            mongo.connect(url, (err, db) => {
                if (err) return console.log(err, "Can't connect to database!");
                db.collection("banks").findOneAndUpdate({"name": bankName}, {
                    $inc: {
                        "balance_sent": -reqAmount, 
                        "balance_requested": reqAmount
                    }
                }, {returnOriginal: false}, (err, bank) => {
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
    var amountAfter = +(req.body.amountAfter);
    var createdBy = req.body.createdBy;

    // Change Invoice status, amounts and date
    mongo.connect(url, (err, db) => {
        if (err) return console.log(err, "Can't connect to database!");
        db.collection("invoices").findOneAndUpdate({"number": invNumber}, {$set: {
            "status": "Received", 
            "amount.amount_received": typedAmount, 
            "dates.received_date": new Date(),
            "amount.received_after_commision": amountAfter
        }}, {returnOriginal: false}, (err, inv) => {
            if(err) return console.log(err, "Error with change invoice to received status!");
            var bankName = inv.value.bank;
            var amountSent = +(inv.value.amount.amount_sent);

            // Change Bank Balance and take some value from Bank
            mongo.connect(url, (err, db) => {
                if (err) return console.log(err, "Can't connect to database!");
                db.collection("banks").findOneAndUpdate({"name": bankName}, {$inc: {
                    "balance_received": typedAmount, 
                    "balance_sent": -amountSent}},
                {returnOriginal: false}, (err, bank) => {
                    if(err) return console.log(err, "Error with change bank received details!");
                    var bankCommission = bank.value.incoming_fee;

                    // Inserted new commission
                    mongo.connect(url, (err, db) => {
                        if (err) return console.log(err, "Can't connect to database!");
                        var amountCommission = +(typedAmount - amountAfter);
                        var newComment = {
                            "created_by": createdBy,
                            "amount": amountCommission,
                            "type": "Incoming Solution Commission",
                            "percentage": bankCommission
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


//////////////////////////////
//                          //
// Invoice Preview Proccess //
//                          //
//////////////////////////////

router.post("/get-invoiceByNumber", jsonParser, (req, res) => {
    mongo.connect(url, (err, db) =>{

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