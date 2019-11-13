// class InvoicePreview {
//     constructor(){

//         this.render();
//     }

//     getNumberInvoice = () => {
//         var score = decodeURIComponent(location.search.substr(1)).split('&');
//         score.splice(0, 1);
//         var result = score[0];
//         return result;
//     }

//     checkDate = (data) => {
//         return data === "" ? data = "mm/dd/yyyy" : data = moment(data).format('ll');
//     }

//     renderPage = () => {
//         this.invoiceDate = document.querySelector("#invoiceDate");
//         this.invoiceNumber = document.querySelector("#invoiceNumber");
//         this.invoiceYear = document.querySelector("#invoiceYear");
//         this.clientName = document.querySelector("#clientName");
//         this.clientEmail = document.querySelector("#clientEmail");
//         this.clientPhone = document.querySelector("#clientPhone");
//         this.clientAddress = document.querySelector("#clientAddress");
//         this.clientID = document.querySelector("#clientID");
//         this.totalSum = document.querySelector("#totalSum");
//         this.totalLarge = document.querySelector("#totalLarge");
//         this.currency = document.querySelectorAll(".currency");
//         this.paymentClass = document.querySelector(".paymentClass");

//         this.Invoice.forEach(item => {
//             this.invoiceDate.textContent = this.checkDate(item.dates.creation_date);
//             this.invoiceNumber.textContent = item.number;
//             this.invoiceYear.textContent = new Date(item.dates.creation_date).getFullYear();
//             this.clientName.textContent = item.client_details.full_name;
//             this.clientEmail.textContent = item.client_details.email;
//             this.clientPhone.textContent = item.client_details.phone;
//             this.clientAddress =  item.client_details.address;
//             this.clientID =  item.client_details.id_number;
//             this.totalSum.textContent = item.amount.amount_requested;
//             this.totalLarge.textContent = item.amount.amount_requested;
//             this.currency.forEach((el) => el.textContent = item.currency);

//             if (item.amount.amount_requested >= 250 && item.amount.amount_requested <= 1000) {
//                 this.paymentClass.innerHTML = '"View"';
//             } else
//             if (item.amount.amount_requested > 1000 && item.amount.amount_requested <= 5000) {
//                 this.paymentClass.innerHTML = '"Basic"';
//             } else
//             if (item.amount.amount_requested > 5000 && item.amount.amount_requested <= 10000) {
//                 this.paymentClass.innerHTML = '"Basic PLUS"';
//             } else
//             if (item.amount.amount_requested > 10000 && item.amount_requested <= 15000 ) {
//                 this.paymentClass.innerHTML = '"Silver"';
//             } else
//             if (item.amount.amount_requested > 15000 && item.amount.amount_requested <= 25000 ) {
//                 this.paymentClass.innerHTML = '"Gold"';
//             } else
//             if (item.amount.amount_requested > 25000 && item.amount.amount_requested <= 80000 ) {
//                 this.paymentClass.innerHTML = '"Platinum"';
//             }
//         });


//         this.benefName = document.querySelector("#benefName");
//         this.benefAdress = document.querySelector("#benefAdress");
//         this.bankName = document.querySelector("#bankName");
//         this.bankAdress = document.querySelector("#bankAdress");
//         this.IBAN = document.querySelector("#IBAN");
//         this.SWIFT = document.querySelector("#SWIFT");
//         this.currencyBank = document.querySelector("#currency");
        

//         this.Bank.forEach((bank) => {
//             this.benefName.textContent = bank.beneficiary_name;
//             this.benefAdress.textContent = bank.beneficiary_address;
//             this.bankName.textContent = bank.name;
//             this.bankAdress.textContent = bank.bank_address;
//             this.SWIFT.textContent = bank.swift_bic;
//             this.bankLogo = document.querySelector(".bank-logo").src = bank.company_logo;
//             document.querySelector(".bankSite").innerHTML = bank.company_site;

//             if(this.currencyBank.textContent.trim() === "EUR"){
//                 this.IBAN.innerHTML = `IBAN EUR: ` + bank.iban_eur;
//             } else if (this.currencyBank.textContent.trim() === "USD") {
//                 this.IBAN.innerHTML = `IBAN USD: ` + bank.iban_usd;
//             }
//         }); 


//         this.Merchant.forEach((merchant) => {
//             this.background = merchant.specifications.background;
//             this.firstColor = merchant.specifications.first_color;
//             this.secondColor = merchant.specifications.second_color;
//             this.tagLine = merchant.specifications.tagline;
//         });
//         this.tableTh = document.querySelectorAll(".forBack");
//         this.tableTh.forEach((th) => th.style.backgroundColor = this.firstColor);
        

//     }

//     saveBanksInvoices = async () => {
//         this.number = this.getNumberInvoice();
         
//         this.Invoice = await this.getInvoices(this.number);
//         this.Invoice.forEach((item) => {
//             this.bankName = item.bank;
//             this.merchantName = item.merchant;
//         });

//         this.Bank = await this.getBank(this.bankName);
//         this.Merchant = await this.getMerchant(this.merchantName);
//         this.renderPage();
//     }

//     getMerchant = async (merchantName) => {
//         return  await fetch("http://18.216.223.81:3000/get-merchantByName", {
//                 method: "POST",
//                 body: JSON.stringify({"name" : merchantName}),
//                 headers:{'Content-Type': 'application/json'}
//                 })
//                 .then(res => {
//                     return res.json();
//                 }) 
//                 .catch(err => {
//                     console.log(err);
//                 });
//     }

//     getBank = async (bankName) => {
//         return  await fetch("http://18.216.223.81:3000/get-bankByName", {
//                 method: "POST",
//                 body: JSON.stringify({"name" : bankName}),
//                 headers:{'Content-Type': 'application/json'}
//                 })
//                 .then(res => {
//                     return res.json();
//                 }) 
//                 .catch(err => {
//                     console.log(err);
//                 });
//     }

//     getInvoices = async (number) => {
//         return  await fetch("http://18.216.223.81:3000/get-invoiceByNumber", {
//                 method: "POST",
//                 body: JSON.stringify({"number" : number}),
//                 headers:{'Content-Type': 'application/json'}
//                 })
//                 .then(res => {
//                     return res.json();
//                 }) 
//                 .catch(err => {
//                     console.log(err);
//                 });
//     }


//     render(){
//         this.getNumberInvoice();
//         this.saveBanksInvoices();
//     }
// }

// const invoice_ = new InvoicePreview();

function SaveAsPdf() {
    var api_endpoint = "https://selectpdf.com/api2/convert/";
    var api_key = "07414060-af55-4b55-bb90-db2da50e128b";
 
    var url = window.location.href; // current page
    console.log(url);
    var params = {
        key: api_key, 
        url: url,
        pdf_hide_elements: '*.downloadPDFbtn'
    }
 
    var xhr = new XMLHttpRequest();
    xhr.open('POST', api_endpoint, true);
    xhr.setRequestHeader("Content-Type", "application/json");
 
    xhr.responseType = 'arraybuffer';
 
    xhr.onload = function (e) {
        if (this.status == 200) {
            //console.log('Conversion to PDF completed ok.');
 
            var blob = new Blob([this.response], { type: 'application/pdf' });
            var url = window.URL || window.webkitURL;
            var fileURL = url.createObjectURL(blob);
            //window.location.href = fileURL;
 
            //console.log('File url: ' + fileURL);
 
            var fileName = "Document.pdf";
 
            if (navigator.appVersion.toString().indexOf('.NET') > 0) {
                // This is for IE browsers, as the alternative does not work
                window.navigator.msSaveBlob(blob, fileName);
            }
            else {
                // This is for Chrome, Firefox, etc.
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = fileURL;
                a.download = fileName;
                a.click();
            }
        }
        else {
            //console.log("An error occurred during conversion to PDF: " + this.status);
            alert("An error occurred during conversion to PDF.\nStatus code: " + this.status + ", Error: " + String.fromCharCode.apply(null, new Uint8Array(this.response)));
        }
    };
 
    xhr.send(JSON.stringify(params));
}