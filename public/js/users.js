class UsersList {
    constructor(){
        this.filter = {};
        this.usersArr = [];
        this.usersNum = [];
        this.sortNameBtnUp = document.querySelectorAll(".sortUp");
        this.sortNameBtnDown = document.querySelectorAll(".sortDown");
        this.buttonSearch = document.getElementById("search-button");
        this.containerPages = document.querySelector(".nextPage-block");
        this.showFilter = document.querySelector("#showBtn");
        this.container = document.getElementById("table-list");
        this.clearFilterBtn = document.querySelector("#clearFilterBtn");
        this.render();
    }

    clearFilters = () => {
        this.filter = {};
        this.areas = document.querySelectorAll(".clear");
        this.areas.forEach((item) => item.value = "");

        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";

        this.countNextPage(this.usersArr, this.usersNum.numbers);
    }

    filterList = async () => {
        this.filter = {};
        this.lastLog = document.querySelector("#lastLog").value;
        this.merchant = document.querySelector("#merchant").value;
        this.role = document.querySelector("#filterRole").value;

        this.merchant ? this.filter.merchant = this.merchant : "";
        this.role ? this.filter.role = this.role : "";

       
        // Checking Last Login Date
        this.startLog = "";
        this.endLog = "";

        if (this.lastLog.length > 20){
            this.date = this.lastLog.split("—");
            this.startLog = new Date(this.date[0].trim());
            this.endLog = new Date(this.date[1].trim());

        } else if (this.lastLog.length <= 12 || this.lastLog.length !== 0) {
            this.startLog = new Date(this.lastLog.trim());
            this.endLog = false;
        }
        // Checking Last Login Date

        var emptyObj = this.checkIsEmptyObj(this.filter);
        if (!emptyObj || this.lastLog.length) {
            this.arrUsers = await this.getUsers(0, this.filter, this.startLog, this.endLog);
            this.numberUsers = await this.getUsers_Number(this.filter, this.startLog, this.endLog);

            // Table cleaning
            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            if (this.numberUsers.numbers) {
                this.countNextPage(this.arrUsers, this.numberUsers.numbers);
            }
        } 
    }

    checkIsEmptyObj = (obj) => {
        for (let key in obj) {
            return false; // wrong
        }
        return true; // is epmty
    }

    sortArrDown = (arr, key) => {
        this.sortByValue = arr.slice(0);
        this.key = key.toLowerCase();
        this.key === "name" ? this.key = "fullname" : "";
        this.sortByValue.sort((a,b) => {
            var x = a[this.key].toLowerCase();
            var y = b[this.key].toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        this.container = document.querySelector("#table-list");
        this.container.innerHTML = "";
        this.loadUsers(this.sortByValue);
    }

    sortArrUp = (arr, key) => {
        this.sortByValue = arr.slice(0);
        this.key = key.toLowerCase();
        this.key === "name" ? this.key = "fullname" : "";
        this.sortByValue.sort((a,b) => {
            var x = a[this.key].toLowerCase();
            var y = b[this.key].toLowerCase();
            return x < y ? 1 : x > y ? -1 : 0;
        });
        this.container = document.querySelector("#table-list");
        this.container.innerHTML = "";
        this.loadUsers(this.sortByValue);
    }

    searchFunction = async () => {
        this.filter = {};
        var phrase = document.getElementById('search-input').value;
        if (phrase) {
            this.filter = { $text: { $search: phrase } };
            const lengthInvoice = await this.getUsers_Number(this.filter);
            const filterList = await this.getUsers(0, this.filter);

            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            this.countNextPage(filterList, lengthInvoice.numbers);
        }
    }

    countNextPage = (arr, numbersOfpages) => {
        this.loadUsers(arr);
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

                this.nextList = await this.getUsers(this.listNumber, this.filter);

                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";
                
                this.loadUsers(this.nextList);

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

    renderNextPage = (page) => {
        this.buttonNext = document.createElement("button");
        this.buttonNext.textContent = page;
        this.buttonNext.classList.add("nextPage-btn");
        this.containerPages.appendChild(this.buttonNext);
    }

    saveLocalUsers = async () => {
        this.usersArr = await this.getUsers(0);
        this.usersNum = await this.getUsers_Number();
        this.countNextPage(this.usersArr, this.usersNum.numbers);
    }

    getUsers = async (number, filter, startLog, endLog) => {
        // return  await fetch("http://18.216.223.81:3000/getPart-Users", {
        return  await fetch("http://18.216.223.81:3000/getPart-Users", {
            method: "POST",
            body: JSON.stringify({
                number, 
                filter,
                startLog,
                endLog
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

    getUsers_Number = async (filter, startLog, endLog) => {
        // return  await fetch("http://18.216.223.81:3000/getNumber-Users", {
        return  await fetch("http://18.216.223.81:3000/getNumber-Users", {
            method: "POST",
            body: JSON.stringify({
                filter,
                startLog,
                endLog
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

    loadUsers = (arr) => {
        this.container = document.getElementById("table-list");
        arr.forEach((item) => {
            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1">${item.fullname}</td> 
                    <td class="column2">${item.email}</td> 
                    <td class="column3">${item.merchant}</td> 
                    <td class="column4">${item.role}</td> 
                    <td class="column5">${item.last_login_date}</td>
            `;
        this.container.appendChild(this.userList);
        });
    }

    render(){
        this.saveLocalUsers();

        this.showFilter.addEventListener("click", this.filterList);
        this.buttonSearch.addEventListener("click", this.searchFunction);
        this.clearFilterBtn.addEventListener("click", this.clearFilters);

        this.sortNameBtnDown.forEach((btn) => {
            btn.addEventListener("click", () => {
                this.value = btn.closest("th").innerText.trim();
                this.sortArrDown(this.usersArr, this.value);

                this.toggleBtn = btn.closest('th').children[0];
                this.toggleBtn.style.display = "inline-block";
                btn.style.display = "none";
            });
        });

        this.sortNameBtnUp.forEach((btn) => {
            btn.addEventListener("click", () => {
                this.value = btn.closest("th").innerText.trim();
                this.sortArrUp(this.usersArr, this.value );

                this.toggleBtn = btn.closest('th').children[1];
                this.toggleBtn.style.display = "inline-block";
                btn.style.display = "none";
            });
        });

        
    }
};

const userList = new UsersList();