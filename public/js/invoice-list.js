const LIST = [{
    Created: "Jul 31, 2019",
    invoice_number: "#3451",
    Merchant: "GreatFxpro",
    Name: "Margita Winther",
    Sent: "€5000", 
    Sent_date:"Aug 18, 2019",
    Bank_fee: "€0",
    Received: "€5000",
    Received_date: "Aug 19, 2019",
    Bank: "BNP Poland (EUR) VTK",
    Available: "€500",
    Payment_status: "Available",
    ID: "true",
    Utility_Bill: "false",
    Payment_proof: "true",
    Declaration: "undefined"
},{
    Created: "Jul 31, 2019",
    invoice_number: "#3452",
    Merchant: "BU",
    Name: "Jette Odderskov",
    Sent: "€5000", 
    Sent_date:"Aug 9, 2019",
    Bank_fee: "€0",
    Received: "€5000",
    Received_date: "Aug 10, 2019",
    Bank: "DE Transferwise FinEdu EUR",
    Available: "€500",
    Payment_status: "Declined",
    ID: "",
    Utility_Bill: "",
    Payment_proof: "",
    Declaration: "",
    Document: "Without documents"
},{
    Created: "Jul 31, 2019",
    invoice_number: "#3453",
    Merchant: "CPM24",
    Name: "Mariella Bonnier",
    Sent: "€5000", 
    Sent_date:"Jul 8, 2019",
    Bank_fee: "€0",
    Received: "€5000",
    Received_date: "Aug 9, 2019",
    Bank: "BNP Poland (EUR) VTK",
    Available: "€500",
    Payment_status: "Received",
    ID: "false",
    Utility_Bill: "",
    Payment_proof: "false",
    Declaration: "false",
    Document: "Pending verification"
},{
    Created: "Jul 31, 2019",
    invoice_number: "#3454",
    Merchant: "FinixCapital",
    Name: "JJette Odderskov",
    Sent: "€5000", 
    Sent_date:"Jul 16, 2019",
    Bank_fee: "€100",
    Received: "€5000",
    Received_date: "Aug 17, 2019",
    Bank: "BNP Poland (EUR) VTK",
    Available: "€500",
    Payment_status: "Requested",
    ID: "true",
    Utility_Bill: "true",
    Payment_proof: "true",
    Declaration: "true",
    Document: "All verified"
},{
    Created: "Jul 31, 2019",
    invoice_number: "#3251",
    Merchant: "CMP",
    Name: "Yastrebtsova Natalia",
    Sent: "€5000", 
    Sent_date:"Jul 11, 2019",
    Bank_fee: "€0",
    Received: "€5000",
    Received_date: "Jul 12, 2019",
    Bank: "DE Transferwise FinEdu EUR",
    Available: "€500",
    Payment_status: "Declined",
    ID: "",
    Utility_Bill: "",
    Payment_proof: "",
    Declaration: "",
    Document: "Without documents"
},{
    Created: "Jul 31, 2019",
    invoice_number: "#1241",
    Merchant: "CMP",
    Name: "Jack Wilson",
    Sent: "€5000", 
    Sent_date:"Jul 18, 2019",
    Bank_fee: "€0",
    Received: "€5000",
    Received_date: "Jul 19, 2019",
    Bank: "BNP Poland (EUR) VTK",
    Available: "€500",
    Payment_status: "Received",
    ID: "false",
    Utility_Bill: "",
    Payment_proof: "false",
    Declaration: "false",
    Document: "Pending verification"
},{
    Created: "Jul 31, 2019",
    invoice_number: "#5478",
    Merchant: "CK",
    Name: "Rudi Laukas",
    Sent: "€5000", 
    Sent_date:"Jul 1, 2019",
    Bank_fee: "€100",
    Received: "€5000",
    Received_date: "Jul 2, 2019",
    Bank: "BNP Poland (EUR) VTK",
    Available: "€500",
    Payment_status: "Requested",
    ID: "true",
    Utility_Bill: "true",
    Payment_proof: "true",
    Declaration: "true",
    Document: "All verified"
}];

class invoiceList {
    constructor(){
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
        this.loadUsers(LIST);
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

    loadUsers(arr){
        this.container = document.getElementById("table-list");
        arr.forEach((item) => {
            var color = "";
            item.Payment_status === "Available" ? color = "green" : "";
            item.Payment_status === "Declined" ? color = "red" : "";
            item.Payment_status === "Received" ? color = "blue" : "";

            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1">
                        <div class="createdTd">
                            <p class="green"><b>${item.invoice_number}</b></p>
                            <p class="smallBoldText">${item.Created}</p>
                            <p>2:47 pm</p>
                        </div>
                    </td> 
                    <td class="column2">${item.Merchant}</td> 
                    <td class="column3">${item.Name}</td> 
                    <td class="column4">
                        <div class="sentTd">
                            <p>${item.Sent}</p>
                            <p class="yellow smallBoldText">${item.Sent_date}</p>
                        </div>
                    </td> 
                    <td class="column5">${item.Bank_fee}</td>
                    <td class="column6">
                        <div>
                            <p>${item.Received}</p>
                            <p class="blue smallBoldText">${item.Received_date}</p>
                        </div>
                    </td>
                    <td class="column7">${item.Bank}</td>
                    <td class="column8">
                        <p>${item.Available}</p>
                        <p class="fiolet smallBoldText">Aug 19, 2019</p>
                    </td>
                    <td class="column9 ${color}">${item.Payment_status}</td>

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
        this.loadUsers(LIST);
        this.showFilterBtn.addEventListener("click", this.filterList);
        this.clearFilterBtn.addEventListener("click", this.clearFilter);
        this.btnExel.addEventListener("click", this.saveXls);
    }
};

const userList = new invoiceList();

