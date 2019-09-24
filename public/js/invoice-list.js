
class invoiceList {
    constructor(){
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
        
        this.render();
    }

    previewInvoice = (event) => {
        var number = event.target.closest("tr").children[0].children[0].children[0].children[0].textContent.split("#");
        window.open("http://localhost:3000/invoice-preview?&" + number[1], '_blank');
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
        // var check = document.querySelector('.input-search').value;
        // var result = [];
        // this.ArrayLIst.forEach((obj) => {

        //     var name = obj.client_details.full_name.toLowerCase().split(" ");
        //     var number = obj.number.toString().split(" ");

        //     for (let i = 0; i < name.length; i++) {

        //         for (let k = 0; k < check.length; k++) {
        //             check[k] === name[i] ? result.push(obj) : "";
        //             check[k] === number[i] ? result.push(obj) : "";
        //         }

        //     }

        // });
        
        // this.container.innerHTML = "";
        // this.containerPages.innerHTML = "";

        // if (result.length) return this.countNextPage(result);
        var check = document.querySelector('.input-search').value;

        const filter = {
            $text: { $search: check }
        };

          if(check){
            const lengthInvoice = await this.getNumberOfinvoices(filter);
            const filterList = await this.getInvoices(0, filter);

            // Очищаємо таблицю
            this.container = document.getElementById("table-list");
            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            this.countNextPage(filterList, lengthInvoice.numbers, filter);
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
        this.status = document.querySelector("#filterStatus").value;
        this.bank = this.bankFilter.value;
        this.merchant = this.merchFilter.value;
        this.documents = document.querySelector("#filterDocuments").value;
        var filterCheck = {};

        // Додаємо критеріє відбору в об"єкт
        this.status ? filterCheck.status = this.status : "";
        this.bank ? filterCheck.bank = this.bank : "";
        this.merchant ? filterCheck.merchant = this.merchant : "";

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
        var firstDate = "";
        var secondDate = "";

        if(this.creationDate.value.length > 20){
            const DATE = this.creationDate.value.split("—");
            firstDate = new Date(DATE[0].trim());
            secondDate = new Date(DATE[1].trim());

        } else if(this.creationDate.value.length <= 12 && this.creationDate.value.length !== 0){
            const DATE = this.creationDate.value;
            firstDate = new Date(DATE.trim());
            secondDate = false;
            console.log(firstDate);
        }
        
        //Перевірка на дату створення END.

        if(this.documents !== ""){
            this.documents.trim() === "All verified" ? Object.assign(filterCheck, Approved): "";
            this.documents.trim() === "Pending verification" ? Object.assign(filterCheck, non_ver): "";
            this.documents.trim() === "Without documents" ? Object.assign(filterCheck, empty): "";
        }

        const lengthInvoice = await this.getNumberOfinvoices(filterCheck, firstDate, secondDate);
        const filterList = await this.getInvoices(0, filterCheck, firstDate, secondDate);

        // Очищаємо таблицю
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";

        this.countNextPage(filterList, lengthInvoice.numbers, filterCheck);
        


        
        // this.documents = document.querySelector("#filterDocuments").value;
        // var filterCheck = [];

        // // Присвоюємо дані для поля Receive date START.
        // if(this.receiveDate.value.length > 20){
        //     this.DATErec = this.receiveDate.value.split("—");
        //     this.receiveDateStart =  new Date((new Date(this.DATErec[0].trim()).getMonth()+1) +"/"+ (new Date(this.DATErec[0].trim()).getDate()) +"/"+ (new Date(this.DATErec[0].trim()).getFullYear()));
        //     this.receiveDateEnd = new Date((new Date(this.DATErec[1].trim()).getMonth()+1) +"/"+ (new Date(this.DATErec[1].trim()).getDate()) +"/"+ (new Date(this.DATErec[1].trim()).getFullYear()));
        
        // } else if(this.receiveDate.value.length <= 12){
        //     this.receiveOne = new Date((new Date(this.receiveDate.value.trim()).getMonth()+1) +"/"+ (new Date(this.receiveDate.value.trim()).getDate()) +"/"+  (new Date(this.receiveDate.value.trim()).getFullYear()));
            
        // } else {
        //     this.DATErec = "";
        //     this.receiveDateStart = "";
        //     this.receiveDateEnd = "";
        // }
        // // Присвоюємо дані для поля Receive date END.


        // // Присвоюємо введені дати в змінні, та форматуємо їх для Creation Date START.
        // if (this.creationDate.value.length > 20) {
        //     this.DATE = this.creationDate.value.split("—");
        //     this.creationDateStart = new Date((new Date(this.DATE[0].trim()).getMonth()+1) +"/"+ (new Date(this.DATE[0].trim()).getDate()) +"/"+ (new Date(this.DATE[0].trim()).getFullYear()));
        //     this.creationDateEnd = new Date((new Date(this.DATE[1].trim()).getMonth()+1) +"/"+ (new Date(this.DATE[1].trim()).getDate()) +"/"+ (new Date(this.DATE[1].trim()).getFullYear()));

        // } else if(this.creationDate.value.length <= 12){
        //     this.creationOne = new Date((new Date(this.creationDate.value.trim()).getMonth()+1) +"/"+ (new Date(this.creationDate.value.trim()).getDate()) +"/"+  (new Date(this.creationDate.value.trim()).getFullYear()));

        // } else {
        //     this.DATE = "";
        //     this.creationDateStart = "";
        //     this.creationDateEnd = "";
        // }
        // // Присвоюємо введені дати в змінні, та форматуємо їх END.

        // // Ті фільтри в яких є дані додаємо в об"єкт this.newArray START.
        // this.newArray = {};
        // this.bank === "" ?  "" : this.newArray.bank = this.bank;
        // this.merchant === "" ?  "" : this.newArray.merchant = this.merchant;
        // this.status === "" ?  "" : this.newArray.status = this.status;
        // this.documents === "" ? "" : this.newArray.filter_status = this.documents;
        // // Ті фільтри в яких є дані додаємо в об"єкт END.


        // // Проводимо перевірку по всіх Інвойсах, та зрівнюємо їх з заданими фільтрами START.
        // this.ArrayLIst.forEach(item => {


        //     // Форматуємо дати з об"єкта якйи перевіряємо. 
        //     var dateCreationObj = new Date(item.dates.creation_date);
        //     var dateCreationObjFormated = new Date((dateCreationObj.getMonth()+1) +"/"+ dateCreationObj.getDate() +"/"+   dateCreationObj.getFullYear()); 

        //     var dateReceiveObj = new Date(item.dates.received_date);
        //     var dateReceiveObjFormated = new Date((dateReceiveObj.getMonth()+1) +"/"+ dateReceiveObj.getDate() +"/"+   dateReceiveObj.getFullYear()); 
        //     // Форматуємо дату з об"єкта якйи перевіряємо. 

            
            
        //     // Перевірка чи одна дата чи дві Creation START.
        //     if(this.creationDate.value.length <= 12){
        //         var dateCriteriaCreation = +this.creationOne === +dateCreationObjFormated;

        //     } else if(this.creationDate.value.length > 20){
        //         var dateCriteriaCreation = +this.creationDateStart <= +dateCreationObjFormated && +dateCreationObjFormated <= +this.creationDateEnd;
        //     }
        //     // Перевірка чи одна дата чи дві Creation END.


        //     // Перевірка чи одна чи дві дати Receive start.
        //     if (this.receiveDate.value.length <= 12) {
        //         var dateCriteriaReceive = +this.receiveOne === +dateReceiveObjFormated;

        //     } else if(this.receiveDate.value.length > 20){
        //         var dateCriteriaReceive  = +this.receiveDateStart <= +dateReceiveObjFormated && +dateReceiveObjFormated <= +this.receiveDateEnd;
        //     }
        //     // Перевірка чи одна чи дві дати Receive start.


        //     // Перевірка чи пустий об"єкт чи ні, якщо пустий то перевірка лише по датам йде START.
        //     var isEmpty = this.checkIsEmptyObj(this.newArray);
        //     if (!isEmpty) {
        //         var res = Object.keys(this.newArray).every(key => item[key] === this.newArray[key]);

        //         if (this.creationDate.value.length >= 11 && this.receiveDate.value.length >= 11) { // 1
        //             if(res === true && dateCriteriaCreation && dateCriteriaReceive) return filterCheck.push(item);

        //         } else if(this.creationDate.value.length >= 11 && this.receiveDate.value.length === 0){
        //             if(res === true && dateCriteriaCreation) return filterCheck.push(item); // 3
                    

        //         } else if(this.creationDate.value.length === 0 && this.receiveDate.value.length >= 11) {
        //             if(res === true && dateCriteriaReceive) return filterCheck.push(item); // 4

        //         } else if (this.creationDate.value.length === 0 && this.receiveDate.value.length === 0){
        //             if(res === true) return filterCheck.push(item); // 5
        //         }

        //     } else if(isEmpty){

        //         if (this.creationDate.value.length >= 11 && this.receiveDate.value.length >= 11) {
        //             if(dateCriteriaCreation && dateCriteriaReceive) return filterCheck.push(item); // 2

        //         } else if (this.creationDate.value.length >= 11 && this.receiveDate.value.length === 0) {
        //             if(dateCriteriaCreation) return filterCheck.push(item); // 6

        //         } else if (this.creationDate.value.length === 0 && this.receiveDate.value.length >= 11) {
        //             if(dateCriteriaReceive) return filterCheck.push(item); // 7

        //         } else if (this.creationDate.value.length === 0 && this.receiveDate.value.length === 0) {
        //             return filterCheck = []; // 8
        //         }
        //     }
        //     // Перевірка чи пустий об"єкт чи ні, якщо пустий то перевірка лише по датам йде END.

        // });
        // // Проводимо перевірку по всіх Інвойсах, та зрівнюємо їх з заданими фільтрами END.

        // this.container = document.getElementById("table-list");
        // this.container.innerHTML = "";

        // this.containerPages.innerHTML = "";

        // if (filterCheck.length) {
        //     this.countNextPage(filterCheck);
        // }
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

    countNextPage = (arr, numbersOfpages, filter) => {
        this.loadInvoices(arr, 0, 10);
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

                this.nextList = await this.getInvoices(listNumber, filter);
                
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

                } else if( +(btn.textContent) === 1 ){

                }
                
                this.checkClickedPages(currentEvent);
            });
        });
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

    getInvoices = async (count, filter, first, second) => {
        return  await fetch("http://18.216.223.81:3000/getPart-Invoices", {
        // return  await fetch("http://localhost:3000/getPart-Invoices", {
            method: "POST",
            body: JSON.stringify({
                numbers: count, 
                filter,
                first: first,
                second: second
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

    getNumberOfinvoices = async (filter, first, second) => {
        return  await fetch("http://18.216.223.81:3000/getNumber-Invoices", {
        // return  await fetch("http://localhost:3000/getNumber-Invoices", {
            method: "POST",
            body: JSON.stringify({
                filter,
                first: first,
                second: second
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
                    <td class="column1">
                        <div class="createdTd">
                            <p class="green"><b>#${item.number}</b></p>
                            <p class="smallBoldText">${moment(item.dates.creation_date).format('ll')}</p>
                            <p>${moment(item.dates.creation_date).format("h:mm a")}</p>
                        </div>
                    </td> 
                    <td class="column2">
                        ${item.merchant}
                    </td> 
                    <td class="column3">${item.client_details.full_name}</td> 
                    <td class="column4">
                        <div class="sentTd">
                            <p>${currency}${item.amount.amount_sent}</p>
                            <p class="yellow smallBoldText">${this.checkDate(item.dates.sent_date)}</p>
                        </div>
                    </td> 
                    <td class="column5">${item.commissions}</td>
                    <td class="column6">
                        <div>
                            <p>${currency}${item.amount.amount_received}</p>
                            <p class="blue smallBoldText">${this.checkDate(item.dates.received_date)}</p>
                        </div>
                    </td>
                    <td class="column7">${item.bank}</td>
                    <td class="column8">
                        <p>${currency}${0}</p>
                        <p class="fiolet smallBoldText">${this.checkDate(item.dates.available_date)}</p>
                    </td>
                    <td class="column9 ${color}"><strong>${item.status}</strong></td>

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
    }

    render(){
        this.saveLocalInvoices();
        this.saveLocakBanksAndMerchants();
        this.showFilterBtn.addEventListener("click", this.filterList);
        this.clearFilterBtn.addEventListener("click", this.clearFilter);
        this.btnExel.addEventListener("click", this.saveXls);
        this.btn_search.addEventListener("click", this.searchFunction);
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
