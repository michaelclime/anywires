class CreateMerchant{
    constructor(){
        this.merchName = "";
        this.loadingGIF = document.querySelector("#loadingGif");
        this.buttonCreate = document.querySelector("#create_merch");
        this.b2bInput = document.querySelector("#b2b");
        this.currentUser = document.querySelector(".userName");
        this.render();
    }

    createMerchantReq = async (data) => {
        return  await fetch("http://18.216.223.81:3000/createMerchant", {
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
                        "flat": +(document.querySelector("#in_c2b_flat").value)
                    },
                    "in_b2b":{
                        "percent": +(document.querySelector("#in_b2b_per").value),
                        "flat": +(document.querySelector("#in_b2b_flat").value)
                    },
                    "settlement_btc":{
                        "percent": +(document.querySelector("#settBTC_per").value),
                        "flat": +(document.querySelector("#settBTC_flat").value)
                    },
                    "settlement_atm":{
                        "percent": +(document.querySelector("#settATM_per").value),
                        "flat": +(document.querySelector("#settATM_flat").value)
                    },
                    "settlement_c2b_wire":{
                        "percent": +(document.querySelector("#settC2Bwire_per").value),
                        "flat": +(document.querySelector("#settC2Bwire_flat").value)
                    },
                    "settlement_b2b_wire":{
                        "percent": +(document.querySelector("#settB2Bwire_per").value),
                        "flat": +(document.querySelector("#settB2Bwire_flat").value),
                    },
                    "settlement_recall":{
                        "percent": +(document.querySelector("#settRecall_per").value),
                        "flat": +(document.querySelector("#settRecall_flat").value)
                    },
                    "fee_account_additional":{
                        "percent": +(document.querySelector("#feeAccAdd_per").value),
                        "flat": +(document.querySelector("#feeAccAdd_flat").value)
                    },
                    "fee_account_dedicated":{
                        "percent": +(document.querySelector("#feeAccDed_per").value),
                        "flat": +(document.querySelector("#feeAccDed_flat").value)
                    },
                    "fee_account_monthly":{
                        "percent": +(document.querySelector("#feeAccMonthly_per").value),
                        "flat": +(document.querySelector("#feeAccMonthly_flat").value)
                    },
                    "fee_account_setup":{
                        "percent": +(document.querySelector("#feeAccSetup_per").value),
                        "flat": +(document.querySelector("#feeAccSetup_flat").value)
                    },
                    "fine_attitude_incorrect_payment_purpose":{
                        "percent": +(document.querySelector("#fineAttIncPp_per").value),
                        "flat": +(document.querySelector("#fineAttIncPp_flat").value)
                    },
                    "fine_attitude_more_then_1percent_recalls":{
                        "percent": +(document.querySelector("#fineAttMoreThen1perRecalls_per").value),
                        "flat": +(document.querySelector("#fineAttMoreThen1perRecalls_flat").value)
                    },
                    "fine_attitude_more_then_1_payment":{
                        "percent": +(document.querySelector("#fineAttMoreThen1Pay_per").value),
                        "flat": +(document.querySelector("#fineAttMoreThen1Pay_flat").value)
                    },
                    "fine_attitude_payment_from_blocked":{
                        "percent": +(document.querySelector("#fineAttPayFromBlo_per").value),
                        "flat": +(document.querySelector("#fineAttPayFromBlo_flat").value)
                    },
                    "fine_attitude_payment_without_invoice":{
                        "percent": +(document.querySelector("#fineAttPayWithInv_per").value),
                        "flat": +(document.querySelector("#fineAttPayWithInv_flat").value)
                    },
                    "fine_attitude_wrong_amount":{
                        "percent": +(document.querySelector("#fineAttWrongAm_per").value),
                        "flat": +(document.querySelector("#fineAttWrongAm_flat").value)
                    },
                    "fine_recall":{
                        "percent": +(document.querySelector("#fineRecall_per").value),
                        "flat": +(document.querySelector("#fineRecall_flat").value)
                    },
                    "settlement_b2c":{
                        "percent": +(document.querySelector("#settB2C_per").value),
                        "flat": +(document.querySelector("#settB2C_flat").value)
                    },
                    "settlement_refund":{
                        "percent": +(document.querySelector("#settRefund_per").value),
                        "flat": +(document.querySelector("#settRefund_flat").value)
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
                    "affiliate": ""
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
                "inside_wallets": [],
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

            document.location.replace("http://18.216.223.81:3000/merchants.html");
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
            
        } else {
            document.querySelector(".main_title").innerHTML = `Create merchant`;
            document.title = `Create merchant`;
            this.buttonCreate.addEventListener("click", this.createMerch);
        }
    }

    render(){
        this.createOrEdit();
        this.b2bInput.addEventListener("click", this.openB2B);
    }
}

const merchant = new CreateMerchant();