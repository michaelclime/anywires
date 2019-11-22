// import { threadId } from "worker_threads";

class CreateMerchant{
    constructor(){
        this.merchName = "";
        this.currentMerchant = "";
        this.loadingGIF = document.querySelector("#loadingGif");
        this.buttonCreate = document.querySelector("#create_merch");
        this.b2bInput = document.querySelector("#b2b");
        this.currentUser = document.querySelector(".userName");
        this.render();
    }

    getListOfAffilliate = async () => {
        const Affilliate = await this.getListOfAffilliateReq({"role":"Affiliate"});
        const container = document.querySelector("#affiliate");
        Affilliate.forEach( aff => {
            const option = document.createElement("option");
            option.value = aff.email;
            option.innerHTML = `${aff.username} '${aff.email}'`;
            container.appendChild(option);
        });
    }

    getListOfAffilliateReq = async (filter) => {
        return  await fetch("http://18.216.223.81 :3000/getUserByFilter", {
            method: "POST",
            body: JSON.stringify({filter}),
            headers:{'Content-Type': 'application/json'}
        })
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
    }

    editMerchantReq = async (mechantName, newData) => {
        return  await fetch("http://18.216.223.81 :3000/getMerchants")
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
    }

    editMerchantInit = async () => {
        // Checking required fields
        var required = document.querySelectorAll(".required");
        var empty = this.checkEmpty(required);

            // If empty
        if (empty) {
            this.alertWindow("Please fill out all required fields!");

            // If all fields filled in
        } else if (!empty) {
            // Loading GIF On
            this.loadingGIF.style.display = "flex";

            // If b2b is true we need to send specifications_b2b else we need to clean fields
            var b2b = document.querySelector("#b2b");
            var bankAddress = document.querySelector("#bankAddress").value;
            var IBAN = document.querySelector("#IBAN").value;
            var SWIFT = document.querySelector("#SWIFT").value;
            var benefName = document.querySelector("#benefName").value;
            var benefAddress = document.querySelector("#benefAddress").value;
            var bankName = document.querySelector("#bankName").value;
            if (!b2b.checked) {
                bankAddress = "";
                IBAN = "";
                SWIFT = "";
                benefName = "";
                benefAddress = "";
                bankName = "";
            } 

            b2b.checked === true ? b2b = true : b2b = false;

            var editedMerch = {
                "name": document.querySelector("#merchName").value,
                "b2b": b2b,
                "fees.in_c2b.percent": +(document.querySelector("#in_c2b_per").value),
                "fees.in_c2b.flat": +(document.querySelector("#in_c2b_flat").value),

                "fees.in_b2b.percent": +(document.querySelector("#in_b2b_per").value),
                "fees.in_b2b.flat": +(document.querySelector("#in_b2b_flat").value),

                "fees.settlement_btc.percent": +(document.querySelector("#settBTC_per").value),
                "fees.settlement_btc.flat": +(document.querySelector("#settBTC_flat").value),

                "fees.settlement_atm.percent": +(document.querySelector("#settATM_per").value),
                "fees.settlement_atm.flat": +(document.querySelector("#settATM_flat").value),

                "fees.settlement_c2b_wire.percent": +(document.querySelector("#settC2Bwire_per").value),
                "fees.settlement_c2b_wire.flat": +(document.querySelector("#settC2Bwire_flat").value),

                "fees.settlement_b2b_wire.percent": +(document.querySelector("#settB2Bwire_per").value),
                "fees.settlement_b2b_wire.flat": +(document.querySelector("#settB2Bwire_flat").value),

                "fees.settlement_recall.percent": +(document.querySelector("#settRecall_per").value),
                "fees.settlement_recall.flat": +(document.querySelector("#settRecall_flat").value),

                "fees.fee_account_additional.flat": +(document.querySelector("#feeAccAdd_flat").value),

                "fees.fee_account_dedicated.flat": +(document.querySelector("#feeAccDed_flat").value),

                "fees.fee_account_mounthly.flat": +(document.querySelector("#feeAccMonthly_flat").value),

                "fees.fee_account_setup.flat": +(document.querySelector("#feeAccSetup_flat").value),

                "fees.fine_attitude_incorrect_payment_purpose.percent": +(document.querySelector("#fineAttIncPp_per").value),
                "fees.fine_attitude_incorrect_payment_purpose.flat": +(document.querySelector("#fineAttIncPp_flat").value),

                "fees.fine_attitude_more_then_1percent_recalls.percent": +(document.querySelector("#fineAttMoreThen1perRecalls_per").value),
                "fees.fine_attitude_more_then_1percent_recalls.flat": +(document.querySelector("#fineAttMoreThen1perRecalls_flat").value),

                "fees.fine_attitude_more_then_1_payment.percent": +(document.querySelector("#fineAttMoreThen1Pay_per").value),
                "fees.fine_attitude_more_then_1_payment.flat": +(document.querySelector("#fineAttMoreThen1Pay_flat").value),

                "fees.fine_attitude_payment_from_blocked.percent": +(document.querySelector("#fineAttPayFromBlo_per").value),
                "fees.fine_attitude_payment_from_blocked.flat": +(document.querySelector("#fineAttPayFromBlo_flat").value),

                "fees.fine_attitude_payment_without_invoice.percent": +(document.querySelector("#fineAttPayWithInv_per").value),
                "fees.fine_attitude_payment_without_invoice.flat": +(document.querySelector("#fineAttPayWithInv_flat").value),

                "fees.fine_attitude_wrong_amount.percent": +(document.querySelector("#fineAttWrongAm_per").value),
                "fees.fine_attitude_wrong_amount.flat": +(document.querySelector("#fineAttWrongAm_flat").value),

                "fees.fine_recall.percent": +(document.querySelector("#fineRecall_per").value),
                "fees.fine_recall.flat": +(document.querySelector("#fineRecall_flat").value),

                "fees.settlement_b2c.percent": +(document.querySelector("#settB2C_per").value),
                "fees.settlement_b2c.flat": +(document.querySelector("#settB2C_flat").value),

                "fees.settlement_refund.percent": +(document.querySelector("#settRefund_per").value),
                "fees.settlement_refund.flat": +(document.querySelector("#settRefund_flat").value),

                "specifications": {
                    "background": document.querySelector("#backColor").value,
                    "first_color": document.querySelector("#firstColor").value,
                    "second_color": document.querySelector("#secondColor").value,
                    "logo": "",
                    "tagline": document.querySelector("#tagline").value
                },
                "support_email": document.querySelector("#merchEmail").value,
                "promo_code": document.querySelector("#promoCode").value,
                "users.affiliate": document.querySelector("#affiliate").value,
                "specifications_b2b": {
                    "beneficiary_name": benefName,
                    "beneficiary_address": benefAddress,
                    "bank_name": bankName,
                    "bank_address": bankAddress,
                    "iban": IBAN,
                    "swift": SWIFT
                }
            };

            await this.editMerchantReq(this.merchName, editedMerch);
            document.location.replace("http://18.216.223.81 :3000/merchants.html");

        }
    }

    editMerchantRenderPage = async () => {
        this.currentMerchant = await this.getMerchants(0, {"name": this.merchName});

        // Merchant info render
        var b2b = document.querySelector("#b2b");
        this.currentMerchant[0].b2b === true ? b2b.checked = true : b2b.checked = false;

        var merchName = document.querySelector("#merchName").value = this.currentMerchant[0].name;
        var promoCode = document.querySelector("#promoCode").value = this.currentMerchant[0].promo_code;
        var affiliate = document.querySelector("#affiliate").value = this.currentMerchant[0].users.affiliate;
        var merchEmail = document.querySelector("#merchEmail").value = this.currentMerchant[0].support_email;
        var tagline = document.querySelector("#tagline").value = this.currentMerchant[0].specifications.tagline;
        var backColor = document.querySelector("#backColor").value = this.currentMerchant[0].specifications.background;
        var firstColor = document.querySelector("#firstColor").value = this.currentMerchant[0].specifications.first_color;
        var secondColor = document.querySelector("#secondColor").value = this.currentMerchant[0].specifications.second_color;
        if (b2b.checked === true) {
            document.querySelector(".b2b_true_block").style.display = "flex";
            var bankAddress = document.querySelector("#bankAddress").value = this.currentMerchant[0].specifications_b2b.bank_address;
            var IBAN = document.querySelector("#IBAN").value = this.currentMerchant[0].specifications_b2b.iban;
            var SWIFT = document.querySelector("#SWIFT").value = this.currentMerchant[0].specifications_b2b.swift;
            var benefName = document.querySelector("#benefName").value = this.currentMerchant[0].specifications_b2b.beneficiary_name;
            var benefAddress = document.querySelector("#benefAddress").value = this.currentMerchant[0].specifications_b2b.beneficiary_address;
            var bankName = document.querySelector("#bankName").value = this.currentMerchant[0].specifications_b2b.bank_name;
        }

        // Commissions Render
        var inc2b_per = document.querySelector("#in_c2b_per").value = this.currentMerchant[0].fees.in_c2b.percent;
        var in_c2b_flat = document.querySelector("#in_c2b_flat").value = this.currentMerchant[0].fees.in_c2b.flat;
        // 
        var inb2b_per = document.querySelector("#in_b2b_per").value = this.currentMerchant[0].fees.in_b2b.percent;
        var inb2b_flat = document.querySelector("#in_b2b_flat").value = this.currentMerchant[0].fees.in_b2b.flat;
        // 
        var feeAccSetup_flat = document.querySelector("#feeAccSetup_flat").value = this.currentMerchant[0].fees.fee_account_setup.flat;
        // 
        var feeAccMonthly_flat = document.querySelector("#feeAccMonthly_flat").value = this.currentMerchant[0].fees.fee_account_mounthly.flat;
        // 
        var feeAccAdd_flat = document.querySelector("#feeAccAdd_flat").value = this.currentMerchant[0].fees.fee_account_additional.flat;
        // 
        var feeAccDed_flat = document.querySelector("#feeAccDed_flat").value = this.currentMerchant[0].fees.fee_account_dedicated.flat;
        // 
        var fineRecall_per = document.querySelector("#fineRecall_per").value = this.currentMerchant[0].fees.fine_recall.percent;
        var fineRecall_flat = document.querySelector("#fineRecall_flat").value = this.currentMerchant[0].fees.fine_recall.flat;
        // 
        var fineAttIncPp_per = document.querySelector("#fineAttIncPp_per").value = this.currentMerchant[0].fees.fine_attitude_incorrect_payment_purpose.percent;
        var fineAttIncPp_flat = document.querySelector("#fineAttIncPp_flat").value = this.currentMerchant[0].fees.fine_attitude_incorrect_payment_purpose.flat;
        // 
        var fineAttWrongAm_per = document.querySelector("#fineAttWrongAm_per").value = this.currentMerchant[0].fees.fine_attitude_wrong_amount.percent;
        var fineAttWrongAm_flat = document.querySelector("#fineAttWrongAm_flat").value = this.currentMerchant[0].fees.fine_attitude_wrong_amount.flat;
        // 
        var fineAttMoreThen1Pay_per = document.querySelector("#fineAttMoreThen1Pay_per").value = this.currentMerchant[0].fees.fine_attitude_more_then_1_payment.percent;
        var fineAttMoreThen1Pay_flat = document.querySelector("#fineAttMoreThen1Pay_flat").value = this.currentMerchant[0].fees.fine_attitude_more_then_1_payment.flat;
        // 
        var fineAttPayWithInv_per = document.querySelector("#fineAttPayWithInv_per").value = this.currentMerchant[0].fees.fine_attitude_payment_without_invoice.percent;
        var fineAttPayWithInv_flat = document.querySelector("#fineAttPayWithInv_flat").value = this.currentMerchant[0].fees.fine_attitude_payment_without_invoice.flat;
        // 
        var fineAttPayFromBlo_per = document.querySelector("#fineAttPayFromBlo_per").value = this.currentMerchant[0].fees.fine_attitude_payment_from_blocked.percent;
        var fineAttPayFromBlo_flat = document.querySelector("#fineAttPayFromBlo_flat").value = this.currentMerchant[0].fees.fine_attitude_payment_from_blocked.flat;
        // 
        var fineAttMoreThen1perRecalls_per = document.querySelector("#fineAttMoreThen1perRecalls_per").value = this.currentMerchant[0].fees.fine_attitude_more_then_1percent_recalls.percent;
        var fineAttMoreThen1perRecalls_flat = document.querySelector("#fineAttMoreThen1perRecalls_flat").value = this.currentMerchant[0].fees.fine_attitude_more_then_1percent_recalls.flat;
        // 
        var settBTC_per = document.querySelector("#settBTC_per").value = this.currentMerchant[0].fees.settlement_btc.percent;
        var settBTC_flat = document.querySelector("#settBTC_flat").value = this.currentMerchant[0].fees.settlement_btc.flat;
        // 
        var settATM_per = document.querySelector("#settATM_per").value = this.currentMerchant[0].fees.settlement_atm.percent;
        var settATM_flat = document.querySelector("#settATM_flat").value = this.currentMerchant[0].fees.settlement_atm.flat;
        // 
        var settC2Bwire_per = document.querySelector("#settC2Bwire_per").value = this.currentMerchant[0].fees.settlement_c2b_wire.percent;
        var settC2Bwire_flat = document.querySelector("#settC2Bwire_flat").value = this.currentMerchant[0].fees.settlement_c2b_wire.flat;
        // 
        var settB2Bwire_per = document.querySelector("#settB2Bwire_per").value = this.currentMerchant[0].fees.settlement_b2b_wire.percent;
        var settB2Bwire_flat = document.querySelector("#settB2Bwire_flat").value = this.currentMerchant[0].fees.settlement_b2b_wire.flat;
        // 
        var settRecall_per = document.querySelector("#settRecall_per").value = this.currentMerchant[0].fees.settlement_recall.percent;
        var settRecall_flat = document.querySelector("#settRecall_flat").value = this.currentMerchant[0].fees.settlement_recall.flat;
        // 
        var settRefund_per = document.querySelector("#settRefund_per").value = this.currentMerchant[0].fees.settlement_refund.percent;
        var settRefund_flat = document.querySelector("#settRefund_flat").value = this.currentMerchant[0].fees.settlement_refund.flat;
        // 
        var settB2C_per = document.querySelector("#settB2C_per").value = this.currentMerchant[0].fees.settlement_b2c.percent;
        var settB2C_flat = document.querySelector("#settB2C_flat").value = this.currentMerchant[0].fees.settlement_b2c.flat;

        // Loading GIF On
        this.loadingGIF.style.display = "none";
    }

    getMerchants = async (number, filter) => {
        return  await fetch("http://18.216.223.81 :3000/getPart-Merchants", {
            method: "POST",
            body: JSON.stringify({
                number, 
                filter
            }),
            headers:{'Content-Type': 'application/json'}
        })
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
    }

    createMerchantReq = async (data) => {
        return  await fetch("http://18.216.223.81 :3000/createMerchant", {
                method: "POST",
                body: JSON.stringify({
                    "newMerchant": data
                }),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    alertWindow = (text) => {
        var filter =  document.querySelector(".alert_filter");
        filter.style.display = "flex";
        document.querySelector("#alert_body_text").innerHTML = text;
        document.querySelector("#alert_button").onclick = () => filter.style.display = "none";
    }

    openB2B = () => {
        var blockB2B = document.querySelector(".b2b_true_block");
        if (this.b2bInput.checked){
            blockB2B.style.display = "flex";   
        } else {
            blockB2B.style.display = "none"; 
        }
    }

    checkEmpty = (arr) => {
        var result = [];
        arr.forEach((item) => {
            item.value ? result.push(true) : result.push(false);
        });
        return result.some((item) => item === false);
    }

    createMerch = async () => {
        // Checking required fields
        var required = document.querySelectorAll(".required");
        var empty = this.checkEmpty(required);

            // If empty
        if (empty) {
            this.alertWindow("Please fill out all required fields!");

            // If all fields filled in
        } else if (!empty) {
            // Loading GIF On
            this.loadingGIF.style.display = "flex";

            var b2b = false;
            document.querySelector("#b2b").checked ? b2b = true : b2b = false;
            var createdBy = this.currentUser.textContent.trim();
            var newMerchant = {
                "name": document.querySelector("#merchName").value,
                "b2b": b2b,
                "fees": {
                    "in_c2b":{
                        "percent": +(document.querySelector("#in_c2b_per").value),
                        "flat": +(document.querySelector("#in_c2b_flat").value),
                        "additional": 0
                    },
                    "in_b2b":{
                        "percent": +(document.querySelector("#in_b2b_per").value),
                        "flat": +(document.querySelector("#in_b2b_flat").value),
                        "additional": 0
                    },
                    "settlement_btc":{
                        "percent": +(document.querySelector("#settBTC_per").value),
                        "flat": +(document.querySelector("#settBTC_flat").value),
                        "additional": 0
                    },
                    "settlement_atm":{
                        "percent": +(document.querySelector("#settATM_per").value),
                        "flat": +(document.querySelector("#settATM_flat").value),
                        "additional": 0
                    },
                    "settlement_c2b_wire":{
                        "percent": +(document.querySelector("#settC2Bwire_per").value),
                        "flat": +(document.querySelector("#settC2Bwire_flat").value),
                        "additional": 0
                    },
                    "settlement_b2b_wire":{
                        "percent": +(document.querySelector("#settB2Bwire_per").value),
                        "flat": +(document.querySelector("#settB2Bwire_flat").value),
                        "additional": 0
                    },
                    "settlement_recall":{
                        "percent": +(document.querySelector("#settRecall_per").value),
                        "flat": +(document.querySelector("#settRecall_flat").value),
                        "additional": 0
                    },
                    "fee_account_additional":{
                        "flat": +(document.querySelector("#feeAccAdd_flat").value),
                        "additional": 0
                    },
                    "fee_account_dedicated":{
                        "flat": +(document.querySelector("#feeAccDed_flat").value),
                        "additional": 0
                    },
                    "fee_account_mounthly":{
                        "flat": +(document.querySelector("#feeAccMonthly_flat").value),
                        "additional": 0
                    },
                    "fee_account_setup":{
                        "flat": +(document.querySelector("#feeAccSetup_flat").value),
                        "additional": 0
                    },
                    "fine_attitude_incorrect_payment_purpose":{
                        "percent": +(document.querySelector("#fineAttIncPp_per").value),
                        "flat": +(document.querySelector("#fineAttIncPp_flat").value),
                        "additional": 0
                    },
                    "fine_attitude_more_then_1percent_recalls":{
                        "percent": +(document.querySelector("#fineAttMoreThen1perRecalls_per").value),
                        "flat": +(document.querySelector("#fineAttMoreThen1perRecalls_flat").value),
                        "additional": 0
                    },
                    "fine_attitude_more_then_1_payment":{
                        "percent": +(document.querySelector("#fineAttMoreThen1Pay_per").value),
                        "flat": +(document.querySelector("#fineAttMoreThen1Pay_flat").value),
                        "additional": 0
                    },
                    "fine_attitude_payment_from_blocked":{
                        "percent": +(document.querySelector("#fineAttPayFromBlo_per").value),
                        "flat": +(document.querySelector("#fineAttPayFromBlo_flat").value),
                        "additional": 0
                    },
                    "fine_attitude_payment_without_invoice":{
                        "percent": +(document.querySelector("#fineAttPayWithInv_per").value),
                        "flat": +(document.querySelector("#fineAttPayWithInv_flat").value),
                        "additional": 0
                    },
                    "fine_attitude_wrong_amount":{
                        "percent": +(document.querySelector("#fineAttWrongAm_per").value),
                        "flat": +(document.querySelector("#fineAttWrongAm_flat").value),
                        "additional": 0
                    },
                    "fine_recall":{
                        "percent": +(document.querySelector("#fineRecall_per").value),
                        "flat": +(document.querySelector("#fineRecall_flat").value),
                        "additional": 0
                    },
                    "settlement_b2c":{
                        "percent": +(document.querySelector("#settB2C_per").value),
                        "flat": +(document.querySelector("#settB2C_flat").value),
                        "additional": 0
                    },
                    "settlement_refund":{
                        "percent": +(document.querySelector("#settRefund_per").value),
                        "flat": +(document.querySelector("#settRefund_flat").value),
                        "additional": 0
                    }
                },
                "specifications": {
                    "background": document.querySelector("#backColor").value,
                    "first_color": document.querySelector("#firstColor").value,
                    "second_color": document.querySelector("#secondColor").value,
                    "logo": "",
                    "tagline": document.querySelector("#tagline").value
                },
                "support_email": document.querySelector("#merchEmail").value,
                "promo_code": document.querySelector("#promoCode").value,
                "users": {
                    "merchant_manager": [],
                    "invoice_manager": [],
                    "affiliate": document.querySelector("#affiliate").value,
                },
                "wallets": [],
                "available_banks": [],
                "specifications_b2b": {
                    "beneficiary_name": document.querySelector("#benefName").value,
                    "beneficiary_address": document.querySelector("#benefAddress").value,
                    "bank_name": document.querySelector("#bankName").value,
                    "bank_address": document.querySelector("#bankAddress").value,
                    "iban": document.querySelector("#IBAN").value,
                    "swift": document.querySelector("#SWIFT").value
                },
                "created_by": createdBy,
                "balance_USD": {
                    "balance_received": 0,
                    "balance_approved": 0,
                    "balance_available": 0,
                    "balance_frozen": 0
                },
                "balance_EUR": {
                    "balance_received": 0,
                    "balance_approved": 0,
                    "balance_available": 0,
                    "balance_frozen": 0
                }
            };
            await this.createMerchantReq(newMerchant);
            // Loading GIF OFF
            this.loadingGIF.style.display = "none";

            document.location.replace("http://18.216.223.81 :3000/merchants.html");
        } 
    }

    createOrEdit = () => {
        var score = decodeURIComponent(location.search.substr(1)).split('&');
        this.merchName = score[1];
        if (this.merchName) {
            // Loading GIF Off
            this.loadingGIF.style.display = "flex";
            document.querySelector(".main_title").innerHTML = `Edit ${this.merchName}`;
            document.title = `Edit ${this.merchName}`;
            this.editMerchantRenderPage();

            this.buttonCreate.textContent = "Edit";
            this.buttonCreate.addEventListener("click", this.editMerchantInit);
            
        } else {
            document.querySelector(".main_title").innerHTML = `Create merchant`;
            document.title = `Create merchant`;
            this.buttonCreate.addEventListener("click", this.createMerch);
        }
    }

    render(){
        this.createOrEdit();
        // 
        // Get list of Affilliate
        this.getListOfAffilliate();
        // 
        this.b2bInput.addEventListener("click", this.openB2B);
    }
}

const merchant = new CreateMerchant();