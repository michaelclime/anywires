class Wallets {
    constructor(){
        this.walletsArr = [];
        this.walletsNum = 0;
        this.currentWallet = [];
        this.currentTr = null;
        this.filter = {};
        this.containerPages = document.querySelector(".nextPage-block");
        this.loadingGif = document.querySelector("#loadingGif");
        this.filterEditWallet = document.querySelector(".filter_editWallet");
        this.currentUser = document.querySelector(".userName");
        this.render();
    }

    searchFunction = async () => {
        // Loading GIF On
        this.loadingGif.style.display = "flex";

        const phrase = document.getElementById('search-input').value;
        this.filter = { $text: { $search: phrase } };

        if (phrase) {
            const res = await this.getWalletsPart(0, this.filter);

            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            this.countNextPage(res.wallets, res.counts);
        }

        // Loading GIF Off
        this.loadingGif.style.display = "none";
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

    uniqueArr = (arr) => {
        var result = [];
        arr.forEach((item) => {
            if (!result.includes(item)) {
                result.push(item);
            }
        });
        return result;
    }

    renderOption = (container, Arr) => {
        Arr.forEach(item => {
            let option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            container.appendChild(option);
        });
    }

    listOfMerchantName = async () => {
        const merchantArr = await this.getAllMerchants();
        const merchantNames = merchantArr.map(item => item.name);
        const uniqueMerchantName = this.uniqueArr(merchantNames);
        const container = document.querySelector("#filterMerchant");
        this.renderOption(container, uniqueMerchantName);
        this.renderOption(document.querySelector("#merchant"), uniqueMerchantName);
    }

    createMerchantRequest = async (newWallet) => {
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

    createMerchantCheckData = async () => {
        const createdBy = this.currentUser.textContent.trim();
        const requiredCreate = this.checkedEmptyArray(document.querySelectorAll(".requiredCreate"));
        if(requiredCreate){
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
            // Loading GIF off and scroll off
            this.loadingGif.style.display = "none";
        }
    }

    createWallet = () => {
        // Scroll off
        document.body.classList.add("modal-open");
        // 
        // Show PopUp Window
        document.querySelector(".editWallet_title").innerHTML = "CREATE WALLET";
        document.querySelector(".createWallet_main").style.display = "flex";
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
                // Change table info
                this.currentTr.children[1].innerHTML = document.querySelector("#walletName").value;
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
        let walletName = document.querySelector("#walletName").value = this.currentWallet[0].name;
        let benefName = document.querySelector("#benefName").value = this.currentWallet[0].requisites.beneficiary_name;
        let benefAddress = document.querySelector("#benefAddress").value = this.currentWallet[0].requisites.beneficiary_address;
        let bankName = document.querySelector("#bankName").value = this.currentWallet[0].requisites.bank_name;

        let bankAddress = document.querySelector("#bankAddress").value = this.currentWallet[0].requisites.bank_address;
        let accountNum = document.querySelector("#accountNum").value = this.currentWallet[0].requisites.account_number;
        let IBAN = document.querySelector("#IBAN").value = this.currentWallet[0].requisites.iban;
        let SWIFT = document.querySelector("#SWIFT").value = this.currentWallet[0].requisites.swift;
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
        const merchantName = document.querySelector("#filterMerchant").value;
        const type = document.querySelector("#filterType").value;
        //
        // Add filter criteria to obj
        merchantName ? this.filter.merchant_name = merchantName : null;
        type ? this.filter.type = type : null;
        // 
        // Request for data 
        const response = await this.getWalletsPart(0, this.filter);console.log(response);
        // 
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
                // Loading GIF appear and scroll off
                this.loadingGif.style.display = "flex";
                document.body.classList.add("modal-open");

                var currentEvent = +(event.target.textContent);
                var listNumber = ((currentEvent*10)-10);

                var nextList = await this.getWalletsPart(listNumber, this.filter);

                // Loading GIF appear and scroll off
                this.loadingGif.style.display = "none";
                document.body.classList.remove("modal-open");

                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";
                
                this.renderWallets(nextList.wallets);
                this.walletsArr = nextList.wallets;

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
    
    saveLocalWallets = async () => {
        const response = await this.getWalletsPart(0);
        this.walletsArr = response.wallets;
        this.walletsNum = response.counts;
        this.countNextPage(this.walletsArr, this.walletsNum);
        // this.renderWallets(this.walletsArr);
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

    getWalletsPart = async (number, filter) => {
        return  await fetch("http://18.216.223.81:3000/getWalletsPart", {
            method: "POST",
            body: JSON.stringify({number, filter}),
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
                    <td class="column1">${this.checkDate(item.creation_date)}</td> 
                    <td class="column2">${item.name}</td> 
                    <td class="column3">${item.type}</td> 
                    <td class="column4">${item.balance}</td> 
                    <td class="column5">${item.currency}</td> 
                    <td class="column6">
                        ${item.merchant_name}
                        
                    </td> 
                    <td class="column7">
                        <img class="editWallet_btn" src="./img/edit.png" alt="edit">
                    </td>
                    <td class="hide">${item._id}</td>
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
    }

    render(){
        // First page load
        this.saveLocalWallets();
        // 
        // Get List of Merchant
        this.listOfMerchantName();
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
    }
}

const wallets = new Wallets();