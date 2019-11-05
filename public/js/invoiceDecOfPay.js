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

    renderPage = () => {
        this.bankLogo = document.querySelector(".bank-logo");
        this.invClientCountry = document.querySelector(".invClientCountry");
        this.invClientID = document.querySelector(".invClientID");
        this.invBankBenefName = document.querySelectorAll(".invBankBenefName");
        this.invoiceDate = document.querySelector(".invoiceDate");
        this.invAmount = document.querySelector(".invAmount");
        this.invoiceCurrency = document.querySelector(".invoiceCurrency");

        this.bankLogo.src = this.Bank[0].company_logo
        this.invClientCountry.innerHTML = this.Invoice[0].client_details.country;
        if ( this.Invoice[0].client_details.id_number) {
            this.invClientID.innerHTML = this.Invoice[0].client_details.id_number;
        }
        this.invBankBenefName.forEach( i => i.innerHTML = this.Bank[0].beneficiary_name);
        this.correctDate = new Date(this.Invoice[0].dates.creation_date);
        this.invoiceDate.innerHTML =  this.correctDate.getDate() + '/' + ( this.correctDate.getMonth()+ 1) + '/' +  this.correctDate.getFullYear();
        this.invAmount.innerHTML = this.Invoice[0].amount.amount_sent;
        this.invoiceCurrency.innerHTML = this.Invoice[0].currency;

    }

    loadPage = async () => {
        this.number = this.getNumberInvoice();
         
        this.Invoice = await this.getInvoices(this.number);
        this.Bank = await this.getBank(this.Invoice[0].bank);
        this.renderPage();
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
        this.loadPage();
    }
}

const invoice_ = new InvoicePreview();