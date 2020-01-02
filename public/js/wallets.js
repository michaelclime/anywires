// Remove menu items for permissions START

const userRole = document.querySelector('.curentUserRole').textContent.trim()
if (userRole === 'Crm InvoiceManager' || userRole === 'Crm SuccessManager'  || userRole === 'Merchant Manager') {
    document.querySelector('.gn-menu__banks').remove()
} 

// Remove menu items for permissions END

class WalletsRequest {
    constructor(){}

    getSettlemetsByWalletId = async id => {
        return fetch(`/get-settlement-by-wallet/${id}`)
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
    }

    getAllMerchants = async () => {
        return  await fetch("http://18.216.223.81:3000/getMerchants")
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
   }

   createMerchantRequest = async newWallet => {
        return  await fetch("http://18.216.223.81:3000/createWallet", {
                method: "POST",
                body: JSON.stringify({newWallet}),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    editWalletRequest = async (walletId, editedWallet) => {
        return  await fetch("http://18.216.223.81:3000/editWallet", {
                method: "POST",
                body: JSON.stringify({walletId, editedWallet}),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }
}


class Wallets extends WalletsRequest {
    constructor(){
        super();
        this.filter = {};
        this.permissionFilter = {};
        this.walletsArr = [];
        this.walletsNum = 0;
        this.currentWallet = [];
        this.currentTr = null;
        this.containerPages = document.querySelector(".nextPage-block");
        this.loadingGif = document.querySelector("#loadingGif");
        this.filterEditWallet = document.querySelector(".filter_editWallet");
        this.currentUser = document.querySelector(".userName");
        this.render();
    }

    renderTransactionTable = arr => {
        const container = document.querySelector(".transaction__table--tbody");
        arr.forEach(item => {
            const commissionArr = item.commissionsList.filter(com => com.type.trim() === "Settlement Anywires Commission");
            const commissionAmount = commissionArr.map(com => com.amount).reduce((acc, cur) => acc + cur, 0);
            const currency = item.currency.trim() === 'USD' ? '$' : '€';
            const userList = document.createElement("tr");
            userList.innerHTML = `
                <td class="transaction__column1">${this.checkDate(item.dates.creation_date)}</td> 
                <td class="transaction__column2">${item.createdBy[0].fullname}</td> 
                <td class="transaction__column3">
                    ${
                        item.status.trim() === 'Requested' ? item.amount.amount_requested : item.amount.amount_sent
                    }
                    ${currency}
                </td> 
                <td class="transaction__column4">${item.type}</td> 
                <td class="transaction__column5">${item.status}</td> 
                <td class="transaction__column6">${commissionAmount} ${currency}</td> 
            `;
            container.appendChild(userList);
        });
    }

    transactionPopUp = () => {
        var allTd = document.querySelectorAll(".transaction");
        allTd.forEach((td) => {
            td.addEventListener("click", async event => {
                event.preventDefault();
                // 
                // Add Loading
                this.loadingGif.style.display = "flex";
                document.body.classList.add("modal-open");
                // 
                // Clean popUp Windo
                document.querySelector(".transaction__table--tbody").innerHTML = '';
                // 
                // Event for Window closing
                const filterTransaction = document.querySelector(".transaction__filter");
                filterTransaction.style.display = 'flex'
                filterTransaction.addEventListener("click", (event) => {
                    if (event.target === filterTransaction){
                        filterTransaction.style.display = "none";
                        document.body.classList.remove("modal-open");
                    }
                });
                // 
                // Request for Settlements
                const walletId = event.target.closest("tr").querySelector("#walletId").textContent.trim();
                const settlements = await this.getSettlemetsByWalletId(walletId);
                // 
                // Render popUp information
                const merchantName = event.target.closest("tr").querySelector(".table_wallets--merchant-name").textContent.trim();
                document.querySelector('.transaction__header--marchant-name').innerHTML = `${merchantName}`;
                // 
                const walletName = event.target.closest("tr").querySelector(".table_wallets--wallet-name").textContent.trim();
                const walleBalance = event.target.closest("tr").querySelector(".table_wallets--wallet-balance").textContent.trim();
                const walleCurrency = event.target.closest("tr").querySelector(".table_wallets--wallet-currency").textContent.trim();
                document.querySelector('.transaction-wallet-name').innerHTML = `${walletName} - ${walleBalance}${walleCurrency === 'USD' ? '$' : '€'}`;
                // 
                // Render table transaction
                this.renderTransactionTable(settlements.settlements);
                // 
                // Remove Loading
                this.loadingGif.style.display = "none";
            });
        });
    }

    jsonToXls = async () => {
        // Loading GIF appear and scroll off
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");
        // 
        const createXLSLFormatObj = [];
 
        /* XLS Head Columns */
        const xlsHeader = ["Name", "Type", "Balance", "Currency", "Created by", "Merchant", "Creation date"];
        
        // /* XLS Rows Data */
        const data = {
            filter: this.filter,
            skip: 0,
            limit: 1000000
        };
        const res = await this.getWalletsPart(data);
        const xlsRows = res.wallets;
        
        // Removing ID field and changing Date format
        xlsRows.forEach((item) => {
            delete item["_id"];
            delete item["__v"];
            delete item["requisites"];
            item.creation_date = moment(item.creation_date).format("DD-MM-YYYY");
        });

        createXLSLFormatObj.push(xlsHeader);
        $.each(xlsRows, function(index, value) {
            var innerRowData = [];
            $.each(value, function(ind, val) {
                innerRowData.push(val);
            });
            createXLSLFormatObj.push(innerRowData);
        });
 
        /* File Name */
        var filename = `wallets-${moment(new Date()).format("YYYY-MM-DD")}.xlsx`;
 
        /* Sheet Name */
        var ws_name = "wallets";
 
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
 
        /* Add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
 
        /* Write workbook and Download */
        XLSX.writeFile(wb, filename);
        
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

    searchFunction = async () => {
        this.filter = {};
        // Loading GIF On
        this.loadingGif.style.display = "flex";

        const phrase = document.getElementById('search-input').value;
        // 
        this.filter = { $text: { $search: phrase } };
        Object.assign(this.filter, this.permissionFilter);
        // 
        if (phrase) {
            const data = {
                filter: this.filter,
                skip: 0,
                limit: 10
            };
            const res = await this.getWalletsPart(data);

            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            this.countNextPage(res.wallets, res.counts);
        }

        // Loading GIF Off
        this.loadingGif.style.display = "none";
    }


    createMerchantCheckData = async () => {
        const createdBy = this.currentUser.textContent.trim();
        const requiredCreate = this.checkedEmptyArray(document.querySelectorAll(".requiredCreate"));
        if (requiredCreate) {
            this.alertWindow("Please fill out all fields!");

        } else {
            // Loading GIF appear and scroll onn
            this.loadingGif.style.display = "flex";
            // 
            const newWallet = {
                "name": document.querySelector("#walletName").value,
                "type": document.querySelector("#type").value,
                "balance": 0,
                "currency": document.querySelector("#currency").value,
                "requisites": {
                    "beneficiary_name": document.querySelector("#benefName").value,
                    "beneficiary_address": document.querySelector("#benefAddress").value,
                    "bank_name": document.querySelector("#bankName").value,
                    "bank_address": document.querySelector("#bankAddress").value,
                    "account_number": document.querySelector("#accountNum").value,
                    "iban": document.querySelector("#IBAN").value,
                    "swift": document.querySelector("#SWIFT").value
                },
                "created_by": createdBy,
                "merchant_name": document.querySelector("#merchant").value
            };
            await this.createMerchantRequest(newWallet);
            //
             // Request for data 
             const data = {
                filter: this.filter,
                skip: 0,
                limit: 10
            };
            const response = await this.getWalletsPart(data);
            this.walletsArr = response.wallets;
            this.walletsNum = response.counts;
            // 
            // Table cleaning
            this.container = document.getElementById("table-list");
            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";
            // 
            // Render wallets 
            this.countNextPage(this.walletsArr, this.walletsNum);
            // Loading GIF off and scroll off
            this.loadingGif.style.display = "none";
            this.filterEditWallet.style.display = "none";
        }
    }

    createWallet = () => {
        // Scroll off
        document.body.classList.add("modal-open");
        // 
        // Show PopUp Window
        document.querySelector(".editWallet_title").innerHTML = "CREATE WALLET";
        document.querySelector(".createWallet_main").style.display = "flex";
        document.querySelector("#editWallet_action").innerHTML = "Create";
        this.filterEditWallet.style.display = "flex";
        this.filterEditWallet.addEventListener("click", (event) => {
            if (event.target === this.filterEditWallet){
                this.filterEditWallet.style.display = "none";
                document.body.classList.remove("modal-open");
                document.querySelector(".createWallet_main").style.display = "none";
            }
        });
        //
        // Event for button Edit inside PopUp
        document.querySelector("#editWallet_action").removeEventListener("click", this.editWalletCheckData);
        document.querySelector("#editWallet_action").addEventListener("click", this.createMerchantCheckData);
    }

    checkIfdataChanged = (data, newData) => {
        if (data !== newData){
            return newData;
        }
        return null;
    }

    editWalletCheckData = async () => {
        const requiredEdit = this.checkedEmptyArray(document.querySelectorAll(".requiredEdit"));
        if (requiredEdit){
            this.alertWindow("Please fill out all fields!");

        } else {
            const editedWallet = {};
            // 
            // Check if input has been changed than push new data to editedWallet
            const benefName = this.checkIfdataChanged(this.currentWallet[0].requisites.beneficiary_name, document.querySelector("#benefName").value);
            const benefAddress = this.checkIfdataChanged(this.currentWallet[0].requisites.beneficiary_address, document.querySelector("#benefAddress").value);
            const walletName = this.checkIfdataChanged(this.currentWallet[0].name, document.querySelector("#walletName").value);
            const bankName = this.checkIfdataChanged(this.currentWallet[0].requisites.bank_name, document.querySelector("#bankName").value);
            const bankAddress = this.checkIfdataChanged(this.currentWallet[0].requisites.bank_address, document.querySelector("#bankAddress").value);
            const accountNum = this.checkIfdataChanged(this.currentWallet[0].requisites.account_number, document.querySelector("#accountNum").value);
            const iban = this.checkIfdataChanged(this.currentWallet[0].requisites.iban, document.querySelector("#IBAN").value);
            const swift = this.checkIfdataChanged(this.currentWallet[0].requisites.swift, document.querySelector("#SWIFT").value);
            // 
            benefName !== null ? editedWallet["requisites.beneficiary_name"] = document.querySelector("#benefName").value : null;
            benefAddress !== null ? editedWallet["requisites.beneficiary_address"] = document.querySelector("#benefAddress").value : null;
            walletName !== null ? editedWallet["name"] = document.querySelector("#walletName").value : null;
            bankName !== null ? editedWallet["requisites.bank_name"] = document.querySelector("#bankName").value : null;
            bankAddress !== null ? editedWallet["requisites.bank_address"] = document.querySelector("#bankAddress").value : null;
            accountNum !== null ? editedWallet["requisites.account_number"] = document.querySelector("#accountNum").value : null;
            iban !== null ? editedWallet["requisites.iban"] = document.querySelector("#IBAN").value : null;
            swift !== null ? editedWallet["requisites.swift"] = document.querySelector("#SWIFT").value : null;
            // 
            // Check If modified than send Request to Server
            const checkEmptyObj = this.checkedEmptyObj(editedWallet);
            if (!checkEmptyObj) {
                // 
                // Loading GIF appear and scroll onn
                this.loadingGif.style.display = "flex";
                await this.editWalletRequest(this.currentWallet[0]._id, editedWallet);
                //
                 // Request for data 
                const data = {
                    filter: this.filter,
                    skip: 0,
                    limit: 10
                };
                const response = await this.getWalletsPart(data);
                this.walletsArr = response.wallets;
                this.walletsNum = response.counts;
                // 
                // Table cleaning
                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";
                this.containerPages.innerHTML = "";
                // 
                // Render wallets 
                this.countNextPage(this.walletsArr, this.walletsNum);
                //
                // Loading GIF off and scroll off
                this.loadingGif.style.display = "none";
            } 
            // 
            // Loading GIF off and scroll off
            this.filterEditWallet.style.display = "none";
            document.body.classList.remove("modal-open");
            // 
            // Clean edit popUp
            const requiredEdit = document.querySelectorAll(".requiredEdit");
            requiredEdit.forEach(inp => inp.value = ""); 
        }
    }

    editWallet = async (e) => {
        // Loading GIF appear and scroll off
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");
        // 
        // Show PopUp Window
        document.querySelector(".editWallet_title").innerHTML = "EDIT WALLET";
        document.querySelector("#editWallet_action").innerHTML = "Edit";
        this.filterEditWallet.style.display = "flex";
        this.filterEditWallet.addEventListener("click", (event) => {
            if (event.target === this.filterEditWallet){
                this.filterEditWallet.style.display = "none";
                document.body.classList.remove("modal-open");
                // Clean edit popUp
                const requiredEdit = document.querySelectorAll(".requiredEdit");
                requiredEdit.forEach(inp => inp.value = ""); 
            }
        });
        //
        // Specify wallet ID
        const id = e.target.closest("tr").children[7].textContent.trim();
        this.currentTr = e.target.closest("tr");
        // 
        // Find Wallet Data from DB
        this.currentWallet = await this.getWalletById(id);
        // 
        // Render Wallet data to PopUp Window
        document.querySelector("#walletName").value = this.currentWallet[0].name;
        document.querySelector("#benefName").value = this.currentWallet[0].requisites.beneficiary_name;
        document.querySelector("#benefAddress").value = this.currentWallet[0].requisites.beneficiary_address;
        document.querySelector("#bankName").value = this.currentWallet[0].requisites.bank_name;

        document.querySelector("#bankAddress").value = this.currentWallet[0].requisites.bank_address;
        document.querySelector("#accountNum").value = this.currentWallet[0].requisites.account_number;
        document.querySelector("#IBAN").value = this.currentWallet[0].requisites.iban;
        document.querySelector("#SWIFT").value = this.currentWallet[0].requisites.swift;
        // 
        // Event for button Edit inside PopUp
        document.querySelector("#editWallet_action").removeEventListener("click", this.createMerchantCheckData);
        document.querySelector("#editWallet_action").addEventListener("click", this.editWalletCheckData);
        // 
        // Loading GIF appear and scroll off
        this.loadingGif.style.display = "none";
        //
    }

    alertWindow = (text) => {
        document.body.classList.add("modal-open");
        var filter =  document.querySelector(".alert_filter");
        filter.style.display = "flex";
        document.querySelector("#alert_body_text").innerHTML = text;
        document.querySelector("#alert_button").onclick = (event) =>{
            event.preventDefault();
            document.body.classList.remove("modal-open");
            filter.style.display = "none";
        } 
    }

    checkedEmptyObj = (obj) => {
        for (let key in obj) {
            return false; // wrong
        }
        return true; // is epmty
    }

    checkedEmptyArray = (arr) => {
        var result = [];
        arr.forEach((item) => {
            item.value ? result.push(true) : result.push(false);
        });
        return result.some((item) => item === false);
    };

    clearFilter = () => {
        this.filter = {};
        Object.assign(this.filter, this.permissionFilter);
        document.querySelector("#search-input").value = "";
        document.querySelectorAll("select").forEach(item => item.value = "");
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";
        this.countNextPage(this.walletsArr, this.walletsNum);
    }

    filterList = async () => {
        // Loading GIF appear and scroll off
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");
        //
        this.filter = {};
        Object.assign(this.filter, this.permissionFilter);
        // 
        const merchantName = document.querySelector("#filterMerchant").value;
        const type = document.querySelector("#filterType").value;
        //
        // Add filter criteria to obj
        merchantName ? this.filter.merchant_name = merchantName : null;
        type ? this.filter.type = type : null;
        // 
        // Request for data 
        const data = {
            filter: this.filter,
            skip: 0,
            limit: 10
        };
        const response = await this.getWalletsPart(data);
        // Table cleaning
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";
        // 
        // Render wallets 
        this.countNextPage(response.wallets, response.counts);
        // 
        // Loading GIF appear and scroll off
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    renderNextPage = (page) => {
        this.buttonNext = document.createElement("button");
        this.buttonNext.textContent = page;
        this.buttonNext.classList.add("nextPage-btn");
        this.containerPages.appendChild(this.buttonNext);
    }

    
    countNextPage = (arr, numbersOfpages) => {
        this.renderWallets(arr);
        let lastPage = numbersOfpages / 10;

        if(lastPage > 3){
            lastPage !== parseInt(lastPage) ? lastPage = parseInt(lastPage) + 1 : "";
            for (let i = 1; i < 4; i++) {
                this.renderNextPage([i]);
            }
            const dotts = document.createElement("span");
            dotts.textContent = "...";
            dotts.classList.add("dotts");
            this.containerPages.appendChild(dotts);
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
                const nextList = await this.getWalletsPart(data);

                // Loading GIF appear and scroll off
                this.loadingGif.style.display = "none";
                document.body.classList.remove("modal-open");

                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";
                
                this.renderWallets(nextList.wallets);

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
    }


    checkClickedPages = (event) => {
        this.buttonsPage = document.querySelectorAll(".nextPage-btn");
        this.buttonsPage.forEach((btn) => {
            event === +(btn.textContent) ? btn.classList.add("highlight") : btn.classList.remove("highlight");;
        });
    };


    renderOption = (container, arr) => {
        arr.forEach(item => {
            let option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            container.appendChild(option);
        });
    }


    listOfMerchantName = async () => {
        const merchantArr = await this.getAllMerchants();
        const merchantNames = merchantArr.map(item => item.name);
        const container = document.querySelector("#filterMerchant");
        this.renderOption(container, merchantNames);
        this.renderOption(document.querySelector("#merchant"), merchantNames);
    }


    getUserByFilter = async (filter) => {
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
        const currentUser_id = document.querySelector('.curentUserID').textContent.trim()
        const currentUserData = await this.getUserByFilter({'_id': currentUser_id})
        const merchantsName = currentUserData.users[0].merchantList.map(item => item.name)
        this.renderOption(document.querySelector('#filterMerchant'), merchantsName)
        this.renderOption(document.querySelector("#merchant"), merchantsName);
        this.permissionFilter = {'merchant_name': { $in: merchantsName }}
        Object.assign(this.filter, this.permissionFilter)
    }
    

    saveLocalWallets = async () => {
        // Permission access for Solution Manager
        this.currentUserRole = document.querySelector('.curentUserRole').textContent.trim();
        if (this.currentUserRole === 'Merchant Manager') {
            await this.permissionMerchantManager();
        } else {
            // Get List of Merchant
            this.listOfMerchantName();
        }
        const data = {
            filter: this.filter,
            skip: 0,
            limit: 10
        }
        const res = await this.getWalletsPart(data);
        this.walletsArr = res.wallets;
        this.walletsNum = res.counts;
        this.countNextPage(this.walletsArr, this.walletsNum);
    }


    getWalletById = async (id) => {
        return  await fetch("http://18.216.223.81:3000/getWalletById", {
            method: "POST",
            body: JSON.stringify({id}),
            headers:{'Content-Type': 'application/json'}
        })
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err, "Error with uploding Wallets, Front-End!");
        });
    }

    
    getWalletsPart = async (data) => {
        return  await fetch("http://18.216.223.81:3000/getWalletsPart", {
            method: "POST",
            body: JSON.stringify(data),
            headers:{'Content-Type': 'application/json'}
        })
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err, "Error with uploding Wallets, Front-End!");
        });
    }


    checkDate = (data) => {
        return data === "" || !data ? data = "mm/dd/yyyy" : data = moment(data).format('ll');
    }


    renderWallets = arr => {
        this.container = document.getElementById("table-list");
        arr.forEach((item) => {
            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1 transaction">${this.checkDate(item.creation_date)}</td> 
                    <td class="column2 transaction table_wallets--wallet-name">${item.name}</td> 
                    <td class="column3 transaction">${item.type}</td> 
                    <td class="column4 transaction table_wallets--wallet-balance">${item.balance}</td> 
                    <td class="column5 transaction table_wallets--wallet-currency">${item.currency}</td> 
                    <td class="column6 transaction table_wallets--merchant-name">${item.merchant_name}</td> 
                    <td class="column7">
                        <img class="editWallet_btn" src="./img/edit.png" alt="edit">
                    </td>
                    <td class="hide" id='walletId'>${item._id}</td>
                    `;
            this.container.appendChild(this.userList);
        });
        // 
        // Remove Loading
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
        // 
        // Edit Wallets Event
        document.querySelectorAll(".editWallet_btn").forEach(btn => btn.addEventListener("click", this.editWallet));
        // 
        // Events for every tr
        this.transactionPopUp();
    }

    render(){
        // First page load
        this.saveLocalWallets();
        // 
        // Show Filter Button
        document.querySelector("#showBtn").addEventListener("click", this.filterList);
        document.querySelector("#clearFilterBtn").addEventListener("click", this.clearFilter);
        // 
        // Create Merchant event
        document.querySelector("#createBank-button").addEventListener("click", this.createWallet);
        //
        // Search function
        document.querySelector("#search-button").addEventListener("click", this.searchFunction);
        document.querySelector("#search-input").addEventListener("keyup", () => {
            event.preventDefault();
            event.keyCode === 13 ? this.searchFunction() : "";
        }); 
        // 
        // Download XLS Tip
        document.querySelector("#dowloadXLS").addEventListener("click", this.jsonToXls);
        this.hoverXLS();
    }
}

const wallets = new Wallets();