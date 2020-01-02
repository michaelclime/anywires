// Remove menu items for permissions START
const userRole = document.querySelector('.curentUserRole').textContent.trim()
if (userRole === 'Crm InvoiceManager' || userRole === 'Crm SuccessManager' || userRole === 'Merchant Manager') {
    document.querySelector('.gn-menu__banks').remove()
} 
// Remove menu items for permissions END

class MerchantList {
    constructor(){
        this.filter = {};
        this.ArrayList = [];
        this.numbersMerchants = 0;
        this.containerPages = document.querySelector(".nextPage-block");
        this.loadingGif = document.querySelector("#loadingGif");
        this.currentUserRole = document.querySelector('.curentUserRole').textContent.trim();
        this.render();
    }


    editMerchant = async () => {
        if (this.currentUserRole !== 'Crm InvoiceManager') {
            const allTd = document.querySelectorAll(".edit");
            allTd.forEach((td) => {
                td.addEventListener("click", () => {
                    const merchantName = td.parentElement.children[0].textContent;
                    document.location.href = "http://18.216.223.81:3000/create-merchant?&" + merchantName;
                });
            });
        } 
    }


    createMerchant = () => {
        // Loading GIF ON
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");
        document.location.href = "http://18.216.223.81:3000/create-merchant";
    }


    saveXls = () => {
        const tbl = document.getElementById('main-table');
        const wb = XLSX.utils.table_to_book(tbl, {
            sheet: "Merchants table",
            display: true
        });

        const wbout = XLSX.write(wb, {bookType: "xlsx", bookSST: true, type: "binary"});
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'merchants_table.xlsx');
    }


    searchFunction = async () => {
        this.filter = {};
        // 
        // Loading GIF ON
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");

        const phrase = document.getElementById('search-input').value;

        this.filter = { $text: { $search: phrase } };

        if (phrase) {
            const data = {
                filter: this.filter,
                skip: 0,
                limit: 10
            };
            const res = await this.getMerchantsPartly(data);

            // Очищаємо таблицю
            this.container = document.getElementById("table-list");
            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            this.countNextPage(res.merchants, res.count);
        }
        // Loading GIF OFF
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
    }


    countNextPage = (arr, numbersOfpages) => {
        this.loadMerchants(arr);
        let lastPage = numbersOfpages / 10;

        if (lastPage > 3) {
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

                // Loading GIF ON
                this.loadingGif.style.display = "flex";
                document.body.classList.add("modal-open");

                const currentEvent = +(event.target.textContent);
                const listNumber = ((currentEvent*10)-10);

                const data = {
                    filter: this.filter,
                    skip: listNumber,
                    limit: 10
                };
                const res = await this.getMerchantsPartly(data);

                // Loading GIF OFF
                this.loadingGif.style.display = "none";
                document.body.classList.remove("modal-open");

                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";
                
                this.loadMerchants(res.merchants);

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
        const buttonsPage = document.querySelectorAll(".nextPage-btn");
        buttonsPage.forEach((btn) => {
            event === +(btn.textContent) ? btn.classList.add("highlight") : btn.classList.remove("highlight");;
        });
    };


    renderNextPage = (page) => {
        const buttonNext = document.createElement("button");
        buttonNext.textContent = page;
        buttonNext.classList.add("nextPage-btn");
        this.containerPages.appendChild(buttonNext);
    }


    saveLocalBanks = async () => {
        const data = {
            filter: this.filter,
            skip: 0,
            limit: 10
        }
        const res = await this.getMerchantsPartly(data)
        this.ArrayList = res.merchants
        this.numbersMerchants = res.count
        this.countNextPage(this.ArrayList, this.numbersMerchants);
    }


    getMerchantsPartly = async (data) => {
        return  await fetch("http://18.216.223.81:3000/get-merchants-partly", {
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


    loadMerchants(arr){
        const container = document.getElementById("table-list");
        arr.forEach((item) => {
            let incTra = item.fees.in_c2b.percent;
            item.b2b === true ? incTra = item.fees.in_b2b.percent : "";
            const userList = document.createElement("tr");
            userList.innerHTML =  `
                    <td class="column1 edit">${item.name}</td> 
                    <td class="column2 edit">${item.created_by}</td> 
                    <td class="column3 edit">${item.promo_code}</td> 
                    <td class="column4 edit">${item.users.affiliate}</td> 
                    <td class="column5 edit">${incTra}</td>

                    <td class="column6 edit">
                        <div class="col_wrapper">
                            <div class="col_item">€${item.balance_EUR.balance_received}</div>
                            <div>$${item.balance_USD.balance_received}</div>
                        </div>
                    </td>

                    <td class="column7 edit">
                        <div class="col_wrapper">
                            <div class="col_item">€${item.balance_EUR.balance_approved}</div>
                            <div>$${item.balance_USD.balance_approved}</div>
                        </div>
                    </td>

                    <td class="column8 edit">
                        <div class="col_wrapper">
                            <div class="col_item">€${item.balance_EUR.balance_available}</div>
                            <div>$${item.balance_USD.balance_available}</div>
                        </div>
                    </td>

                    <td class="column9"> 
                        <div id="merchantButtons">
                            <button class="buttonAddSettle">Add Wallet</button>
                        </div>
                    </td>
            `;
            container.appendChild(userList);
        });

        // Loading GIF OFF after rendering all table
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
        this.editMerchant();
    }


    render(){
        this.saveLocalBanks();

        document.querySelector("#dowloadXls").addEventListener("click", this.saveXls);
        document.querySelector("#create-button").addEventListener("click", this.createMerchant);

        document.getElementById("search-button").addEventListener("click", this.searchFunction);
        document.getElementById("search-input").addEventListener("keyup", () => {
            event.preventDefault();
            event.keyCode === 13 ? this.searchFunction() : "";
        });  
    }
};

new MerchantList();