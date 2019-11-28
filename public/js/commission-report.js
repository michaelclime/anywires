class Commission {
    constructor(){
        this.filter = {};
        this.firstCommissionArr = [];
        this.commissionsArr = [];
        this.commArrNum = 0;
        this.loadingGif = document.querySelector("#loadingGif");
        this.containerPages = document.querySelector(".nextPage-block");
        this.render();
    }

    searchFunction = async () => {
        // Loading GIF On
        this.loadingGIF.style.display = "flex";

        this.phrase = document.getElementById('search-input').value;
        this.filter = { $text: { $search: this.phrase } };

        if (this.phrase) {
            // this.length = await this.getBanks_Number(this.filter);
            // this.filterList = await this.getBanks(0, this.filter);
            const res = await this.getCommissionsPart(0, this.filter);

            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            this.countNextPage(res.commissions, res.counts);
        }

        // Loading GIF Off
        this.loadingGIF.style.display = "none";
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

   getAllBanks = async () => {
        return  await fetch("http://18.216.223.81:3000/getBanks")
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

    listOfBankNames = async () => {
        const bankArr = await this.getAllBanks();
        const bankNames = bankArr.map(item => item.name);
        const uniqueBankName = this.uniqueArr(bankNames);
        this.renderOption(document.querySelector("#filterBank"), uniqueBankName);
    }

    listOfMerchantName = async () => {
        const merchantArr = await this.getAllMerchants();
        const merchantNames = merchantArr.map(item => item.name);
        const uniqueMerchantName = this.uniqueArr(merchantNames);
        const container = document.querySelector("#filterMerch");
        this.renderOption(container, uniqueMerchantName);
    }

    clearFilter = () => {
        this.filter = {};
        document.querySelector("#search-input").value = "";
        document.querySelectorAll("select").forEach(item => item.value = "");
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";
        this.countNextPage(this.firstCommissionArr, this.commArrNum);
    }

    filterList = async () => {
        // Loading GIF appear and scroll off
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");
        //
        this.filter = {};
        const commBank = document.querySelector("#filterBank").value;
        const commMerch = document.querySelector("#filterMerch").value;
        const commCurrency = document.querySelector("#filterCurrency").value;
        const commType = document.querySelector("#filterType").value;
        //
        // Add filter criteria to obj
        commBank ? this.filter.bank = commBank : null;
        commMerch ? this.filter.merchant = commMerch : null;
        commCurrency ? this.filter.currency = commCurrency : null;
        commType ? this.filter.type = commType : null;
        // 
        // Request for data 
        const res = await this.getCommissionsPart(0, this.filter);
        // 
        // Table cleaning
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";
        // 
        // Render wallets 
        this.countNextPage(res.commissions, res.counts);
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
        this.renderCommissionTable(arr);
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
            for (let i = 0; i <= lastPage; i++) {
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

                var nextList = await this.getCommissionsPart(listNumber, this.filter);

                // Loading GIF appear and scroll off
                this.loadingGif.style.display = "none";
                document.body.classList.remove("modal-open");

                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";
                
                this.renderCommissionTable(nextList.commissions);
                this.commissionsArr = nextList.commissions;

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

    getCommissionsPart = async (number, filter) => {
        return  await fetch("http://18.216.223.81:3000/getCommissionsPart", {
            method: "POST",
            body: JSON.stringify({number, filter}),
            headers:{'Content-Type': 'application/json'}
        })
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err, "Error with uploding Commission Part, Front-End!");
        });
    }

    renderCommissionTable = (arr) => {
        const container = document.getElementById("table-list");
        arr.forEach((commission) => {
            const commissionsList = document.createElement("tr");
            commissionsList.innerHTML = `
                <td class="column1">${commission.type}</td> 
                <td class="column2">${commission.currency}</td> 
                <td class="column3">${commission.amount}</td> 
                <td class="column4">${commission.bank}</td> 
                <td class="column5">${commission.merchant}</td> 
            `;
            container.appendChild(commissionsList);
        });
    }

    saveLocalCommissions = async () => {
        const res = await this.getCommissionsPart(0, {});
        this.firstCommissionArr = res.commissions;
        this.commArrNum = res.counts;
        this.countNextPage(this.firstCommissionArr, this.commArrNum);

        // Loading GIF Off
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    render(){
        this.saveLocalCommissions();
        this.listOfMerchantName();
        this.listOfBankNames();
        document.querySelector("#showFilterBtn").addEventListener("click", this.filterList);
        document.querySelector("#clearFilterBtn").addEventListener("click", this.clearFilter);
    }
}

const commission = new Commission();