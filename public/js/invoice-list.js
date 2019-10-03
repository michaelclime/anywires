
class invoiceList {
    constructor(){
        
        this.curNumber = "";
        this.ArrayLIst = [];
        this.ArrayBanks = [];
        this.ArrayMerchants = []; 
        this.InvoiceNumbers = [];
        this.btnExel = document.querySelector("#dowloadXls");
        this.clearFilterBtn = document.querySelector("#clearFilterBtn");
        this.showFilterBtn = document.querySelector("#showBtn");
        this.btn_search = document.querySelector(".search-btn");
        this.containerPages = document.querySelector(".nextPage-block");
        this.bankFilter = document.querySelector("#filterBank");
        this.merchFilter = document.querySelector("#filterMerchant");
        this.creationDate = document.querySelector(".creationDate");
        this.receiveDate = document.querySelector(".receiveDate");
        this.currentUser = document.querySelector("#currentUser");
        this.addCommentBtn = document.querySelector("#addCommentBtn");
        this.firstPage = document.querySelector(".firstPage-block");
        this.firstPageImg = document.querySelector("#first-img");
        
        this.render();
    }

    renderViewInvoice = (obj) => {
        this.filter = document.querySelector(".filter");
        this.filter.style.display = "flex";
        this.filter.addEventListener("click", (event) => {
            event.target === this.filter ? this.filter.style.display = "none" : "";
        });

        var statusColor = "";
        if(obj[0].status === "Sent") statusColor = "#FFBB33";
        if(obj[0].status === "Requested") statusColor = "black";
        if(obj[0].status === "Received") statusColor = "#7491F2";
        if(obj[0].status === "Approved") statusColor = "#83C9A0";
        if(obj[0].status === "Available") statusColor = "#00C851";

        this.invoiceNumber = document.querySelector("#invoiceNumber").innerHTML = obj[0].number;
        this.currentStatus = document.querySelector(".currentStatus");
        this.currentStatus.innerHTML = obj[0].status;
        this.currentStatus.style.color = statusColor;

        this.invoiceMerchant = document.querySelector("#invoiceMerchant").innerHTML = obj[0].merchant;
        this.invoiceBank = document.querySelector("#invoiceBank").innerHTML = obj[0].bank;
        this.clientName = document.querySelector("#clientFullName").innerHTML = obj[0].client_details.full_name;

        this.requestFee = document.querySelector("#requestFee").innerHTML = obj[0].amount.amount_requested;

        var currency = "";
        obj[0].currency === "EUR" ? currency = "€" : currency = "$";
        this.invoiceCurrency = document.querySelector("#invoiceCurrency").innerHTML = currency;

        // Cleaning docs table before new docs
        this.tableDocs = document.querySelector("#table-docs").innerHTML = "";
        this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";

        // Check and render docs
        this.tableDocsRender(obj[0].documents.id);
        this.tableDocsRender(obj[0].documents.payment_proof);
        this.tableDocsRender(obj[0].documents.utility_bill);
        this.tableDocsRender(obj[0].documents.declaration);
        
        // Render all Comments
        this.tableCommentsRender(obj[0].comments);

        // Number of Current Invoice
        this.curNumber = obj[0].number;

        // Add Comments Button Action
    }

    postCommet = async (number, data, create_by) => {
        return  await fetch("http://18.216.223.81:3000/postComment", {
            // return  await fetch("http://localhost:3000/postComment", {
                method: "POST",
                body: JSON.stringify({
                    number,
                    data,
                    create_by
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

    addComment = async () => {
        // Remove spaces form data
        var data = document.querySelector("#commentText").value.trim();
        // If not empty than
        if (data) {
            // Get current User
            var created_by = this.currentUser.textContent.trim();
            // Post new comment
            await this.postCommet(this.curNumber, data, created_by);

            // Render without post request
            this.tableComments = document.querySelector("#tableTbody-comments");
            var tableTr = document.createElement("tr");
            tableTr.innerHTML = `
                <td>
                    <div>
                        <div>${created_by}</div>
                        <div class="comentsDate">${moment(new Date()).format('lll')}</div>
                    </div>
                </td>
                <td>${data}</td>
            `;
            this.tableComments.appendChild(tableTr);
        }
        document.querySelector("#commentText").value = "";
    }

    tableCommentsRender = (arr) => {
        // Table wich we need to render
        this.tableComments = document.querySelector("#tableTbody-comments");
        // Check if empty
        var ifEmpty = this.checkIsEmptyObj(arr);
        if(!ifEmpty){
            arr.forEach((item) => {
                var tableTr = document.createElement("tr");
                tableTr.innerHTML = `
                    <td>
                        <div>
                            <div>${item.created_by}</div>
                            <div class="comentsDate">${moment(item.creation_date).format('lll')}</div>
                        </div>
                    </td>
                    <td>${item.message}</td>
                `;

                this.tableComments.appendChild(tableTr);
            });
        }
    }

    tableDocsRender = (arr) => {
        // Table wich we need to render
        this.tableDocs = document.querySelector("#table-docs");
        // Check if empty
        var ifEmpty = this.checkIsEmptyObj(arr);
        // If not empty render arr
        if(!ifEmpty){
            arr.forEach( async (item) => {
                var docArr = await this.getDocs({}, item.id);
                docArr.forEach((doc) => {
                    var tableTr = document.createElement("tr");
                    tableTr.innerHTML = `
                        <td>${doc.creator}</td> 
                        <td>${doc.type}</td> 
                        <td>${doc.status}</td> 
                        <td>
                            <span id="docGood"><i class="far fa-check-circle"></i></span>
                            <span id="docBad"><i class="far fa-times-circle"></i></span>
                        </td>
                        <td> <button id="docPreview">Preview</button> </td>
                    `;
                    this.tableDocs.appendChild(tableTr);
                });
            });
        }
    }

    getDocs = async (filter, id) => {
         return  await fetch("http://18.216.223.81:3000/getDocs", {
            // return  await fetch("http://localhost:3000/getDocs", {
                method: "POST",
                body: JSON.stringify({
                    filter,
                    id
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

    viewInvoice = async () => {
        this.tableTd = document.querySelectorAll(".view");
        this.tableTd.forEach((td) => {

            td.addEventListener("click", async () => {
                // Remove all filters
                this.filter = {};
                // Get number of invoice
                this.number = td.parentElement.children[0].children[0].children[0].children[0].textContent.split("#")[1];
                // Get invoice
                this.currentInvoice = await this.getInvoices(0, {"number": this.number} ); 
                // Render popup window
                this.renderViewInvoice(this.currentInvoice);
            });

        });
    }

    previewInvoice = (event) => {
        var number = event.target.closest("tr").children[0].children[0].children[0].children[0].textContent.split("#");
        window.open("http://18.216.223.81:3000/invoice-preview?&" + number[1], '_blank');
        // 18.216.223.81 // localhost:3000
    }

    filtersData = () => {
        var merchList = [];
        var bankList = [];
        this.ArrayBanks.forEach((bank) => bankList.push(bank.name));
        this.ArrayMerchants.forEach((merchant) => merchList.push(merchant.name));
        
        for (let i = 0; i < bankList.length; i++) {
            this.renderFilters(this.bankFilter, bankList[i]);
        }
        for (let m = 0; m < merchList.length; m++) {
            this.renderFilters(this.merchFilter, merchList[m]);
        }
    }

    renderFilters = (filter, name) => {
        this.option = document.createElement("option");
        this.option.value = name;
        this.option.textContent = name;
        filter.appendChild(this.option);
    }

    searchFunction = async () => {
        var check = document.querySelector('.input-search').value;

        const filter = { $text: { $search: check } };

          if(check){
            const lengthInvoice = await this.getNumberOfinvoices(filter);
            const filterList = await this.getInvoices(0, filter);

            // Очищаємо таблицю
            this.container = document.getElementById("table-list");
            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            this.countNextPage(filterList, lengthInvoice.numbers);
          }

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

        var tbl = document.getElementById('table-invoices');
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
        this.creationDate.value = "";
        this.receiveDate.value = "";
        this.searchInput = document.querySelector('.input-search').value = "";
        this.selets = document.querySelectorAll("select");
        this.selets.forEach(item => item.value = "");
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";

        this.countNextPage(this.ArrayLIst, this.InvoiceNumbers[0]);
        this.documentsStatus();
    }

    checkIsEmptyObj = (obj) => {
        for (let key in obj) {
            return false; // wrong
        }
        return true; // is epmty
    }

    dateInRange = (data, first, end) => {
        if (end === false) {
            return +first === +data ? console.log(true) : console.log(false);
        } else {
            return +first <= +data && +data <= +end ? console.log(true) : console.log(false);
        }
        // this.dateInRange(new Date("9/19/2019"), new Date("9/17/2019") , new Date("9/25/2019"));
        // this.dateInRange(new Date("9/19/2019"), new Date("9/17/2019") , false);
    }

    filterList = async () => {
        this.filter = {};
        this.status = document.querySelector("#filterStatus").value;
        this.bank = this.bankFilter.value;
        this.merchant = this.merchFilter.value;
        this.documents = document.querySelector("#filterDocuments").value;

        // Додаємо критеріє відбору в об"єкт
        this.status ? this.filter.status = this.status : "";
        this.bank ? this.filter.bank = this.bank : "";
        this.merchant ? this.filter.merchant = this.merchant : "";

        // }) // Знайти всі документи в яких id = "Approved"
        const Approved = { 
            "documents.id": {"$elemMatch": {"status":"Approved"}},
            "documents.payment_proof": {"$elemMatch": { "status":"Approved"}},
            "documents.utility_bill": {"$elemMatch": {"status":"Approved" }},
            "documents.declaration": {"$elemMatch": {"status":"Approved"}}};

        // Знайти всі документи в яких хоча б один "Non-Verified"
        const non_ver = { $or: [
            {"documents.id": {"$elemMatch": {"status":"Non-Verified"}}},
            {"documents.payment_proof": {"$elemMatch": { "status":"Non-Verified"}}},
            {"documents.utility_bill": {"$elemMatch": { "status":"Non-Verified"}}},
            {"documents.declaration": {"$elemMatch": {"status":"Non-Verified"}}}
            
        ]};
        // Знайти всі документи в яких хоча б один EMPTY
        const empty = { $or: [
            {"documents.id": { $exists: true}, "documents.id" :{$size: 0}},
            {"documents.payment_proof": { $exists: true}, "documents.payment_proof" :{$size: 0}},
            {"documents.utility_bill": { $exists: true}, "documents.utility_bill" :{$size: 0}},
            {"documents.declaration": { $exists: true}, "documents.declaration" :{$size: 0}}
            
        ]};

        // Перевірка на дату створення START.
        this.firstCreat = "";
        this.secondCreat = "";

        if(this.creationDate.value.length > 20){
            var DATE = this.creationDate.value.split("—");
            this.firstCreat = new Date(DATE[0].trim());
            this.secondCreat = new Date(DATE[1].trim());

        } else if(this.creationDate.value.length <= 12 && this.creationDate.value.length !== 0){
            var DATE = this.creationDate.value;
            this.firstCreat = new Date(DATE.trim());
            this.secondCreat = false;
        }
        // Перевірка на дату створення END.

        this.firstRec = "";
        this.secondRec = "";

        // Checking Received Date START.
        if(this.receiveDate.value.length > 20){
            var DATE = this.receiveDate.value.split("—");
            this.firstRec = new Date(DATE[0].trim());
            this.secondRec = new Date(DATE[1].trim());

        } else if(this.receiveDate.value.length <= 12 && this.receiveDate.value.length !== 0){
            var DATE = this.receiveDate.value;
            this.firstRec = new Date(DATE.trim());
            this.secondRec = false;
        }
        // Checking Received Date END.

        if(this.documents !== ""){
            this.documents.trim() === "All verified" ? Object.assign(this.filter, Approved): "";
            this.documents.trim() === "Pending verification" ? Object.assign(this.filter, non_ver): "";
            this.documents.trim() === "Without documents" ? Object.assign(this.filter, empty): "";
        }

        const lengthInvoice = await this.getNumberOfinvoices(this.filter, this.firstCreat, this.secondCreat, this.firstRec, this.secondRec);
        const filterList = await this.getInvoices(0, this.filter, this.firstCreat, this.secondCreat, this.firstRec, this.secondRec);

        // Table cleaning
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";

        this.countNextPage(filterList, lengthInvoice.numbers);
    }

    documentsStatus = () => {
        this.ArrayLIst.forEach((obj) => {
            var ID = obj.documents.id;
            var Utility_bill = obj.documents.utility_bill;
            var Paymant_proof = obj.documents.payment_proof;
            var Declaration = obj.documents.declaration;

                function check(arr) {
                    if(arr.length === 1){
                        return arr[0].status;

                    } else if (arr.length > 1) {
                        var check = [];
                        arr.forEach((item) => check.push(item.status));

                        var approved = check.some((el) => el === "Approved");
                        var non_verAll = check.every((el) => el === "Non-Verified");
                        var declinedAll = check.every((el) => el === "Declined");
                        var non_verOne = check.some((el) => el === "Non-Verified");
                        var declinedOne = check.some((el) => el === "Declined");

                            if (approved === true) {
                                return "Approved";

                            } else if (declinedAll === true) {
                                return "Declined";

                            } else if (non_verAll === true) {
                                return "Non-Verified";

                            } else if (non_verOne === true && declinedOne === true && approved === false) {
                                return "Non-Verified";
                            } else {
                                return "Empty";
                            }

                    } else if (arr.length === 0 || arr.length === undefined) {
                        return "Empty";
                    }
                };

            var result = [];
            result.push(check(ID), check(Utility_bill), check(Paymant_proof), check(Declaration));
            var approvedRes = result.every((item) => item === "Approved");
            var emptyRes = result.some((item) => item === "Empty");
            var non_verRes = result.some((item) => item === "Non-Verified");

            if (approvedRes === true) {
                obj.filter_status = "All verified";

            } else if (emptyRes === true) {
                obj.filter_status = "Without documents";

            } else if (non_verRes === true) {
                obj.filter_status = "Pending verification";
            }
        });
    }

    checkDocuments = (doc) => {
        if(doc.length === 1) {
            doc[0].status === undefined ? doc = "" : doc = doc[0].status;

        } else if(doc.length === 0){
            doc = "";

        } else if(doc.length > 1) {
            var check = [];
            doc.forEach((item) => check.push(item.status));

            var declined = check.every((item) => item === "Declined");
            if (declined === false) {
                var result = check.some(item => item === "Approved");
                result === true ? doc = "Approved" : doc = "Non-Verified";
            } else {
                doc = "Declined";
            }
        } 
        // Drawing docs images
            if(doc === "Approved"){
                return doc = `<i class="far fa-check-circle"></i>`;
            } else if(doc === "Declined"){
                return doc = `<i class="far fa-times-circle"></i>`;
            } else if(doc === "Non-Verified"){
                return doc = `<i class="far fa-question-circle"></i>`;
            } else if(doc === ""){
                return doc = `<img src="img/img_3975.png" alt="empty" width="20px" height="10px">`;
            }
    }

    checkClickedPages = (event) => {
        this.buttonsPage = document.querySelectorAll(".nextPage-btn");
        this.buttonsPage.forEach((btn) => {
            event === +(btn.textContent) ? btn.classList.add("highlight") : btn.classList.remove("highlight");;
        });
    };

    renderNextPage = (page) => {
        this.buttonNext = document.createElement("button");
        this.buttonNext.textContent = page;
        this.buttonNext.classList.add("nextPage-btn");
        this.containerPages.appendChild(this.buttonNext);
    }

    countNextPage = (arr, numbersOfpages) => {
        this.loadInvoices(arr);
        var lastPage = numbersOfpages / 10;

        if (lastPage > 3) {
            lastPage !== parseInt(lastPage) ? lastPage = parseInt(lastPage) + 1 : "";
            for (let i = 1; i < 4; i++) {
                this.renderNextPage([i]);
            }
            this.dotts = document.createElement("span");
            this.dotts.textContent = "...";
            this.dotts.classList.add("dotts");
            this.containerPages.appendChild(this.dotts);
            this.renderNextPage(lastPage);
        } else {
            for (let i = 0; i < lastPage; i++) {
                this.renderNextPage([i+1]);
            }
        }

        if (!arr.length) return "";
        
        var buttonsPage = document.querySelectorAll(".nextPage-btn");
        buttonsPage[0].classList.add("highlight");
        buttonsPage.forEach((btn) => {
            
            btn.addEventListener("click", async (event) => {
                let currentEvent = +(event.target.textContent);

                let listNumber = ((currentEvent*10)-10);

                this.nextList = await this.getInvoices(listNumber, this.filter, this.firstCreat, this.secondCreat, this.firstRec, this.secondRec);
                
                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";

                this.loadInvoices(this.nextList);

                if( +(btn.textContent) === lastPage && +(btn.textContent) > 1){
                    btn.closest("div").children[0].textContent = lastPage - 3;
                    btn.closest("div").children[1].textContent = lastPage - 2;
                    btn.closest("div").children[2].textContent = lastPage - 1;

                } else if (+(btn.textContent) !== 1 && +(btn.textContent) > +(btn.closest("div").children[1].innerHTML) && +(btn.textContent) < lastPage-1) {
                    var first =  btn.closest("div").children[0].textContent;
                    var second = btn.closest("div").children[1].textContent;
                    var third = btn.closest("div").children[2].textContent;

                    btn.closest("div").children[0].textContent = Number(first)+ 1;
                    btn.closest("div").children[1].textContent = Number(second) + 1;
                    btn.closest("div").children[2].textContent = Number(third) + 1;

                } else if ( +(btn.textContent) !== 1 && +(btn.textContent) < +(btn.closest("div").children[1].innerHTML) && +(btn.textContent) > 1) {
                    var first =  btn.closest("div").children[0].textContent;
                    var second = btn.closest("div").children[1].textContent;
                    var third = btn.closest("div").children[2].textContent;

                    btn.closest("div").children[0].textContent = Number(first) - 1;
                    btn.closest("div").children[1].textContent = Number(second) - 1;
                    btn.closest("div").children[2].textContent = Number(third) - 1;

                } else if( +(btn.textContent) === 1 ){}
                
                this.checkClickedPages(currentEvent);
            });
        });

        this.firstPage.style.display = "flex";
    }

    getMerchants = async () => {
        return  await fetch("http://18.216.223.81:3000/getMerchants")
        // return  await fetch("http://localhost:3000/getMerchants")
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
   }

    saveLocakBanksAndMerchants = async () => {
        this.arrayBanks = await this.getBanks();
        this.arrayBanks.forEach((bank) => this.ArrayBanks.push(bank));

        this.arrayMerch = await this.getMerchants();
        this.arrayMerch.forEach((merchant) => this.ArrayMerchants.push(merchant));
        this.filtersData();
    }

    getBanks = async () => {
         return  await fetch("http://18.216.223.81:3000/getBanks")
        //  return  await fetch("http://localhost:3000/getBanks")
         .then(res => {
             return res.json();
         }) 
         .catch(err => {
             console.log(err);
         });
    }

    saveLocalInvoices = async () => {
        // Отримуємо кількість інвойсів та записуємо їх в глобальну змінну. 
        this.number = await this.getNumberOfinvoices();
        this.InvoiceNumbers.push(this.number.numbers);
        

        this.array = await this.getInvoices(0);
        this.array.forEach((item) => {
            this.ArrayLIst.push(item);
        });
        this.countNextPage(this.ArrayLIst, this.InvoiceNumbers[0]);
        this.documentsStatus();
        
    }

    getInvoices = async (count, filter, firstCr, secondCr, firstRe, secondRe) => {
        return  await fetch("http://18.216.223.81:3000/getPart-Invoices", {
        // return  await fetch("http://localhost:3000/getPart-Invoices", {
            method: "POST",
            body: JSON.stringify({
                numbers: count, 
                filter,
                firstCr: firstCr,
                secondCr: secondCr,
                firstRe: firstRe,
                secondRe: secondRe
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

    getNumberOfinvoices = async (filter, firstCr, secondCr, firstRe, secondRe) => {
        return  await fetch("http://18.216.223.81:3000/getNumber-Invoices", {
        // return  await fetch("http://localhost:3000/getNumber-Invoices", {
            method: "POST",
            body: JSON.stringify({
                filter,
                firstCr: firstCr,
                secondCr: secondCr,
                firstRe: firstRe,
                secondRe: secondRe
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

    checkDate = (data) => {
        return data === "" ? data = "mm/dd/yyyy" : data = moment(data).format('ll');
    }

    loadInvoices = (Arr) => {
        this.container = document.getElementById("table-list");
        Arr.forEach((item) => {
            var currency = ""; item.currency === "EUR" ? currency = "€" : currency = "$";
            var color = "";
            var emptyImg = `<img src="img/img_3975.png" alt="empty" width="20px" height="10px">`;
            item.status === "Approved" ? color = "green" : "";
            item.status === "Declined" ? color = "red" : "";
            item.status === "Received" ? color = "blue" : "";
            item.status === "Sent" ? color = "yellow" : "";

            var docs = "documents" in item;

            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1 view">
                        <div class="createdTd">
                            <p class="green"><b class="number">#${item.number}</b></p>
                            <p class="smallBoldText">${this.checkDate(item.dates.creation_date)}</p>
                            <p>${moment(item.dates.creation_date).format("h:mm a")}</p>
                        </div>
                    </td> 
                    <td class="column2 view">
                        ${item.merchant}
                    </td> 
                    <td class="column3 view">${item.client_details.full_name}</td> 
                    <td class="column4 view">
                        <div class="sentTd">
                            <p>${currency}${item.amount.amount_sent}</p>
                            <p class="yellow smallBoldText">${this.checkDate(item.dates.sent_date)}</p>
                        </div>
                    </td> 
                    <td class="column5 view">${item.commissions}</td>
                    <td class="column6 view">
                        <div>
                            <p>${currency}${item.amount.amount_received}</p>
                            <p class="blue smallBoldText">${this.checkDate(item.dates.received_date)}</p>
                        </div>
                    </td>
                    <td class="column7 view">${item.bank}</td>
                    <td class="column8 view">
                        <p>${currency}${0}</p>
                        <p class="fiolet smallBoldText">${this.checkDate(item.dates.available_date)}</p>
                    </td>
                    <td class="column9 ${color} view"><strong>${item.status}</strong></td>

                    <td class="column10">
                        <div class="documentsIcon">
                            <div>ID: ${docs === false ? emptyImg : this.checkDocuments(item.documents.id)}</div>
                            <div>Utility Bill: ${docs === false ? emptyImg : this.checkDocuments(item.documents.utility_bill)}</div>
                            <div>Payment proof: ${docs === false ? emptyImg : this.checkDocuments(item.documents.payment_proof)}</div>
                            <div>Declaration: ${docs === false ? emptyImg : this.checkDocuments(item.documents.declaration)}</div>
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
                        <button target="_blank" class="previewBtn">Preview</button>
                    </td>
            `;
        this.container.appendChild(this.userList);
        });
        this.buttonsPreview = document.querySelectorAll(".previewBtn");
        this.buttonsPreview.forEach((btn) => btn.addEventListener("click", this.previewInvoice));
        this.viewInvoice();
    }

    render(){
        this.saveLocalInvoices();
        this.saveLocakBanksAndMerchants();
        this.showFilterBtn.addEventListener("click", this.filterList);
        this.clearFilterBtn.addEventListener("click", this.clearFilter);
        this.btnExel.addEventListener("click", this.saveXls);
        this.btn_search.addEventListener("click", this.searchFunction);
        this.addCommentBtn.addEventListener("click", this.addComment);
        this.firstPageImg.addEventListener("click", this.clearFilter);
    }
};

const userList = new invoiceList();


// Alert modal window
const alertWindow = document.querySelector('.alert');
if (alertWindow) {
    alertWindow.addEventListener("click", (event) => {
        event.target === alertWindow ? alertWindow.style.display = "none" : "";
    });
};

// const obj = {
//     "number":1,
//     "client_details":{
//         "full_name":"Jack Wilson",
//         "email":"wilson@gmail.com",
//         "phone":"+4412345678",
//         "address":"Poland, general street 88A",
//         "country":"Poland",
//         "id_number":"AA2021948"
//     },
//     "type":"c2b",
//     "status":"Requested",
//     "merchant":"Merchant 1",
//     "documents":{
//         "id":[{"id":"5d809c3d63374a633890c3f0","status":"Approved"},{"id":"5d809c64b4725c6338e12512","status":"Declined"}],
//         "payment_proof":[{"id":"5d809c77b4725c6338e12513","status":"Approved"}],"utility_bill":[{"id":"5d809cb1b4725c6338e12515","status":"Non-Verified"}],
//         "declaration":[{"id":"5d809c95b4725c6338e12514","status":"Approved"}]
//     },
//     "dates":{
//         "creation_date":"1999-12-31T22:00:00.000Z",
//         "sent_date":"0000-01-01T00:00:00.000Z",
//         "received_date":"0000-01-01T00:00:00.000Z",
//         "approved_date":"1999-12-31T22:00:00.000Z",
//         "available_date":"0000-01-01T00:00:00.000Z",
//         "declined_date":"1999-12-31T22:00:00.000Z"
//     },
//     "currency":"EUR",
//     "bank":"Wilson Bank",
//     "amount":{"amount_received":1000,"amount_sent":1000,"amount_approved":900,"amount_requested":1100,"amount_available":0},
//     "created_by":{"name":"Michael Clime","id":"5d78f4a72aef540757d6aa4f"},
//     "commissions":"",
//     "comments":[{"created_by":"Michael Clime","creation_date":"1999-12-31T22:00:00.000Z","message":"Invoice #1 for 1100 EUR was Requested!"}]}
