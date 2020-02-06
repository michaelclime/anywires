// Remove menu items for permissions START

// Remove menu items for permissions END

class UsersList {
    constructor(){
        this.filter = {};
        this.permissionFilter = {};
        this.usersArr = [];
        this.usersNum = [];
        this.containerPages = document.querySelector(".nextPage-block");
        this.container = document.getElementById("table-list");
        this.loadingGif = document.querySelector("#loadingGif");
        this.render();
    }


    saveXls = async () => {
        // Loading ON
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");
        // 

        const data = {
            filter: this.filter,
            skip: 0,
            limit: 1000000
        };
        const res = await this.getUserPartly(data);

        // Render hiden table
        
        const tbodyXLS = document.querySelector('#table__xls--tbody');
        res.users.forEach(item => {
            const trXLS = document.createElement('tr');
            trXLS.innerHTML = `
                <td>${moment(item.dateCreation).format("DD-MM-YYYY")}</td>
                <td>${item.fullname}</td>
                <td>${item.email}</td>
                <td>
                    ${
                        item.merchantsList.length
                        ?
                        item.merchantsList.map(elem => {
                            return ` 
                            <div>
                                ${elem.name}, 
                            </div>
                            `
                        }).join(" ").split(',')
                        :
                        ""
                    }
                </td>
                <td>${item.role}</td>
                <td>${'25-12-1994'}</td>
            `;
            tbodyXLS.appendChild(trXLS);
        });
        // 

        const tbl = document.getElementById('table__xls');
        const wb = XLSX.utils.table_to_book(tbl, {
            sheet: "Users",
            display: true
        });
        const wbout = XLSX.write(wb, {bookType: "xlsx", bookSST: true, type: "binary"});
        function s2ab(s) {
            let buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };

        const date = moment(new Date()).format("DD-MM-YYYY")
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), `users-${date}.xlsx`);

        // Loading OFF
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
        // 
    }

    
    hoverXLS = () => {
        document.querySelector(".table-arrows").addEventListener("mouseover", (event) => {
            event.preventDefault();
            document.querySelector(".xlsTip").style.display = "flex";
        });
        document.querySelector(".table-arrows").addEventListener("mouseout", (event) => {
            event.preventDefault();
            document.querySelector(".xlsTip").style.display = "none";
        });
    }


    clearFilters = () => {
        this.filter = {};
        Object.assign(this.filter, this.permissionFilter);
        // 
        const areas = document.querySelectorAll(".clear");
        areas.forEach((item) => item.value = "");
        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";
        this.countNextPage(this.usersArr, this.usersNum);
    }


    filterList = async () => {
        // Loading ON
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");
        // 

        this.filter = {};
        Object.assign(this.filter, this.permissionFilter);
        // 
        const lastLog = document.querySelector("#lastLog").value;
        const merchant = document.querySelector("#merchant").value;
        const role = document.querySelector("#filterRole").value;

        merchant ? this.filter.merchant = merchant : "";
        role ? this.filter.role = role : "";
       
        // Checking Last Login Date
        let startLog = "";
        let endLog = "";

        if (lastLog.length > 20){
            const date = lastLog.split("—");
            startLog = new Date(date[0].trim());
            endLog = new Date(date[1].trim());

        } else if (lastLog.length <= 12 || lastLog.length !== 0) {
            startLog = new Date(lastLog.trim());
            endLog = false;
        }
        // Checking Last Login Date

        var emptyObj = this.checkIsEmptyObj(this.filter);
        if (!emptyObj || lastLog.length) {
            const data = {
                filter: this.filter,
                skip: 0,
                limit: 10,
                firstCrea: startLog,
                secondCrea: endLog
            };
            const res = await this.getUserPartly(data);
            const arrUsers = res.users;
            const numberUsers = res.count;

            // Table cleaning
            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            if (numberUsers) {
                this.countNextPage(arrUsers, numberUsers);
            }
        } 

        // Loading OFF
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
    }


    checkIsEmptyObj = obj => {
        for (let key in obj) {
            return false; // wrong
        }
        return true; // is epmty
    }


    searchFunction = async () => {
        this.filter = {};
        // 
        const phrase = document.getElementById('search-input').value;
        if (phrase) {
            // Loading ON
            this.loadingGif.style.display = "flex";
            document.body.classList.add("modal-open");
            // 

            this.filter = { $text: { $search: phrase } };
            Object.assign(this.filter, this.permissionFilter);
            // 

            // Request to Mongo DB
            const data = {
                filter: this.filter,
                skip: 0,
                limit: 10
            };
            
            const res =  await this.getUserPartly(data);
            // 
            const usersArr = res.users;
            const usersCount = res.count;

            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            this.countNextPage(usersArr, usersCount);

            // Loading OFF
            this.loadingGif.style.display = "none";
            document.body.classList.remove("modal-open");
            // 
        }
    }

    countNextPage = (arr, numbersOfpages) => {
        this.loadUsers(arr);
        const lastPage = numbersOfpages / 10;

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
            for (let i = 0; i <= lastPage; i++) {
                this.renderNextPage([i+1]);
            }
        }
        const buttonsPage = document.querySelectorAll(".nextPage-btn");
        buttonsPage[0].classList.add("highlight");
        buttonsPage.forEach((btn) => {
            btn.addEventListener("click", async (event) => {
                // Loading GIF appear and scroll off
                this.loadingGif.style.display = "flex";
                document.body.classList.add("modal-open");

                const currentEvent = +(event.target.textContent);
                const listNumber = ((currentEvent*10)-10);

                const data = {
                    filter: this.filter,
                    skip: listNumber,
                    limit: 10
                };
                const res = await this.getUserPartly(data);

                // Loading GIF appear and scroll off
                this.loadingGif.style.display = "none";
                document.body.classList.remove("modal-open");

                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";
                
                this.loadUsers(res.users);

                if( +(btn.textContent) === lastPage && +(btn.textContent) > 1){
                    btn.closest("div").children[0].textContent = lastPage - 3;
                    btn.closest("div").children[1].textContent = lastPage - 2;
                    btn.closest("div").children[2].textContent = lastPage - 1;

                } else if (+(btn.textContent) !== 1 && +(btn.textContent) > +(btn.closest("div").children[1].innerHTML) && +(btn.textContent) < lastPage-1) {
                    const first =  btn.closest("div").children[0].textContent;
                    const second = btn.closest("div").children[1].textContent;
                    const third = btn.closest("div").children[2].textContent;

                    btn.closest("div").children[0].textContent = Number(first)+ 1;
                    btn.closest("div").children[1].textContent = Number(second) + 1;
                    btn.closest("div").children[2].textContent = Number(third) + 1;

                } else if ( +(btn.textContent) !== 1 && +(btn.textContent) < +(btn.closest("div").children[1].innerHTML) && +(btn.textContent) > 1) {
                    const first =  btn.closest("div").children[0].textContent;
                    const second = btn.closest("div").children[1].textContent;
                    const third = btn.closest("div").children[2].textContent;

                    btn.closest("div").children[0].textContent = Number(first) - 1;
                    btn.closest("div").children[1].textContent = Number(second) - 1;
                    btn.closest("div").children[2].textContent = Number(third) - 1;

                } else if( +(btn.textContent) === 1 ){}

                this.checkClickedPages(currentEvent);
            });
        });
    }


    checkClickedPages = event => {
        this.buttonsPage = document.querySelectorAll(".nextPage-btn");
        this.buttonsPage.forEach((btn) => {
            event === +(btn.textContent) ? btn.classList.add("highlight") : btn.classList.remove("highlight");;
        });
    };

    renderNextPage = page => {
        this.buttonNext = document.createElement("button");
        this.buttonNext.textContent = page;
        this.buttonNext.classList.add("nextPage-btn");
        this.containerPages.appendChild(this.buttonNext);
    }


    renderOption = (filter, name, _id) => {
        const option = document.createElement("option");
        option.value = _id;
        option.textContent = name;
        filter.appendChild(option);
    }


    getMerchants = async () => {
        return  await fetch("http://18.216.223.81:3000/get-all-merchants")
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
    }


    getUserByFilter = async filter => {
        return  await fetch("http://18.216.223.81:3000/getUserByFilter", {
            method: "POST",
            body: JSON.stringify({filter}),
            headers:{'Content-Type': 'application/json'}
        })
        
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
    }


    permissionMerchantManager = async () => {
        const currentUser_id = document.querySelector('.curentUserId').textContent.trim()
        const currentUserData = await this.getUserByFilter({'_id': currentUser_id})
        currentUserData.users[0].merchantList.forEach(item => this.renderOption(document.querySelector('#merchant'), item.name, item._id))
        const merchantArr = currentUserData.users[0].merchantList.map(item => item._id)
        this.permissionFilter = {'merchant': { $in: merchantArr }}
        Object.assign(this.filter, this.permissionFilter)

        document.querySelector('.roleSol').remove()
        document.querySelector('.roleAff').remove()
    }


    saveLocalUsers = async () => {
        // Permission access for Solution Manager
        this.currentUserRole = document.querySelector('.curentUserRole').textContent.trim();
        if (this.currentUserRole === 'Merchant Manager') {
            await this.permissionMerchantManager();
        } else {
            // Render merchants name for filters
            const merchantList = await this.getMerchants({});
            merchantList.merchants.forEach(item => this.renderOption(document.querySelector('#merchant'), item.name, item._id) ); 
        }
        
        const data = {
            filter: this.filter,
            skip: 0,
            limit: 10
        };
        const res = await this.getUserPartly(data);

        this.usersArr = res.users;
        this.usersNum = res.count;
        this.countNextPage(this.usersArr, this.usersNum);

        // Loading GIF appear and scroll off
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
    }


    getUserPartly = async data => {
        return  await fetch("http://18.216.223.81:3000/get-user-partly", {
            method: "POST",
            body: JSON.stringify(data),
            headers:{'Content-Type': 'application/json'}
        })
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
    }


    checkDate = data => {
        return data === "" || !data ? data = "mm/dd/yyyy" : data = moment(data).format('ll');
    }


    loadUsers = (arr) => {
        this.container = document.getElementById("table-list");
        arr.forEach((item) => {
            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1">${item.fullname}</td> 
                    <td class="column2">${item.email}</td> 
                    <td class="column3">
                        ${
                            item.merchantsList.length
                            ?
                            item.merchantsList.map(elem => {
                                return ` 
                                <div class='column3__item'>
                                    ${elem.name} 
                                </div>
                                `
                            }).join(" ").split(',')
                            :
                            ""
                        }
                    </td> 
                    <td class="column4">${item.role}</td> 
                    <td class="column5">${this.checkDate(item.dateCreation)}</td>
            `;
        this.container.appendChild(this.userList);
        });
    }


    render(){
        this.saveLocalUsers();
        this.hoverXLS();
        document.querySelector("#showBtn").addEventListener("click", this.filterList);
        document.getElementById("search-button").addEventListener("click", this.searchFunction);
        document.querySelector("#clearFilterBtn").addEventListener("click", this.clearFilters);
        document.querySelector('#dowloadXLS').addEventListener('click', this.saveXls);
    }
};

const userList = new UsersList();

// Alert modal window
const alertWindow = document.querySelector('.alert');
if (alertWindow) {
  alertWindow.addEventListener("click", (event) => {
      event.target === alertWindow ? alertWindow.style.display = "none" : "";
  });
}