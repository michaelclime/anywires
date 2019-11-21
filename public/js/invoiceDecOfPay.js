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

//     renderPage = () => {
//         this.bankLogo = document.querySelector(".bank-logo");
//         this.invClientCountry = document.querySelector(".invClientCountry");
//         this.invClientID = document.querySelector(".invClientID");
//         this.invBankBenefName = document.querySelectorAll(".invBankBenefName");
//         this.invoiceDate = document.querySelector(".invoiceDate");
//         this.invAmount = document.querySelector(".invAmount");
//         this.invoiceCurrency = document.querySelector(".invoiceCurrency");

//         this.bankLogo.src = this.Bank[0].company_logo
//         this.invClientCountry.innerHTML = this.Invoice[0].client_details.country;
//         if ( this.Invoice[0].client_details.id_number) {
//             this.invClientID.innerHTML = this.Invoice[0].client_details.id_number;
//         }
//         this.invBankBenefName.forEach( i => i.innerHTML = this.Bank[0].beneficiary_name);
//         this.correctDate = new Date(this.Invoice[0].dates.creation_date);
//         this.invoiceDate.innerHTML =  this.correctDate.getDate() + '/' + ( this.correctDate.getMonth()+ 1) + '/' +  this.correctDate.getFullYear();
//         this.invAmount.innerHTML = this.Invoice[0].amount.amount_sent;
//         this.invoiceCurrency.innerHTML = this.Invoice[0].currency;

//     }

//     loadPage = async () => {
//         this.number = this.getNumberInvoice();
         
//         this.Invoice = await this.getInvoices(this.number);
//         this.Bank = await this.getBank(this.Invoice[0].bank);
//         this.renderPage();
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
//         this.loadPage();
//     }
// }

// const invoice_ = new InvoicePreview();

function SaveAsPdf() {
    document.querySelector('.loadingGif').classList.remove('hide');
    var api_endpoint = "https://selectpdf.com/api2/convert/";
    var api_key = "6981bab0-31b1-44db-9ce6-1245fba8558c";
 
    var url = window.location.href; // current page

    var params = {
        key: api_key, 
        url: url,
        pdf_hide_elements: '*.downloadPDFbtn'
    }
 
    var xhr = new XMLHttpRequest();
    xhr.open('POST', api_endpoint, true);
    xhr.setRequestHeader("Content-Type", "application/json");
 
    xhr.responseType = 'arraybuffer';
 
    xhr.onload = async function (e) {
        if (this.status == 200) {
            //console.log('Conversion to PDF completed ok.');
            document.querySelector('.loadingGif').classList.add('hide');
            var blob = new Blob([this.response], { type: 'application/pdf' });
            var url = window.URL || window.webkitURL;
            var fileURL = url.createObjectURL(blob);
            //window.location.href = fileURL;
 
            //console.log('File url: ' + fileURL);
            const getInvoices = async (number) => {
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
 
            const getNumberInvoice = () => {
                var score = decodeURIComponent(location.search.substr(1)).split('&');
                score.splice(0, 1);
                var result = score[0];
                return result;
            }

            const number = getNumberInvoice();
            const Invoice = await getInvoices(number);
            const date = new Date();
            const dateNow = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

            var fileName = `DeclarationOfPayment №${Invoice[0].number}-${Invoice[0].client_details.full_name}-${Invoice[0].amount.amount_requested}-${dateNow}.pdf`;
 
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
            document.querySelector('.loadingGif').classList.add('hide');
            //console.log("An error occurred during conversion to PDF: " + this.status);
            alert("An error occurred during conversion to PDF.\nStatus code: " + this.status + ", Error: " + String.fromCharCode.apply(null, new Uint8Array(this.response)));
        }
    };
 
    xhr.send(JSON.stringify(params));
    
}