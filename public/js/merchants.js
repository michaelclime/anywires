class MerchantList {
    constructor(){
        this.ArrayLIst = [];
        this.numbersMerchants = "";
        this.buttonCreate_merchant = document.querySelector("#create-button");
        this.btnExel = document.querySelector("#dowloadXls");
        this.buttonSearch = document.getElementById("search-button");
        this.containerPages = document.querySelector(".nextPage-block");
        this.loadingGif = document.querySelector("#loadingGif");
        this.modalAdd_merchant = document.querySelector("#modalCreate-btn");
        this.render();
    }

    checkEmpty = (data) => {
        var s = [];
        data.forEach((item) => {
            s.push(item.value.replace(/^\s+|\s+$/g, ''));
        });
        const checkEmpty = s.some((item) => item === "");
        return checkEmpty;
    }

    initCreate_Merchant = () => {
        // Loading GIF ON
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");

        this.data = document.querySelectorAll(".allData");
        this.b2bCheckBox = document.querySelector("#b2b");
        this.feesData = document.querySelectorAll(".feesData");
        this.b2bCheckBox.checked ? this.valueB2B = true : this.valueB2B = false;
        var createdBy = document.querySelector(".currentUser").textContent.trim();
        this.newMerchant = {
            "name": this.data[0].value,
            "b2b" : this.valueB2B,
            "fees" : {
                "setup_units" : Number(this.feesData[0].value),
                "wire_recall_units" : Number(this.feesData[1].value),
                "settlement_units" : Number(this.feesData[2].value),
                "monthly_units" : Number(this.feesData[3].value),
                "incoming_transfer_units " : Number(this.feesData[4].value),
                "incoming_transfer_percent" : (this.feesData[5].value)/100,
                "settlement_percent" : (this.feesData[6].value)/100,
                "settlement_return" : (this.feesData[7].value)/100,
                "refund_units" : Number(this.feesData[8].value),
                "refund_percent" : (this.feesData[9].value)/100
            },
            "specifications" : {
                "background" : this.data[5].value,
                "first_color" : this.data[6].value,
                "second_color" : this.data[7].value,
                "logo" : "",
                "tagline" : this.data[4].value
            },
            "support_email":this.data[3].value,
            "promo_code": this.data[1].value,
            "users" : {
               "affiliate": this.data[2].value,
               "merchant_manager" : "",
               "invoice_manager" : "",
               "solution_manager" : ""
            },
            "wallets" : [],
            "available_banks" : [],
            "created_by": createdBy
        };

        var checkEmpty = '';

        // if B2B is True
        this.dataIfB2B = document.querySelectorAll(".dataIfB2B");
        this.requiredFields = document.querySelectorAll(".requiredField");
        if(this.B2B.checked) {
            this.newObj = {
                "specifications_b2b": {
                    "beneficiary_name": this.dataIfB2B[0].value,
                    "beneficiary_address" : this.dataIfB2B[1].value,
                    "bank_name" : this.dataIfB2B[2].value,
                    "bank_address" : this.dataIfB2B[3].value,
                    "iban" : this.dataIfB2B[4].value,
                    "swift" :  this.dataIfB2B[5].value
                }
            };
            Object.assign(this.newMerchant, this.newObj);
            checkEmpty = this.checkEmpty(this.requiredFields); 
            var checkEmptySecond = this.checkEmpty(this.dataIfB2B);
            checkEmptySecond === false && checkEmpty === false ? checkEmpty = false : checkEmpty = true;
        } else if(!this.B2B.checked){
            this.newObj = {
                "specifications_b2b": {
                    "beneficiary_name": "",
                    "beneficiary_address" : "",
                    "bank_name" : "",
                    "bank_address" : "",
                    "iban" : "",
                    "swift" :  ""
                }
            };
            Object.assign(this.newMerchant, this.newObj);
            checkEmpty = this.checkEmpty(this.requiredFields); 
        }

        if (checkEmpty === true) {
            alert("Please fill put all required fields!");
        } else {
            fetch("http://18.216.223.81:3000/postMerchant", {
            // fetch("http://18.216.223.81:3000/postMerchant", {
                method: "POST",
                body: JSON.stringify(this.newMerchant),
                headers:{'Content-Type': 'application/json'}
                })
                .then(res => {
                    res.text();
                }) 
                .then(async () => {
                    this.container = document.getElementById("table-list");
                    this.container.innerHTML = "";
                    this.ArrayLIst = [];
                    this.containerPages.innerHTML = "";

                    await this.saveLocalBanks();
                })
                .catch(err => {
                    console.log(err);
                });

        this.dataIfB2B.forEach((item) => item.value = "");
        this.data.forEach((item) => item.value = "");
        this.block = document.querySelector(".if_B2B_true-block");
        this.block.style.display = "none"; 
        this.filterFees.style.display = "none";
        this.B2B.checked = false;
        }
    }

    nextArea = () => {
        this.filter.style.display = "none";
        this.filterFees = document.querySelector(".filterFess");
        this.filterFees.style.display = "flex";

        this.filterFees.addEventListener("click", (event) => {
            event.target === this.filterFees ? this.filterFees.style.display = "none" : "";
        });

        this.btn_Back = document.querySelector("#modalBack");
        this.btn_Back.addEventListener("click", () => {
            this.filterFees.style.display = "none";
            this.createMerchant();
        });

        
        
    }

    createMerchant = () => {
        this.filter = document.querySelector(".filter");
        this.filter.style.display = "flex";

        this.filter.addEventListener("click", (event) => {
            event.target === this.filter ? this.filter.style.display = "none" : "";
        });

        // If B2B true
        this.B2B = document.querySelector("#b2b");
        this.B2B.addEventListener("click", () => {
            this.block = document.querySelector(".if_B2B_true-block");
            if (this.B2B.checked) {
                this.block.style.display = "flex";
            } else if (!this.B2B.checked) {
                this.block.style.display = "none"; 
            } 
        });
        // If B2B true
        this.nextAreaFees_btn = document.querySelector("#nextModal");
        this.nextAreaFees_btn.addEventListener("click", this.nextArea);
    }

    saveXls = () => {
        // For hide not useless element XLS
        let col6 = document.querySelectorAll(".column6");
        col6.forEach((item) => item.style.display = "none");
        setTimeout(() => {
            col6.forEach((item) => item.style.display = "table-cell");
        },10);
        // For hide not useless element XLS

        var tbl = document.getElementById('main-table');
        var wb = XLSX.utils.table_to_book(tbl, {
            sheet: "Merchants table",
            display: true
        });

        var wbout = XLSX.write(wb, {bookType: "xlsx", bookSST: true, type: "binary"});
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'merchants_table.xlsx');
    }

    searchFunction = async () => {
        // Loading GIF ON
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");

        var phrase = document.getElementById('search-input').value;

        this.filter = { $text: { $search: phrase } };

        if(phrase){
            const lengthInvoice = await this.getNumber_Merchants(this.filter);
            const filterList = await this.getMerchants(0, this.filter);

            // Очищаємо таблицю
            this.container = document.getElementById("table-list");
            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            this.countNextPage(filterList, lengthInvoice.numbers);
          }
          // Loading GIF ON
            this.loadingGif.style.display = "none";
            document.body.classList.remove("modal-open");
    }

    countNextPage = (arr, numbersOfpages) => {
        this.loadMerchants(arr);
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

                // Loading GIF ON
                this.loadingGif.style.display = "flex";
                document.body.classList.add("modal-open");

                this.currentEvent = +(event.target.textContent);
                this.listNumber = ((this.currentEvent*10)-10);

                this.nextList = await this.getMerchants(this.listNumber, this.filter);

                // Loading GIF OFF
                this.loadingGif.style.display = "none";
                document.body.classList.remove("modal-open");

                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";
                
                this.loadMerchants(this.nextList);

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

    saveLocalBanks = async (array) => {
        this.numbersMerchants = await this.getNumber_Merchants();
        array = await this.getMerchants(0);
        array.forEach((item) => {
            this.ArrayLIst.push(item);
        });
        this.countNextPage(this.ArrayLIst, this.numbersMerchants.numbers);
    }

    getMerchants = async (number, filter) => {
        return  await fetch("http://18.216.223.81:3000/getPart-Merchants", {
        // return  await fetch("http://18.216.223.81:3000/getPart-Merchants", {
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

    getNumber_Merchants = async (filter) => {
        return  await fetch("http://18.216.223.81:3000/getNumber-Merchants", {
        // return  await fetch("http://18.216.223.81:3000/getNumber-Merchants", {
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

    loadMerchants(arr){
        this.container = document.getElementById("table-list");
        arr.forEach((item) => {
            item === "" ? item = "—" : "";
            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1">${item.name}</td> 
                    <td class="column2">${item.created_by}</td> 
                    <td class="column3">${item.promo_code}</td> 
                    <td class="column4">${item.users.affiliate}</td> 
                    <td class="column5">${(item.fees.incoming_transfer_percent)*100}</td>
                    <td class="column6">${""}</td>
                    <td class="column7"> 
                        <div id="merchantButtons">
                            <button class="buttonView">View</button> 
                            <button class="buttonAddSettle">Add Settle</button>
                        </div>
                    </td>
            `;
        this.container.appendChild(this.userList);
        });

        // Loading GIF OFF after rendering all table
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    render(){
        this.saveLocalBanks();
        this.buttonSearch.addEventListener("click", this.searchFunction);
        this.btnExel.addEventListener("click", this.saveXls);
        this.buttonCreate_merchant.addEventListener("click", this.createMerchant);
        this.modalAdd_merchant.addEventListener("click", this.initCreate_Merchant);
    }
};

const userList = new MerchantList();