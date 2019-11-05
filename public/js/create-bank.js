// Switcher like iphone
var elem = document.querySelector('.js-switch');
var init = new Switchery(elem, {secondaryColor: '#DF4949',});

class createBank{
    constructor(){
        this.buttonCreateBank  = document.querySelector("#create_bank");
        this.switch = document.querySelector(".switchery");
        this.loadingGIF = document.querySelector("#loadingGif");
        this.render();
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
                "creation_date" : new Date(), 
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
                        "percent": +(document.querySelector("#fineAttMoreThen1perRecalls_pre").value),
                        "flat": +(document.querySelector("#fineAttMoreThen1perRecalls_flat").value)
                    },
                    "fine_attitude_more_then_1_payment":{
                        "percent": +(document.querySelector("#fineAttMoreThen1Pay_per").value),
                        "flat": +(document.querySelector("#fineAttMoreThen1Pay_flat").value)
                    },
                    "fine_attitude_payment_from_blocked":{
                        "percent": +(document.querySelector("#fineAttPayFromBlo_pre").value),
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
        this.buttonCreateBank .addEventListener("click", this.createBank);
        this.switch.addEventListener("click", this.changeSwitcherStatus);
    }
}

const create = new createBank();