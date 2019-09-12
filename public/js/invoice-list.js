class invoiceList {
    constructor(){
        this.ArrayLIst = [];
        this.btnExel = document.querySelector("#dowloadXls");
        this.clearFilterBtn = document.querySelector("#clearFilterBtn");
        this.showFilterBtn = document.querySelector("#showBtn");
        this.render();
    }

    saveXls = () => {
        // For hide not useless element XLS
        let col12 = document.querySelectorAll(".column12");
        col12.forEach((item) => item.style.display = "none");

        let col11 = document.querySelectorAll(".colum11");
        col11.forEach((item) => item.style.display = "none");

        setTimeout(() => {
            col12.forEach((item) => item.style.display = "table-cell");
            col11.forEach((item) => item.style.display = "table-cell");
        },10);
        // For hide not useless element XLS

        var tbl = document.getElementById('table-user');
        var wb = XLSX.utils.table_to_book(tbl, {
            sheet: "Invoice list table",
            display: true
        });

        var wbout = XLSX.write(wb, {bookType: "xlsx", bookSST: true, type: "binary"});
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'invoice_list.xlsx');
    }

    clearFilter = () => {
        this.selets = document.querySelectorAll("select");
        this.selets.forEach(item => item.value = "");
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.loadMerchants(LIST);
    }

    filterList = () => {
        this.status = document.querySelector("#filterStatus").value;
        this.bank = document.querySelector("#filterBank").value;
        this.merchant = document.querySelector("#filterMerchant").value;
        this.documents = document.querySelector("#filterDocuments").value;
        
        this.newArray = {};

        this.bank === "" ?  "" : this.newArray.Bank = this.bank;
        this.merchant === "" ?  "" : this.newArray.Merchant = this.merchant;
        this.status === "" ?  "" : this.newArray.Payment_status = this.status;
        this.documents === "" ? "" : this.newArray.Document = this.documents;

        this.result = LIST.filter(item => 
            Object.keys(this.newArray).every(key => 
                item[key] === this.newArray[key])
        );

        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";

        this.loadUsers(this.result);
    }

    checkDocuments = (doc) => {
        if(doc === "true"){
            return doc = `<i class="far fa-check-circle"></i>`;
        } else if(doc === "false"){
            return doc = `<i class="far fa-times-circle"></i>`;
        } else if(doc === "undefined"){
            return doc = `<i class="far fa-question-circle"></i>`;
        } else {
            return doc = `<img src="img/img_3975.png" alt="empty" width="20px" height="10px">`;
        }
    }

    saveLocalInvoices = async (array) => {
        array = await this.getInvoices();
        array.forEach((item) => {
            this.ArrayLIst.push(item);
        });
        console.log(this.ArrayLIst);
        this.loadInvoices(this.ArrayLIst);
    }

    getInvoices = async () => {
        return  await fetch("http://18.216.223.81:3000/getMerchants")
        // return  await fetch("http://localhost:3000/getInvoices")
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
    }

    getInvoiceMerch = async (id) => {
        // return await fetch("http://localhost:3000/getInvoiceMerchant", {
            return await fetch("http://18.216.223.81:3000/getInvoiceMerchant", {
                        method: "POST",
                        body: JSON.stringify({
                            "id": id
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

    getInvoiceBank = async (bank) => {
        // return await fetch("http://localhost:3000/getInvoiceBanks", {
            return await fetch("http://18.216.223.81:3000/getInvoiceBanks", {
                        method: "POST",
                        body: JSON.stringify({
                            "id": bank
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

    loadInvoices = (arr) => {
        this.container = document.getElementById("table-list");
        arr.forEach( async (item) => {
            var merchantId = await this.getInvoiceMerch(item.merchant);
            var bankId = await this.getInvoiceBank(item.bank);
            var color = "";
            item.Payment_status === "Available" ? color = "green" : "";
            item.Payment_status === "Declined" ? color = "red" : "";
            item.Payment_status === "Received" ? color = "blue" : "";

            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1">
                        <div class="createdTd">
                            <p class="green"><b>#${item.number}</b></p>
                            <p class="smallBoldText">${moment(item.dates.creation_date).format('ll')}</p>
                            <p>${moment(item.dates.creation_date).format("h:mm a")}</p>
                        </div>
                    </td> 
                    <td class="column2">
                        ${merchantId[0].name}
                    </td> 
                    <td class="column3">${item.client_details.full_name}</td> 
                    <td class="column4">
                        <div class="sentTd">
                            <p>${item.amount.amount_sent}</p>
                            <p class="yellow smallBoldText">${moment(item.dates.sent_date).format('ll')}</p>
                        </div>
                    </td> 
                    <td class="column5">${item.commissions}</td>
                    <td class="column6">
                        <div>
                            <p>${item.amount.amount_received}</p>
                            <p class="blue smallBoldText">${moment(item.dates.received_date).format('ll')}</p>
                        </div>
                    </td>
                    <td class="column7">${bankId[0].name}</td>
                    <td class="column8">
                        <p>${0}</p>
                        <p class="fiolet smallBoldText">${moment(item.dates.available_date).format('ll')}</p>
                    </td>
                    <td class="column9 ${color}">${item.status}</td>

                    <td class="column10">
                        <div class="documentsIcon">
                            <div>ID: ${this.checkDocuments(item.ID)}</div>
                            <div>Utility Bill: ${this.checkDocuments(item.Utility_Bill)}</div>
                            <div>Payment proof: ${this.checkDocuments(item.Payment_proof)}</div>
                            <div>Declaration: ${this.checkDocuments(item.Declaration)}</div>
                        </div>
                    </td>

                    <td class="column11">
                        <div class="previewIcons">
                            <i class="fas fa-file-alt"></i>
                            <i class="fas fa-file-signature"></i>
                            <i class="fas fa-file-invoice-dollar"></i>
                        </div>
                    </td>
                    
                    <td class="column12">
                        <button id="previewBtn">Preview</button>
                    </td>
            `;
        this.container.appendChild(this.userList);
        })
    }

    render(){
        this.saveLocalInvoices();
        this.showFilterBtn.addEventListener("click", this.filterList);
        this.clearFilterBtn.addEventListener("click", this.clearFilter);
        this.btnExel.addEventListener("click", this.saveXls);
    }
};

const userList = new invoiceList();


// const obj = { 
//     "number" : 1, 
//     "client_details" : { 
//         "full_name" : "Jack Wilson", 
//         "email" : "wilson@gmail.com", 
//         "phone" : "+4412345678", 
//         "address" : "Poland, general street 88A", 
//         "country" : "Poland", 
//         "id_number" : "AA2021948" 
//     },  
//     "type" : "c2b", 
//     "status" : "Requested", 
//     "merchant" : ObjectId("5d78ae0b55570e0b708a8b42"), 
//     "documents" : { 
//         "id" : [ ObjectId("5d78aea255570e0b708a8b43"), ObjectId("5d78aea955570e0b708a8b44") ], 
//         "payment_proof" : [ ObjectId("5d78aec455570e0b708a8b45"), ObjectId("5d78aec955570e0b708a8b46") ], 
//         "utility_bill" : [ ObjectId("5d78aef255570e0b708a8b47"), ObjectId("5d78aef655570e0b708a8b48") ], 
//         "declaration" : ObjectId("5d78b2e155570e0b708a8b49") 
//     },  
//      "dates" : { 
//         "creation_date" : ISODate("1999-12-31T22:00:00Z"), 
//         "sent_date" : ISODate("0000-01-01T00:00:00Z"), 
//         "received_date" : ISODate("0000-01-01T00:00:00Z"), 
//         "approved_date" : ISODate("1999-12-31T22:00:00Z"), 
//         "available_date" : ISODate("0000-01-01T00:00:00Z"), 
//         "declined_date" : ISODate("1999-12-31T22:00:00Z") 
//     }, 
//         "currency" : "EUR", 
//         "bank" : ObjectId("5d78b54955570e0b708a8b4a"), 
//         "amount" : { 
//             "amount_received" : 1000, 
//             "amount_sent" : 1000, 
//             "amount_approved" : 900 
//          }, 
//          "created_by" : "Jack Wilson", 
//          "commissions" : - 
//   }