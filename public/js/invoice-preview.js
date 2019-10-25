class InvoicePreview {
    constructor(){

        this.render();
    }

    getNumberInvoice = () => {
        var score = decodeURIComponent(location.search.substr(1)).split('&');
        score.splice(0, 1);
        var result = score[0];
        return result;
    }

    checkDate = (data) => {
        return data === "" ? data = "mm/dd/yyyy" : data = moment(data).format('ll');
    }

    renderPage = () => {
        this.invoiceDate = document.querySelector("#invoiceDate");
        this.invoiceNumber = document.querySelector("#invoiceNumber");
        this.invoiceYear = document.querySelector("#invoiceYear");
        this.clientName = document.querySelector("#clientName");
        this.clientEmail = document.querySelector("#clientEmail");
        this.clientPhone = document.querySelector("#clientPhone");
        this.contractNumber = document.querySelector("#contractNumber");
        this.contractYear = document.querySelector("#contractYear");
        this.totalSum = document.querySelector("#totalSum");
        this.totalLarge = document.querySelector("#totalLarge");
        this.currency = document.querySelectorAll(".currency");

        this.Invoice.forEach(item => {
            this.invoiceDate.textContent = this.checkDate(item.dates.creation_date);
            this.invoiceNumber.textContent = item.number;
            this.invoiceYear.textContent = new Date(item.dates.creation_date).getFullYear();
            this.clientName.textContent = item.client_details.full_name;
            this.clientEmail.textContent = item.client_details.email;
            this.clientPhone.textContent = item.client_details.phone;
            this.contractNumber.textContent = item.number;
            this.contractYear.textContent = new Date(item.dates.creation_date).getFullYear();
            this.totalSum.textContent = item.amount.amount_requested;
            this.totalLarge.textContent = item.amount.amount_requested;
            this.currency.forEach((el) => el.textContent = item.currency)
        });


        this.benefName = document.querySelector("#benefName");
        this.benefAdress = document.querySelector("#benefAdress");
        this.bankName = document.querySelector("#bankName");
        this.bankAdress = document.querySelector("#bankAdress");
        this.IBAN = document.querySelector("#IBAN");
        this.SWIFT = document.querySelector("#SWIFT");
        this.currencyBank = document.querySelector("#currency");
        

        this.Bank.forEach((bank) => {
            this.benefName.textContent = bank.beneficiary_name;
            this.benefAdress.textContent = bank.beneficiary_address;
            this.bankName.textContent = bank.name;
            this.bankAdress.textContent = bank.bank_address;
            this.SWIFT.textContent = bank.swift_bic;

            if(this.currencyBank.textContent.trim() === "EUR"){
                this.IBAN.innerHTML = `IBAN EUR: ` + bank.iban_eur;
            } else if (this.currencyBank.textContent.trim() === "USD") {
                this.IBAN.innerHTML = `IBAN USD: ` + bank.iban_usd;
            }
        }); 


        this.Merchant.forEach((merchant) => {
            this.background = merchant.specifications.background;
            this.firstColor = merchant.specifications.first_color;
            this.secondColor = merchant.specifications.second_color;
            this.logo = merchant.specifications.logo;
            this.tagLine = merchant.specifications.tagline;
        });
        this.tableTh = document.querySelectorAll(".forBack");
        this.tableTh.forEach((th) => th.style.backgroundColor = this.firstColor);
        this.bankLogo = document.querySelector(".bank-logo").src = this.logo;

    }

    saveBanksInvoices = async () => {
        this.number = this.getNumberInvoice();
         
        this.Invoice = await this.getInvoices(this.number);
        this.Invoice.forEach((item) => {
            this.bankName = item.bank;
            this.merchantName = item.merchant;
        });

        this.Bank = await this.getBank(this.bankName);
        this.Merchant = await this.getMerchant(this.merchantName);
        this.renderPage();
    }

    getMerchant = async (merchantName) => {
        return  await fetch("http://18.216.223.81:3000/get-merchantByName", {
                method: "POST",
                body: JSON.stringify({"name" : merchantName}),
                headers:{'Content-Type': 'application/json'}
                })
                .then(res => {
                    return res.json();
                }) 
                .catch(err => {
                    console.log(err);
                });
    }

    getBank = async (bankName) => {
        return  await fetch("http://18.216.223.81:3000/get-bankByName", {
                method: "POST",
                body: JSON.stringify({"name" : bankName}),
                headers:{'Content-Type': 'application/json'}
                })
                .then(res => {
                    return res.json();
                }) 
                .catch(err => {
                    console.log(err);
                });
    }

    getInvoices = async (number) => {
        return  await fetch("http://18.216.223.81:3000/get-invoiceByNumber", {
                method: "POST",
                body: JSON.stringify({"number" : number}),
                headers:{'Content-Type': 'application/json'}
                })
                .then(res => {
                    return res.json();
                }) 
                .catch(err => {
                    console.log(err);
                });
    }


    render(){
        this.getNumberInvoice();
        this.saveBanksInvoices();
    }
}

const invoice_ = new InvoicePreview();