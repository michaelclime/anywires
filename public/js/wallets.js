class Wallets {
    constructor(){
        this.walletsArr = [];
        this.walletsNum = 0;
        this.filter = {};
        this.containerPages = document.querySelector(".nextPage-block");
        this.loadingGif = document.querySelector("#loadingGif");
        this.render();
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

                var currentEvent = +(event.target.textContent);
                var listNumber = ((currentEvent*10)-10);

                var nextList = await this.getWalletsPart(listNumber, this.filter);

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
    
    saveLocalWallets = async () => {
        const response = await this.getWalletsPart(0);
        this.walletsArr = response.wallets;
        this.walletsNum = response.counts;
        this.countNextPage(this.walletsArr, this.walletsNum);
        // this.renderWallets(this.walletsArr);
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
                    <td class="column1">${this.checkDate(item.creating_date)}</td> 
                    <td class="column2">${item.name}</td> 
                    <td class="column2">${item.type}</td> 
                    <td class="column2">${item.balance}</td> 
                    <td class="column2">${item.currency}</td> 
                    <td class="column2">${item.merchant_name}</td> 
                    `;
            this.container.appendChild(this.userList);
        });
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    render(){
        this.saveLocalWallets();
    }
}

const wallets = new Wallets();