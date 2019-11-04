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
        this.invNum = document.querySelector(".invNum");
        this.invDate = document.querySelector(".invDate");
        this.bankBenefName = document.querySelectorAll(".bankBenefName");
        this.bankBenefAddress = document.querySelectorAll(".bankBenefAddress");
        this.bankSite = document.querySelector(".bankSite");
        this.invClientName = document.querySelectorAll(".invClientName");
        this.invClientEmail = document.querySelectorAll(".invClientEmail");
        this.invClientAdress = document.querySelector(".invClientAdress");

        this.invNum.innerHTML = this.getNumberInvoice();
        this.correctDate = new Date(this.Invoice[0].dates.creation_date);
        this.invDate.innerHTML =  this.correctDate.getDate() + '/' + ( this.correctDate.getMonth()+ 1) + '/' +  this.correctDate.getFullYear();
        this.bankBenefName.forEach( i => i.innerHTML = this.Bank[0].beneficiary_name);
        this.bankBenefAddress.forEach( i => i.innerHTML = this.Bank[0].beneficiary_address);
        this.bankSite.innerHTML = this.Bank[0].company_site;
        this.invClientName.forEach( i => i.innerHTML = this.Invoice[0].client_details.full_name);
        this.invClientEmail.forEach( i => i.innerHTML = this.Invoice[0].client_details.email);
        this.invClientAdress = this.Invoice[0].client_details.address;
    }

    loadPage = async () => {
        this.number = this.getNumberInvoice();
         
        this.Invoice = await this.getInvoices(this.number);
        this.Bank = await this.getBank(this.Invoice[0].bank);
        this.renderPage();
    }

    getBank = async (bankName) => {
        return  await fetch("http://localhost:3000/get-bankByName", {
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
        return  await fetch("http://localhost:3000/get-invoiceByNumber", {
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