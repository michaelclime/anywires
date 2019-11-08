class createBank{
    constructor(){
        this.buttonCreateBank  = document.querySelector("#create_bank");
        this.switch = document.querySelector(".switcher_block");
        this.loadingGIF = document.querySelector("#loadingGif");
        this.bankName = "";
        this.render();
    }

    editBankRequest = async (bankName, newData) => {
        return  await fetch("http://18.216.223.81:3000/editBank", {
            method: "POST",
            body: JSON.stringify({
                bankName,
                newData
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

    editBankInitial = async () => {
        var requiredFields = document.querySelectorAll(".required");
        var empty = this.checkedEmptyArray(requiredFields);

        if (empty === true) {
            this.alertWindow("Please fill out all fields!");
            
            // If All required fields not empty than
        } else if (empty === false) {
            // Checking SEPA, B2B and active
            // Checking SEPA, B2B and active
            var sepa = false,
                b2b = false,
                active = false;
            document.querySelector("#sepa").checked ? sepa = true : sepa = false;
            document.querySelector("#b2b").checked ? b2b = true : b2b = false;
            document.querySelector("#active").checked ? active = true : active = false;

            var editedBank = {
                "name" : document.querySelector("#bankName").value, 
                "beneficiary_name" : document.querySelector("#benefName").value,  
                "solution_name" : document.querySelector("#solName").value,  
                "country" : document.querySelector("#bankCountry").value,
                "beneficiary address" : document.querySelector("#benefAddress").value,
                "max_wire" : +(document.querySelector("#maxWire").value), 
                "min_wire" : +(document.querySelector("#minWire").value),  
                "iban_EUR" : document.querySelector("#IBAN_EUR").value,
                "iban_USD" : document.querySelector("#IBAN_USD").value,
                "swift_bic" : document.querySelector("#SWIFT").value,
                "bank_address" : document.querySelector("#bankAddress").value,
                "company_site" : document.querySelector("#bankComSite").value,
                "stop_limit" : +(document.querySelector("#stopLimit").value),
                "registration_number": document.querySelector("#regNum").value,
                "sepa" : sepa, 
                "b2b" : b2b, 
                "company_logo" : "", 
                "active" : active, 
                "description" : document.querySelector("#description").value, 
                "solution_fees": {
                    "in_c2b":{
                        "percent": +(document.querySelector("#in_c2b_per").value),
                        "flat": +(document.querySelector("#in_c2b_flat").value)
                    },
                    "in_b2b":{
                        "percent": +(document.querySelector("#in_b2b_per").value),
                        "flat": +(document.querySelector("#in_b2b_flat").value)
                    },
                    "transfer":{
                        "percent": +(document.querySelector("#transfer_per").value),
                        "flat": +(document.querySelector("#transfer_flat").value)
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
                }
            };

            // Loading GIF On
            this.loadingGIF.style.display = "flex";

            await this.editBankRequest(this.bankName, editedBank);

            document.location.replace("http://18.216.223.81:3000/banks.html");

        }
    }

    getBank = async (number, filter) => {
        return  await fetch("http://18.216.223.81:3000/getPart-Banks", {
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

    edtiBankRenderPage = async () => {
        var editedBank = await this.getBank(0, {"name": this.bankName});

        // Bank Info Render
        document.querySelector("#create_bank").innerHTML = "Change";
        var SEPA = document.querySelector("#sepa"),
            B2B = document.querySelector("#b2b"),
            active = document.querySelector(".js-switch");
        editedBank[0].sepa === true ? SEPA.checked = true : SEPA.checked = false;
        editedBank[0].b2b === true ? B2B.checked = true : B2B.checked = false;
        if (editedBank[0].active === true){
            active.setAttribute("checked", "checked");
            this.switcherIphone();
            this.changeSwitcherStatus();
        } else {
            active.removeAttribute("checked", "checked");
            this.switcherIphone();
            this.changeSwitcherStatus();
        }
        var bankName =  document.querySelector("#bankName").value = editedBank[0].name;
        var benefName =  document.querySelector("#benefName").value = editedBank[0].beneficiary_name;
        var solName =  document.querySelector("#solName").value = editedBank[0].solution_name;
        var bankCountry =  document.querySelector("#bankCountry").value = editedBank[0].country;
        var benefAddress =  document.querySelector("#benefAddress").value = editedBank[0].beneficiary_address;
        var maxWire =  document.querySelector("#maxWire").value = editedBank[0].max_wire;
        var minWire =  document.querySelector("#minWire").value = editedBank[0].min_wire;
        var IBAN_EUR =  document.querySelector("#IBAN_EUR").value = editedBank[0].iban_EUR;
        var IBAN_USD =  document.querySelector("#IBAN_USD").value = editedBank[0].iban_USD;
        var SWIFT =  document.querySelector("#SWIFT").value = editedBank[0].swift_bic;
        var bankAddress =  document.querySelector("#bankAddress").value = editedBank[0].bank_address;
        var bankComSite =  document.querySelector("#bankComSite").value = editedBank[0].company_site;
        var stopLimit =  document.querySelector("#stopLimit").value = editedBank[0].stop_limit;
        var regNum =  document.querySelector("#regNum").value = editedBank[0].registration_number;
        var description =  document.querySelector("#description").value = editedBank[0].description;

        // Commissions Render
        var inc2b_per = document.querySelector("#in_c2b_per").value = editedBank[0].solution_fees.in_c2b.percent;
        var in_c2b_flat = document.querySelector("#in_c2b_flat").value = editedBank[0].solution_fees.in_c2b.flat;
        // 
        var inb2b_per = document.querySelector("#in_b2b_per").value = editedBank[0].solution_fees.in_b2b.percent;
        var inb2b_flat = document.querySelector("#in_b2b_flat").value = editedBank[0].solution_fees.in_b2b.flat;
        // 
        var transfer_per = document.querySelector("#transfer_per").value = editedBank[0].solution_fees.transfer.percent;
        var transfer_flat = document.querySelector("#transfer_flat").value = editedBank[0].solution_fees.transfer.flat;
        // 
        var feeAccSetup_per = document.querySelector("#feeAccSetup_per").value = editedBank[0].solution_fees.fee_account_setup.percent;
        var feeAccSetup_flat = document.querySelector("#feeAccSetup_flat").value = editedBank[0].solution_fees.fee_account_setup.flat;
        // 
        var feeAccMonthly_per = document.querySelector("#feeAccMonthly_per").value = editedBank[0].solution_fees.fee_account_monthly.percent;
        var feeAccMonthly_flat = document.querySelector("#feeAccMonthly_flat").value = editedBank[0].solution_fees.fee_account_monthly.flat;
        // 
        var feeAccAdd_per = document.querySelector("#feeAccAdd_per").value = editedBank[0].solution_fees.fee_account_additional.percent;
        var feeAccAdd_flat = document.querySelector("#feeAccAdd_flat").value = editedBank[0].solution_fees.fee_account_additional.flat;
        // 
        var feeAccDed_per = document.querySelector("#feeAccDed_per").value = editedBank[0].solution_fees.fee_account_dedicated.percent;
        var feeAccDed_flat = document.querySelector("#feeAccDed_flat").value = editedBank[0].solution_fees.fee_account_dedicated.flat;
        // 
        var fineRecall_per = document.querySelector("#fineRecall_per").value = editedBank[0].solution_fees.fine_recall.percent;
        var fineRecall_flat = document.querySelector("#fineRecall_flat").value = editedBank[0].solution_fees.fine_recall.flat;
        // 
        var fineAttIncPp_per = document.querySelector("#fineAttIncPp_per").value = editedBank[0].solution_fees.fine_attitude_incorrect_payment_purpose.percent;
        var fineAttIncPp_flat = document.querySelector("#fineAttIncPp_flat").value = editedBank[0].solution_fees.fine_attitude_incorrect_payment_purpose.flat;
        // 
        var fineAttWrongAm_per = document.querySelector("#fineAttWrongAm_per").value = editedBank[0].solution_fees.fine_attitude_wrong_amount.percent;
        var fineAttWrongAm_flat = document.querySelector("#fineAttWrongAm_flat").value = editedBank[0].solution_fees.fine_attitude_wrong_amount.flat;
        // 
        var fineAttMoreThen1Pay_per = document.querySelector("#fineAttMoreThen1Pay_per").value = editedBank[0].solution_fees.fine_attitude_more_then_1_payment.percent;
        var fineAttMoreThen1Pay_flat = document.querySelector("#fineAttMoreThen1Pay_flat").value = editedBank[0].solution_fees.fine_attitude_more_then_1_payment.flat;
        // 
        var fineAttPayWithInv_per = document.querySelector("#fineAttPayWithInv_per").value = editedBank[0].solution_fees.fine_attitude_payment_without_invoice.percent;
        var fineAttPayWithInv_flat = document.querySelector("#fineAttPayWithInv_flat").value = editedBank[0].solution_fees.fine_attitude_payment_without_invoice.flat;
        // 
        var fineAttPayFromBlo_per = document.querySelector("#fineAttPayFromBlo_per").value = editedBank[0].solution_fees.fine_attitude_payment_from_blocked.percent;
        var fineAttPayFromBlo_flat = document.querySelector("#fineAttPayFromBlo_flat").value = editedBank[0].solution_fees.fine_attitude_payment_from_blocked.flat;
        // 
        var fineAttMoreThen1perRecalls_per = document.querySelector("#fineAttMoreThen1perRecalls_per").value = editedBank[0].solution_fees.fine_attitude_more_then_1percent_recalls.percent;
        var fineAttMoreThen1perRecalls_flat = document.querySelector("#fineAttMoreThen1perRecalls_flat").value = editedBank[0].solution_fees.fine_attitude_more_then_1percent_recalls.flat;
        // 
        var settBTC_per = document.querySelector("#settBTC_per").value = editedBank[0].solution_fees.settlement_btc.percent;
        var settBTC_flat = document.querySelector("#settBTC_flat").value = editedBank[0].solution_fees.settlement_btc.flat;
        // 
        var settATM_per = document.querySelector("#settATM_per").value = editedBank[0].solution_fees.settlement_atm.percent;
        var settATM_flat = document.querySelector("#settATM_flat").value = editedBank[0].solution_fees.settlement_atm.flat;
        // 
        var settC2Bwire_per = document.querySelector("#settC2Bwire_per").value = editedBank[0].solution_fees.settlement_c2b_wire.percent;
        var settC2Bwire_flat = document.querySelector("#settC2Bwire_flat").value = editedBank[0].solution_fees.settlement_c2b_wire.flat;
        // 
        var settB2Bwire_per = document.querySelector("#settB2Bwire_per").value = editedBank[0].solution_fees.settlement_b2b_wire.percent;
        var settB2Bwire_flat = document.querySelector("#settB2Bwire_flat").value = editedBank[0].solution_fees.settlement_b2b_wire.flat;
        // 
        var settRecall_per = document.querySelector("#settRecall_per").value = editedBank[0].solution_fees.settlement_recall.percent;
        var settRecall_flat = document.querySelector("#settRecall_flat").value = editedBank[0].solution_fees.settlement_recall.flat;
        // 
        var settRefund_per = document.querySelector("#settRefund_per").value = editedBank[0].solution_fees.settlement_refund.percent;
        var settRefund_flat = document.querySelector("#settRefund_flat").value = editedBank[0].solution_fees.settlement_refund.flat;
        // 
        var settB2C_per = document.querySelector("#settB2C_per").value = editedBank[0].solution_fees.settlement_b2c.percent;
        var settB2C_flat = document.querySelector("#settB2C_flat").value = editedBank[0].solution_fees.settlement_b2c.flat;

        // Event for Button Create
        document.querySelector("#create_bank").addEventListener("click", this.editBankInitial);

        // Loading GIF On
        this.loadingGIF.style.display = "none";
    }

    editOrCreateBank = async () => {
        var score = decodeURIComponent(location.search.substr(1)).split('&');
        this.bankName = score[1];
        if (this.bankName){
            document.querySelector(".main_title").innerHTML = `Edit: ${this.bankName}`;
            document.title = `Edit bank`;
            this.edtiBankRenderPage();

        } else {
             // Loading GIF Off
            this.loadingGIF.style.display = "none";

            document.querySelector(".main_title").innerHTML = `Create bank`;
            this.buttonCreateBank.addEventListener("click", this.createBank);
            this.switcherIphone();
        }
    }

    changeSwitcherStatus = () => {
        var label = document.querySelector(".switchLabel");
        document.querySelector("#active").checked ? label.innerHTML = "Enable:" : label.innerHTML = "Disable:"; 
    }

    checkedEmptyArray = (arr) => {
        var result = [];
        arr.forEach((item) => {
            item.value ? result.push(true) : result.push(false);
        });
        return result.some((item) => item === false);
    };

    createBankRequest = async (newBank) => {
        return  await fetch("http://18.216.223.81:3000/createBank", {
                method: "POST",
                body: JSON.stringify({
                    newBank
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

    switcherIphone = (status) => {
        // Switcher like iphone
        var elem = document.querySelector('.js-switch');
        var init = new Switchery(elem, {secondaryColor: '#DF4949', disable: status});
    }

    createBank = async () => {
        var requiredFields = document.querySelectorAll(".required");
        var empty = this.checkedEmptyArray(requiredFields);

        if (empty === true) {
            this.alertWindow("Please fill out all fields!");
            
            // If All required fields not empty than
        } else if (empty === false) {
            // Checking SEPA, B2B and active
            var sepa = false,
            b2b = false,
            active = false;
            document.querySelector("#sepa").checked ? sepa = true : sepa = false;
            document.querySelector("#b2b").checked ? b2b = true : b2b = false;
            document.querySelector("#active").checked ? active = true : active = false;

            var bank = {
                "name" : document.querySelector("#bankName").value, 
                "beneficiary_name" : document.querySelector("#benefName").value,  
                "solution_name" : document.querySelector("#solName").value,  
                "country" : document.querySelector("#bankCountry").value,
                "currency": ["EUR", "USD"],
                "beneficiary_address" : document.querySelector("#benefAddress").value,
                "max_wire" : +(document.querySelector("#maxWire").value), 
                "min_wire" : +(document.querySelector("#minWire").value),  
                "iban_EUR" : document.querySelector("#IBAN_EUR").value,
                "iban_USD" : document.querySelector("#IBAN_USD").value,
                "swift_bic" : document.querySelector("#SWIFT").value,
                "bank_address" : document.querySelector("#bankAddress").value,
                "company_site" : document.querySelector("#bankComSite").value,
                "stop_limit" : +(document.querySelector("#stopLimit").value),
                "registration_number": document.querySelector("#regNum").value,
                "sepa" : sepa, 
                "b2b" : b2b, 
                "company_logo" : "", 
                "balance_EUR": {
                    "balance_requested": 0,
                    "balance_sent": 0,
                    "balance_received": 0,
                    "balance_approved": 0,
                    "balance_available": 0,
                    "balance_settlement": 0
                },
                "balance_USD": {
                    "balance_requested": 0,
                    "balance_sent": 0,
                    "balance_received": 0,
                    "balance_approved": 0,
                    "balance_available": 0,
                    "balance_settlement": 0
                },
                "active" : active, 
                "description" : document.querySelector("#description").value, 
                "created_by" : document.querySelector(".userName").textContent,
                "solution_fees": {
                    "in_c2b":{
                        "percent": +(document.querySelector("#in_c2b_per").value),
                        "flat": +(document.querySelector("#in_c2b_flat").value)
                    },
                    "in_b2b":{
                        "percent": +(document.querySelector("#in_b2b_per").value),
                        "flat": +(document.querySelector("#in_b2b_flat").value)
                    },
                    "transfer":{
                        "percent": +(document.querySelector("#transfer_per").value),
                        "flat": +(document.querySelector("#transfer_flat").value)
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
                }
            };

            // Loading GIF On
            this.loadingGIF.style.display = "flex";

            await this.createBankRequest(bank);

            // Loading GIF Off
            this.loadingGIF.style.display = "none";
            
            document.location.replace("http://18.216.223.81:3000/banks.html");
        }
    }

    alertWindow = (text) => {
        document.body.classList.add("modal-open");
        var filter =  document.querySelector(".alert_filter");
        filter.style.display = "flex";
        document.querySelector("#alert_body_text").innerHTML = text;
        document.querySelector("#alert_button").onclick = (event) =>{
            event.preventDefault();
            document.body.classList.remove("modal-open");
            filter.style.display = "none";
        } 
    }

    render(){
        this.editOrCreateBank();
        this.switch.addEventListener("click", this.changeSwitcherStatus);
    }
}

const create = new createBank();