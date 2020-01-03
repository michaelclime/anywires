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
        const Affilliate = await this.getListOfAffilliateReq({"role": "Affiliate"});
        const container = document.querySelector("#affiliate");
        Affilliate.users.forEach( aff => {
            const option = document.createElement("option");
            option.value = aff.email;
            option.innerHTML = `${aff.username} '${aff.email}'`;
            container.appendChild(option);
        });
    }

    getListOfAffilliateReq = async (filter) => {
        return  await fetch("http://18.216.223.81:3000/getUserByFilter", {
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
        return  await fetch("http://18.216.223.81:3000/edit-merchant", {
            method: "POST",
            body: JSON.stringify({
                mechantName,
                newData
            }),
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => {
            return res.text();
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

            const selectedBanks = document.querySelectorAll(".multi-select__selected-label");
            const selectedArr = [];
            selectedBanks.forEach(item => selectedArr.push(item.textContent.trim()));

            var editedMerch = {
                "name": document.querySelector("#merchName").value,
                "b2b": b2b,
                "available_banks": selectedArr,
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
            document.location.replace("http://18.216.223.81:3000/merchants.html");
        }
    }

    editMerchantRenderPage = async () => {
        const data = {
            filter: { 'name': this.merchName} ,
            skip: 0,
            limit: 10
        }
        const res = await this.getMerchantsPartly(data)
        this.currentMerchant = res.merchants;

        // Merchant info render
        var b2b = document.querySelector("#b2b");
        this.currentMerchant[0].b2b === true ? b2b.checked = true : b2b.checked = false;

        // // 1. Multiple select options START
        const containerSelect = document.querySelector('.multi-select__label');
        this.currentMerchant[0].available_banks.forEach(item => {
            const optionName = item.trim();
            const selectedOption = document.createElement('span');
            selectedOption.classList.add('multi-select__selected-label');
            selectedOption.setAttribute('data-value', optionName);
            selectedOption.innerHTML = `${optionName}<i class="fa fa-times" data-value="${optionName}"></i>`;
            containerSelect.appendChild(selectedOption);

            const optionsNode = document.querySelectorAll('.multi-select__option');
            optionsNode.forEach(elem => {
                elem.textContent.trim() === optionName ? elem.classList.add('multi-select__option--selected') : null;
            });
        });
        
        // Event for delete Coutries
        document.querySelectorAll('.fa-times').forEach(elem => {
            elem.addEventListener('click', this.deleteElementFromAvailableBanks);
        });

        this.chengeOptionsHeight();
        // // Multiple select options END

        document.querySelector("#merchName").value = this.currentMerchant[0].name;
        document.querySelector("#promoCode").value = this.currentMerchant[0].promo_code;
        document.querySelector("#affiliate").value = this.currentMerchant[0].users.affiliate;
        document.querySelector("#merchEmail").value = this.currentMerchant[0].support_email;
        document.querySelector("#tagline").value = this.currentMerchant[0].specifications.tagline;
        document.querySelector("#backColor").value = this.currentMerchant[0].specifications.background;
        document.querySelector("#firstColor").value = this.currentMerchant[0].specifications.first_color;
        document.querySelector("#secondColor").value = this.currentMerchant[0].specifications.second_color;
        if (b2b.checked === true) {
            document.querySelector(".b2b_true_block").style.display = "flex";
            document.querySelector("#bankAddress").value = this.currentMerchant[0].specifications_b2b.bank_address;
            document.querySelector("#IBAN").value = this.currentMerchant[0].specifications_b2b.iban;
            document.querySelector("#SWIFT").value = this.currentMerchant[0].specifications_b2b.swift;
            document.querySelector("#benefName").value = this.currentMerchant[0].specifications_b2b.beneficiary_name;
            document.querySelector("#benefAddress").value = this.currentMerchant[0].specifications_b2b.beneficiary_address;
            document.querySelector("#bankName").value = this.currentMerchant[0].specifications_b2b.bank_name;
        }

        // Commissions Render
        document.querySelector("#in_c2b_per").value = this.currentMerchant[0].fees.in_c2b.percent;
        document.querySelector("#in_c2b_flat").value = this.currentMerchant[0].fees.in_c2b.flat;
        // 
        document.querySelector("#in_b2b_per").value = this.currentMerchant[0].fees.in_b2b.percent;
        document.querySelector("#in_b2b_flat").value = this.currentMerchant[0].fees.in_b2b.flat;
        // 
        document.querySelector("#feeAccSetup_flat").value = this.currentMerchant[0].fees.fee_account_setup.flat;
        // 
        document.querySelector("#feeAccMonthly_flat").value = this.currentMerchant[0].fees.fee_account_mounthly.flat;
        // 
        document.querySelector("#feeAccAdd_flat").value = this.currentMerchant[0].fees.fee_account_additional.flat;
        // 
        document.querySelector("#feeAccDed_flat").value = this.currentMerchant[0].fees.fee_account_dedicated.flat;
        // 
        document.querySelector("#fineRecall_per").value = this.currentMerchant[0].fees.fine_recall.percent;
        document.querySelector("#fineRecall_flat").value = this.currentMerchant[0].fees.fine_recall.flat;
        // 
        document.querySelector("#fineAttIncPp_per").value = this.currentMerchant[0].fees.fine_attitude_incorrect_payment_purpose.percent;
        document.querySelector("#fineAttIncPp_flat").value = this.currentMerchant[0].fees.fine_attitude_incorrect_payment_purpose.flat;
        // 
        document.querySelector("#fineAttWrongAm_per").value = this.currentMerchant[0].fees.fine_attitude_wrong_amount.percent;
        document.querySelector("#fineAttWrongAm_flat").value = this.currentMerchant[0].fees.fine_attitude_wrong_amount.flat;
        // 
        document.querySelector("#fineAttMoreThen1Pay_per").value = this.currentMerchant[0].fees.fine_attitude_more_then_1_payment.percent;
        document.querySelector("#fineAttMoreThen1Pay_flat").value = this.currentMerchant[0].fees.fine_attitude_more_then_1_payment.flat;
        // 
        document.querySelector("#fineAttPayWithInv_per").value = this.currentMerchant[0].fees.fine_attitude_payment_without_invoice.percent;
        document.querySelector("#fineAttPayWithInv_flat").value = this.currentMerchant[0].fees.fine_attitude_payment_without_invoice.flat;
        // 
        document.querySelector("#fineAttPayFromBlo_per").value = this.currentMerchant[0].fees.fine_attitude_payment_from_blocked.percent;
        document.querySelector("#fineAttPayFromBlo_flat").value = this.currentMerchant[0].fees.fine_attitude_payment_from_blocked.flat;
        // 
        document.querySelector("#fineAttMoreThen1perRecalls_per").value = this.currentMerchant[0].fees.fine_attitude_more_then_1percent_recalls.percent;
        document.querySelector("#fineAttMoreThen1perRecalls_flat").value = this.currentMerchant[0].fees.fine_attitude_more_then_1percent_recalls.flat;
        // 
        document.querySelector("#settBTC_per").value = this.currentMerchant[0].fees.settlement_btc.percent;
        document.querySelector("#settBTC_flat").value = this.currentMerchant[0].fees.settlement_btc.flat;
        // 
        document.querySelector("#settATM_per").value = this.currentMerchant[0].fees.settlement_atm.percent;
        document.querySelector("#settATM_flat").value = this.currentMerchant[0].fees.settlement_atm.flat;
        // 
        document.querySelector("#settC2Bwire_per").value = this.currentMerchant[0].fees.settlement_c2b_wire.percent;
        document.querySelector("#settC2Bwire_flat").value = this.currentMerchant[0].fees.settlement_c2b_wire.flat;
        // 
        document.querySelector("#settB2Bwire_per").value = this.currentMerchant[0].fees.settlement_b2b_wire.percent;
        document.querySelector("#settB2Bwire_flat").value = this.currentMerchant[0].fees.settlement_b2b_wire.flat;
        // 
        document.querySelector("#settRecall_per").value = this.currentMerchant[0].fees.settlement_recall.percent;
        document.querySelector("#settRecall_flat").value = this.currentMerchant[0].fees.settlement_recall.flat;
        // 
        document.querySelector("#settRefund_per").value = this.currentMerchant[0].fees.settlement_refund.percent;
        document.querySelector("#settRefund_flat").value = this.currentMerchant[0].fees.settlement_refund.flat;
        // 
        document.querySelector("#settB2C_per").value = this.currentMerchant[0].fees.settlement_b2c.percent;
        document.querySelector("#settB2C_flat").value = this.currentMerchant[0].fees.settlement_b2c.flat;

        // Loading GIF On
        this.loadingGIF.style.display = "none";
    }

    getMerchantsPartly = async data => {
        return  await fetch("http://18.216.223.81:3000/get-merchants-partly", {
            method: "POST",
            body: JSON.stringify(data),
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

            const selectedBanks = document.querySelectorAll(".multi-select__selected-label");
            const selectedArr = [];
            selectedBanks.forEach(item => selectedArr.push(item.textContent.trim()));

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
                "available_banks": selectedArr,
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


class BankList extends CreateMerchant {
    constructor(){
        super();
        this.renderBanks();
        this.activeBanks = [];
    }

    getAllBanks = async filter => {
        return  await fetch("http://18.216.223.81:3000/get-all-banks", {
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
    
    renderBankList = async () => { 
        // Get List of Banks
        const allBanks = await this.getAllBanks({});
        this.activeBanks = allBanks.banks.filter(bank => bank.active === true).map(elem => elem.name);
        const bankList = allBanks.banks.map(bank => bank.name);
        // 

        // Event for opening hiden select 
        document.querySelector('.autocomplete-select').addEventListener('click', (event) => {
            event.preventDefault();

            document.querySelector('.multi-select__select').classList.add('multi-select__select--opened');

            const filterSelect = document.querySelector('.filter_select');
            filterSelect.style.display = 'flex';
            filterSelect.addEventListener("click", (event) => {
                if (event.target === filterSelect){
                    // Hide Modal Window
                    filterSelect.style.display = "none";
                    document.querySelector('.multi-select__select').classList.remove('multi-select__select--opened');
                }
            });

            // this.setFocusForInput('.multi-select__autocomplete');
        });

        
        // Render List of Countries
        bankList.reverse().forEach(elem => {
            const container = document.querySelector('.multi-select__options');
            const option = document.createElement('div');
            option.classList.add('multi-select__option');
            option.setAttribute('data-value', elem);
            option.innerHTML = `${elem}`;
            container.appendChild(option);
        });

        // Event for every Option is List
        const optionsNode = document.querySelectorAll('.multi-select__option');
        optionsNode.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();

                const optionName = event.target.getAttribute('data-value');
                const container = document.querySelector('.multi-select__label');
                
                const selectedOption = document.createElement('span');
                selectedOption.classList.add('multi-select__selected-label');
                selectedOption.setAttribute('data-value', optionName);
                selectedOption.innerHTML = `${optionName}<i class="fa fa-times" data-value="${optionName}"></i>`;
                container.appendChild(selectedOption);
                event.target.classList.add('multi-select__option--selected');

                // Event for delete Coutries
                document.querySelectorAll('.fa-times').forEach(elem => {
                    elem.addEventListener('click', this.deleteElementFromAvailableBanks);
                });

                this.chengeOptionsHeight();

            });
        });
    }


    removeAllCountries = () => {
        document.querySelector('.multi-select__label').innerHTML = '';
        document.querySelectorAll('.multi-select__option').forEach(item => item.classList.remove('multi-select__option--selected'));
        this.chengeOptionsHeight();
    }


    selectAllOptions = () => {
        const optionsNode = document.querySelectorAll('.multi-select__option');
        const container = document.querySelector('.multi-select__label');
        container.innerHTML = '';
        optionsNode.forEach(item => {
            const optionName = item.textContent.trim();
            item.classList.add('multi-select__option--selected');
            const selectedOption = document.createElement('span');
            selectedOption.classList.add('multi-select__selected-label');
            selectedOption.setAttribute('data-value', optionName);
            selectedOption.innerHTML = `${optionName}<i class="fa fa-times" data-value="${optionName}"></i>`;
            container.appendChild(selectedOption);
        });
        this.chengeOptionsHeight();
        // Event for delete Coutries
        document.querySelectorAll('.fa-times').forEach(elem => {
            elem.addEventListener('click', this.deleteElementFromAvailableBanks);
        });
    }


    selectActiveOptions = () => {
        const optionsNode = document.querySelectorAll('.multi-select__option');
        const container = document.querySelector('.multi-select__label');
        container.innerHTML = '';
        optionsNode.forEach(item => {
            const optionName = item.textContent.trim();
            if (this.activeBanks.includes(optionName)) {
                item.classList.add('multi-select__option--selected');
                const selectedOption = document.createElement('span');
                selectedOption.classList.add('multi-select__selected-label');
                selectedOption.setAttribute('data-value', optionName);
                selectedOption.innerHTML = `${optionName}<i class="fa fa-times" data-value="${optionName}"></i>`;
                container.appendChild(selectedOption);
            }
        });
        this.chengeOptionsHeight();
        // Event for delete Coutries
        document.querySelectorAll('.fa-times').forEach(elem => {
            elem.addEventListener('click', this.deleteElementFromAvailableBanks);
        });
    }


    deleteElementFromAvailableBanks = (e) => {
        e.preventDefault();
        const elemName = e.target.getAttribute('data-value');
        
        document.querySelectorAll('.multi-select__option').forEach(item => {
        
            elemName === item.textContent.trim() 
            ?
            item.classList.remove('multi-select__option--selected')
            :
            null

        });
        e.target.closest('span').remove();
        
        this.chengeOptionsHeight();
    }

    
    chengeOptionsHeight = () => {
        // Checking height of Block With elemtns
        const heightWrapper = document.querySelector('.autocomplete-select').clientHeight;
        document.querySelector('.multi-select__options').style.top = `${heightWrapper + 10}px`;
    }


    eventForInput = () => {
        document.querySelector('.multi-select__autocomplete').addEventListener('keyup', (event) => {
            event.preventDefault()

            const optionsNode = document.querySelectorAll('.multi-select__option');
            optionsNode.forEach(item => {
                if (event.target.value.trim()) {
                    const firstArr = (item.textContent.trim().toLowerCase());
                    const secondArr = (event.target.value.trim().toLowerCase());

                    firstArr.includes(secondArr)
                    ?
                    item.classList.remove('multi-select__option--hidden')
                    :
                    item.classList.add('multi-select__option--hidden')
                } else {
                    item.classList.remove('multi-select__option--hidden');
                }

            });
        });
    }

    renderBanks(){
        // Render Bank List
        this.renderBankList();
        this.eventForInput();
        document.querySelector('#bankList__buttons--remove-all').addEventListener('click', this.removeAllCountries);
        document.querySelector('#bankList__buttons--select-all').addEventListener('click', this.selectAllOptions);
        document.querySelector('#bankList__buttons--active').addEventListener('click', this.selectActiveOptions);
    }
}

const merchant = new BankList();