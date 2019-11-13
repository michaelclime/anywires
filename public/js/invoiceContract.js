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
//         this.invNum = document.querySelector(".invNum");
//         this.invDate = document.querySelector(".invDate");
//         this.bankBenefName = document.querySelectorAll(".bankBenefName");
//         this.bankBenefAddress = document.querySelectorAll(".bankBenefAddress");
//         this.bankSite = document.querySelector(".bankSite");
//         this.invClientName = document.querySelectorAll(".invClientName");
//         this.invClientEmail = document.querySelectorAll(".invClientEmail");
//         this.invClientAdress = document.querySelector(".invClientAdress");

//         this.invNum.innerHTML = this.getNumberInvoice();
//         this.correctDate = new Date(this.Invoice[0].dates.creation_date);
//         this.invDate.innerHTML =  this.correctDate.getDate() + '/' + ( this.correctDate.getMonth()+ 1) + '/' +  this.correctDate.getFullYear();
//         this.bankBenefName.forEach( i => i.innerHTML = this.Bank[0].beneficiary_name);
//         this.bankBenefAddress.forEach( i => i.innerHTML = this.Bank[0].beneficiary_address);
//         this.bankSite.innerHTML = this.Bank[0].company_site;
//         this.invClientName.forEach( i => i.innerHTML = this.Invoice[0].client_details.full_name);
//         this.invClientEmail.forEach( i => i.innerHTML = this.Invoice[0].client_details.email);
//         this.invClientAdress = this.Invoice[0].client_details.address;
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
 
            var fileName = "Invoice-Preview.pdf";
 
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
    document.querySelector('.loadingGif').classList.add('hide');
}