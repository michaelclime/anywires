class UsersList {
    constructor(){
        this.ArrayLIst = [];
        this.createBankBtn = document.querySelector("#createBank-button");
        this.clearFilter = document.querySelector("#clearFilterBtn");
        this.btnShowFilter = document.querySelector("#showBtn");
        this.buttonSearch = document.getElementById("search-button");
        this.buttonExel = document.querySelector("#dowloadPdf");
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
            this.data[14].checked ? this.sepa = true : this.sepa = false;
            this.data[15].checked ? this.b2b = true : this.b2b = false;
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
                "description" : this.data[13].value, 
                "creation_date" : moment().format('LL'), 
                "created_by" : "Jack Wilson" 
            };
            console.log(this.newBank);
            
            // CheckEmpty start
            var s = [];
            this.data.forEach((item) => {
                s.push(item.value.replace(/^\s+|\s+$/g, ''));
            });
            this.resultCheck = s.some((item) => item === "");
            // CheckEmpty end

            if(this.resultCheck === true) {
                alert("Please fill out all empty fields!");
            } else {
                alert("OK!");
                
                // fetch("http://18.216.223.81:3000/postBank", {
                    fetch("http://localhost:3000/postBank", {
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
        this.selets = document.querySelectorAll("select");
        this.selets.forEach(item => item.value = "");
        this.searchInput = document.querySelector("#search-input").value = "";
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.loadUsers(this.ArrayLIst);
    }

    showFilters = () => {
        this.filterArray = document.querySelectorAll(".filter");
        this.filterMin = document.querySelector("#filterMin").value;
        this.filterMax = document.querySelector("#filterMax").value;
        this.filterSepa = document.querySelector("#filterSepa").value;
        this.filterEnable = document.querySelector("#filterEnable").value;
        this.filterSolution = document.querySelector("#filterSolution").value;
        this.filterCurrency = document.querySelector("#filterCurrency").value;
        this.filterCountry = document.querySelector("#filterCountry").value;
        this.newArray = {};
        this.filterMin === "" ?  "" : this.newArray.min_wire = Number(this.filterMin);
        this.filterMax === "" ? "" : this.newArray.max_wire = Number(this.filterMax);

        if(this.filterSepa === "") {} else{
            this.filterSepa === "no" ? this.filterSepa = false : this.filterSepa = true;
            this.newArray.sepa = this.filterSepa;
        }
        if(this.filterEnable === ""){} else{
            this.filterEnable === "no" ? this.filterEnable = false : this.filterEnable = true;
            this.newArray.active = this.filterEnable
        };

        this.filterSolution === "" ? "" : this.newArray.solution_name = this.filterSolution;
        this.filterCurrency === "" ? "" : this.newArray.currency = this.filterCurrency;
        this.filterCountry === "" ? "" : this.newArray.country = this.filterCountry;
        this.result = this.ArrayLIst.filter(item => 
            Object.keys(this.newArray).every(key => 
                item[key] === this.newArray[key])
        );
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.loadUsers(this.result);
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

    searchFunction = () =>{
        var phrase = document.getElementById('search-input');
        var table = document.getElementById('table-banks');
        var regPhrase = new RegExp(phrase.value, 'i');
        var flag = false;
        for (var i = 1; i < table.rows.length; i++) {
            flag = false;
            for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
                flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
                if (flag) break;
            }
            if (flag) {
                table.rows[i].style.display = "";
            } else {
                table.rows[i].style.display = "none";
            }
        }
    }

    methodPutEnable = (id, status) => {
        fetch("http://localhost:3000/putBank", {
            // fetch("http://18.216.223.81:3000/postBank", {
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

    getUsers = async () => {
        return  await fetch("http://localhost:3000/getBank")
        // return  await fetch("http://18.216.223.81:3000/postBanks")
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
    }

    saveLocalBanks = async (array) => {
        array = await this.getUsers();
        array.forEach((item) => {
            this.ArrayLIst.push(item);
        });
        this.loadUsers(this.ArrayLIst);
    }

    loadUsers = (array) => {
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