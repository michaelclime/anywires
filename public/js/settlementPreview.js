
function SaveAsPdf() {
    document.querySelector('.loadingGif').classList.remove('hide');

    var api_endpoint = "https://selectpdf.com/api2/convert/";
    var api_key = "cc21c1f1-502c-43a3-b6bc-83006301e204";
 
    var url = window.location.href; // current page
    console.log();
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
 
            const getSettlements = async (number) => {
                return  await fetch("http://18.216.223.81:3000/getSettlementById", {
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

            const getIdSettlement = () => {
                var score = decodeURIComponent(location.search.substr(1)).split('&');
                score.splice(0, 1);
                var result = score[0];
                return result;
            }

            const number = getIdSettlement();
            const Settlement = await getSettlements(number);
            const date = new Date();
            const dateNow = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

            var fileName = `Settlement №${Settlement[0].number}-${Settlement[0].client_details.full_name}-${Settlement[0].amount.amount_requested}-${dateNow}.pdf`;
 
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