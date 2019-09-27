class UsersList {
    constructor(){
        this.filter = {};
        this.ArrayLIst = [];
        this.banksNumber = [];
        this.container = document.getElementById("table-list");
        this.createBankBtn = document.querySelector("#createBank-button");
        this.clearFilter = document.querySelector("#clearFilterBtn");
        this.btnShowFilter = document.querySelector("#showBtn");
        this.buttonSearch = document.getElementById("search-button");
        this.buttonExel = document.querySelector("#dowloadPdf");
        this.containerPages = document.querySelector(".nextPage-block");
        this.render();
    }

    createBank = () => {
        this.filter = document.querySelector(".filter");
        this.filter.style.display = "flex";

        this.filter.addEventListener("click", (event) => {
            event.target === this.filter ? this.filter.style.display = "none" : "";
        });

        this.modalCreateBtn = document.querySelector("#createBankModal-btn");
        this.modalCreateBtn.addEventListener("click", this.createBankInit);
    }

    createBankInit = () => {
        this.data = document.querySelectorAll(".allData");
            this.data[15].checked ? this.sepa = true : this.sepa = false;
            this.data[16].checked ? this.b2b = true : this.b2b = false;
            console.log(this.data[13].value);
            this.newBank = {
                "name" : this.data[0].value, 
                "beneficiary_name" : this.data[1].value, 
                "solution_name" : this.data[2].value, 
                "country" : this.data[3].value, 
                "currency" : this.data[4].value, 
                "beneficiary address" : this.data[5].value, 
                "max_wire" : Number(this.data[6].value), 
                "min_wire" : Number(this.data[7].value), 
                "iban" : this.data[8].value, 
                "swift_bic" : this.data[9].value, 
                "bank_address" : this.data[10].value, 
                "incoming_fee" : 0.05, 
                "company_site" : this.data[11].value, 
                "stop_limit" : Number(this.data[12].value), 
                "registration_number": this.data[13].value,
                "sepa" : this.sepa, 
                "b2b" : this.b2b, 
                "company_logo" : "", 
                "balance_requested" : 0, 
                "balance_sent" : 0, 
                "balance_received" : 0, 
                "balance_approved" : 0, 
                "balance_available" : 0, 
                "active" : false, 
                "balance_settlement" : 0, 
                "description" : this.data[14].value, 
                "creation_date" : moment().format('LL'), 
                "created_by" : "Jack Wilson" 
            };
            console.log(this.newBank);
            
            // CheckEmpty start
            this.requiredFields = document.querySelectorAll(".required");
            var s = [];
            this.requiredFields.forEach((item) => {
                s.push(item.value.replace(/^\s+|\s+$/g, ''));
            });
            this.resultCheck = s.some((item) => item === "");
            // CheckEmpty end

            if(this.resultCheck === true) {
                alert("Please fill out all empty fields!");
            } else {
                alert("OK!");
                
                fetch("http://18.216.223.81:3000/postBank", {
                    // fetch("http://localhost:3000/postBank", {
                        method: "POST",
                        body: JSON.stringify(this.newBank),
                        headers:{'Content-Type': 'application/json'}
                        })
                        .then(res => {
                            res.text();
                        }) 
                        .then(async () => {
                            this.container = document.getElementById("table-list");
                            this.container.innerHTML = "";
                            this.ArrayLIst = [];
                            await this.saveLocalBanks();

                            // Cleaning inputs start
                            this.data.forEach((item) => item.value = "");
                            // Cleaning inputs end

                            this.filter.style.display = "none";
                        })
                        .catch(err => {
                            console.log(err);
                        });
            }
    }

    clearFilters = () => {
        this.filter = {};
        this.selets = document.querySelectorAll("select");
        this.selets.forEach(item => item.value = "");
        this.searchInput = document.querySelector("#search-input").value = "";

        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";

        this.countNextPage(this.ArrayLIst,  this.banksNumber.numbers);
    }

    showFilters = async () => {
        this.filter = {};
        this.filterArray = document.querySelectorAll(".filter");
        this.filterMin = document.querySelector("#filterMin").value;
        this.filterMax = document.querySelector("#filterMax").value;
        this.filterSepa = document.querySelector("#filterSepa").value;
        this.filterEnable = document.querySelector("#filterEnable").value;
        this.filterSolution = document.querySelector("#filterSolution").value;
        this.filterCurrency = document.querySelector("#filterCurrency").value;
        this.filterCountry = document.querySelector("#filterCountry").value;

        // Min Wire Filter
        if (this.filterMin !== ""){
            this.filter.min_wire = {
                $lte: +(this.filterMin)
            };
        }

        // Max Wire Filter
        if (this.filterMax !== ""){
            this.filter.max_wire = {
                $gte: +(this.filterMax)
            };
        }

        // Sepa Filter
        if (this.filterSepa !== ""){
            this.filterSepa === "yes" ? this.filterSepa = true : this.filterSepa = false;
            this.filter.sepa = this.filterSepa;
        }

        // Enable Filter
        if (this.filterEnable !== ""){
            this.filterEnable === "yes" ? this.filterEnable = true : this.filterEnable = false;
            this.filter.active = this.filterEnable;
        }

        // Solution Filter
        this.filterSolution !== "" ? this.filter.solution_name = this.filterSolution : "";

        // Currency Filter
        if(this.filterCurrency !== ""){
            this.filter.currency = {$elemMatch: {$eq: this.filterCurrency}};
        }

        // Country Filter
        this.filterCountry !== "" ? this.filter.country = this.filterCountry : "";

        // If empty Filter
        var emptyObj = this.checkIsEmptyObj(this.filter);
        if (!emptyObj) {

            this.lengthBanks = await this.getBanks_Number(this.filter);
            this.arrBanks = await this.getBanks(0, this.filter);
            
            // Table cleaning
            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            // If we got Empty Obj from Data Base. 
            if (this.lengthBanks.numbers) {
                this.countNextPage(this.arrBanks, this.lengthBanks.numbers);
            }
        }
    }

    checkIsEmptyObj = (obj) => {
        for (let key in obj) {
            return false; // wrong
        }
        return true; // is epmty
    }

    downloadExel = () => {
        var tbl = document.getElementById('table-banks');
        var wb = XLSX.utils.table_to_book(tbl, {
            sheet: "Banks table",
            display: true
        });

        var wbout = XLSX.write(wb, {bookType: "xlsx", bookSST: true, type: "binary"});
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'banks.xlsx');
    }

    searchFunction = async () =>{
        this.phrase = document.getElementById('search-input').value;
        this.filter = { $text: { $search: this.phrase } };

        if(this.phrase){
            this.length = await this.getBanks_Number(this.filter);
            this.filterList = await this.getBanks(0, this.filter);

            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            this.countNextPage(this.filterList, this.length.numbers);
        }
    }

    methodPutEnable = (id, status) => {
        // fetch("http://localhost:3000/putBank", {
        fetch("http://18.216.223.81:3000/putBank", {
                    method: "PUT",
                    body: JSON.stringify({
                        id: id, //Must be id!
                        active: status //Data which you want to change
                    }),
                    headers:{'Content-Type': 'application/json'}
                    })
                    .then(res => {
                        res.text();
                    }) 
                    .catch(err => {
                        console.log(err);
                    });
    }

    disableEnableCheck = () => {
        let btnDisable = document.querySelectorAll(".btnDisable");
        btnDisable.forEach((btn) => {
            btn.addEventListener("click", () => {
                if(btn.textContent === "Disable"){
                    btn.textContent = "Enable";
                    btn.style.background = "#00C851";
                    btn.closest("tr").children[11].innerHTML = "<strong>no</strong>";
                    btn.closest("tr").children[11].style.color = "#FF4444";
                    this.id = btn.closest("tr").children[13].innerHTML;

                    this.methodPutEnable(this.id, false);

                } else if(btn.textContent === "Enable") {
                    btn.textContent = "Disable";
                    btn.style.background = "#FF4444";
                    btn.closest("tr").children[11].innerHTML = "<strong>yes</strong>";
                    btn.closest("tr").children[11].style.color = "#00A542";
                    this.id = btn.closest("tr").children[13].innerHTML;
                    
                    this.methodPutEnable(this.id, true);
                }
            });
        });
    }

    checkSepa = () => {
        let itemsSepa = document.querySelectorAll(".statusCheck");
        for (let i = 0; i < itemsSepa.length; i++) {
            if(itemsSepa[i].textContent === "false"){
                itemsSepa[i].style.color = "#FF4444";
                itemsSepa[i].textContent = "no";
            } else {
                itemsSepa[i].style.color = "#00A542";
                itemsSepa[i].textContent = "yes";
            }
        };
    };

    checkEnable = () => {
        const itemEnables = document.querySelectorAll(".enableCheck");
        itemEnables.forEach((item) => {
            if(item.textContent === "false") {
                item.innerHTML = `<strong>no</strong>`;
                item.style.color = "#FF4444";
                item.closest("tr").children[12].childNodes[1].innerHTML = "Enable";
                item.closest("tr").children[12].childNodes[1].style.backgroundColor = "#00C851";
            } else if(item.textContent === "true"){
                item.innerHTML = `<strong>yes</strong>`;
                item.style.color = "#00A542";
                item.closest("tr").children[12].childNodes[1].innerHTML = "Disable";
                item.closest("tr").children[12].childNodes[1].style.backgroundColor = "#FF4444";
            }
        });
    }

    renderNextPage = (page) => {
        this.buttonNext = document.createElement("button");
        this.buttonNext.textContent = page;
        this.buttonNext.classList.add("nextPage-btn");
        this.containerPages.appendChild(this.buttonNext);
    }

    
    countNextPage = (arr, numbersOfpages) => {
        this.loadBanks(arr);
        var lastPage = numbersOfpages / 10;

        if(lastPage > 3){
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
        var buttonsPage = document.querySelectorAll(".nextPage-btn");
        buttonsPage[0].classList.add("highlight");
        buttonsPage.forEach((btn) => {
            btn.addEventListener("click", async (event) => {

                this.currentEvent = +(event.target.textContent);
                this.listNumber = ((this.currentEvent*10)-10);

                this.nextList = await this.getBanks(this.listNumber, this.filter);

                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";
                
                this.loadBanks(this.nextList);

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

                this.checkClickedPages(this.currentEvent);
            });
        });
    }

    checkClickedPages = (event) => {
        this.buttonsPage = document.querySelectorAll(".nextPage-btn");
        this.buttonsPage.forEach((btn) => {
            event === +(btn.textContent) ? btn.classList.add("highlight") : btn.classList.remove("highlight");;
        });
    };

    getBanks = async (number, filter) => {
        return  await fetch("http://18.216.223.81:3000/getPart-Banks", {
        // return  await fetch("http://localhost:3000/getPart-Banks", {
            method: "POST",
            body: JSON.stringify({
                number, 
                filter
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

    getBanks_Number = async (filter) => {
        return  await fetch("http://18.216.223.81:3000/getNumber-Banks", {
        // return  await fetch("http://localhost:3000/getNumber-Banks", {
            method: "POST",
            body: JSON.stringify({
                filter
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

    saveLocalBanks = async (array) => {
        this.banksNumber = await this.getBanks_Number({});
        array = await this.getBanks(0);
        array.forEach((item) => {
            this.ArrayLIst.push(item);
        });
        this.countNextPage(this.ArrayLIst, this.banksNumber.numbers);
    }

    loadBanks = (array) => {
        this.container = document.getElementById("table-list");
        array.forEach((item) => {
            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1">${item.name}</td> 
                    <td class="column2">${item.country}</td> 
                    <td class="column3">${item.currency}</td> 
                    <td class="column4">${item.balance_requested}</td> 
                    <td class="column5">${item.balance_sent}</td>
                    <td class="column6">${item.balance_received}</td> 
                    <td class="column7">${item.balance_approved}</td> 
                    <td class="column8">${item.balance_available}</td> 
                    <td class="column9">${item.min_wire}</td> 
                    <td class="column10">${item.max_wire}</td> 
                    <td class="column11 statusCheck">${item.sepa}</td> 
                    <td class="column12 enableCheck">${item.active}</td> 
                    <td class="column13">
                        <button class="btnDisable">Disable</button>
                    </td>
                    <td class="hide">${item._id}</td>
            `;
            this.container.appendChild(this.userList);
        });
        this.checkSepa();
        this.checkEnable();
        this.disableEnableCheck();
    }

    render(){
        this.saveLocalBanks();
        this.buttonSearch.addEventListener("click", this.searchFunction);
        this.buttonExel.addEventListener("click", this.downloadExel);
        this.btnShowFilter.addEventListener("click", this.showFilters);
        this.clearFilter.addEventListener("click", this.clearFilters);
        this.createBankBtn.addEventListener("click", this.createBank);
    }
};

const userList = new UsersList();


// const obj = { 
//     "name" : "Anywires Bank", 
//     "beneficiary_name" : "Anywires Company", 
//     "solution_name" : "AW", 
//     "country" : "Poland", 
//     "currency" : "EUR", 
//     "beneficiary address" : "Poland, general street, 49A", 
//     "max_wire" : 30000, 
//     "min_wire" : 1000, 
//     "iban" : "CX087345", 
//     "swift_bic" : "BIC12124", 
//     "bank_address" : "Poland, general street, polska 76, bul.", 
//     "incoming_fee" : "0.005", 
//     "company_site" : "anywires.com", 
//     "stop_limit" : 150000, 
//     "sepa" : true, 
//     "b2b" : true, 
//     "company_logo" : "", 
//     "balance_requested" : 0, 
//     "balance_sent" : 0, 
//     "balance_received" : 0, 
//     "balance_approved" : 0, 
//     "balance_available" : 0, 
//     "active" : true, 
//     "balance_settlement" : 0, 
//     "description" : "This is test bank description", 
//     "creation_date" : "2019-12-11", 
//     "created_by" : "Jack Wilson" 
// }