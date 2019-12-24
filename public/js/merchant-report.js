class merchantReport {
    constructor(){
        this.filter = {};
        this.firstMerchantsArr = [];
        this.merchantsArrNum = 0;
        this.merchantsArr = [];
        this.dateFrom = "";
        this.dateTill = "";

        this.loadingGif = document.querySelector("#loadingGif");
        this.containerPages = document.querySelector(".nextPage-block");

        document.querySelector("#showFilterBtn").addEventListener("click", this.filterList);
        document.querySelector("#clearFilterBtn").addEventListener("click", this.clearFilter);
        document.querySelector("#dowloadPdf").addEventListener("click", this.jsonToXls);

        this.hoverXLS();
        this.saveLocalMerchantReport();
        this.listOfMerchantName();
    }

    jsonToXls = async () => {
        // Loading GIF appear and scroll on
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");
        //
        const createXLSLFormatObj = [];
 
        /* XLS Head Columns */
        const xlsHeader = ["Balance EUR", "Balance USD", "Name", "Creation date", "Count Invoices", "Affiliate", "Invoice Manager", "Merchant Manager", "Wallet 1", "Wallet 2"];
        let arrLength = 0;
        
        // /* XLS Rows Data */
        // Request for data 
        var data = {
            number: 0, 
            limit: 100000000, 
            filter: this.filter, 
            dateFrom: this.dateFrom, 
            dateTill: this.dateTill
        };
        const res = await this.getMerchantsReport(data);
        
        const xlsRows = res.merchants;
        
        // Removing ID field and changing Date format
        xlsRows.forEach((item) => {
            item["creation_date"] = moment(item.creation_date).format("DD-MM-YYYY");

            delete item["_id"];
            delete item["fees"];
            delete item["b2b"];
            delete item["available_banks"];
            delete item["specifications"];
            delete item["specifications_b2b"];
            delete item["__v"];
            delete item["inside_wallets"];
            delete item["support_email"];
            delete item["wallets"];
            delete item["promo_code"];
            delete item["created_by"];

            item.balance_EUR = item.balance_EUR.balance_available;
            item.balance_USD = item.balance_USD.balance_available;

            item["affiliate"] = item.users.affiliate;
            item[`Invoice manager`] = "";
            item[`Merchant manager`] = "";
            item.users.invoice_manager.map((man) => item[`Invoice manager`] += `${man}` + " ");
            item.users.merchant_manager.map((man) => item[`Merchant manager`] += `${man}` + " ");
            delete item["users"];

            item.walletsReport.map((wal, index) => item[`wallet${index}`] = `${wal.name}: ${wal.balance}` );
            delete item["walletsReport"];

            // Check how many keys in Object for headers editing
            if (arrLength < Object.keys(item).length) {
                arrLength = Object.keys(item).length;
            }
        });

        if (arrLength > xlsHeader.length) {
            let howMany = (arrLength - xlsHeader.length) + 3;
            for (let i = 3; i < howMany; i++) {
                xlsHeader.push(`Wallet${i}`)          
            }
        }

        createXLSLFormatObj.push(xlsHeader);
        $.each(xlsRows, function(index, value) {
            var innerRowData = [];
            $.each(value, function(index, val) {
                innerRowData.push(val);
            });
            createXLSLFormatObj.push(innerRowData);
        });
        

        /* File Name */
        var filename = `merchant-report-${moment(new Date()).format("YYYY-MM-DD")}.xlsx`;
 
        /* Sheet Name */
        var ws_name = "merchantReport";
 
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
 
        /* Add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
 
        /* Write workbook and Download */
        XLSX.writeFile(wb, filename);

        // Loading GIF off and scroll off
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    clearFilter = () => {
        this.filter = {};
        document.querySelector("#creationDate").value = "";
        document.querySelector("#filterName").value = "";
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";
        this.countNextPage(this.firstMerchantsArr, this.merchantsArrNum);
    }

    filterList = async () => {
        // Loading GIF appear and scroll off
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");
        //
        this.filter = {};
        const filterName = document.querySelector("#filterName").value;
        const creationDate = document.querySelector("#creationDate").value;
        //
        // Add date Filter
        if (creationDate.length > 20 && creationDate) {
            const DATE = creationDate.split("—");
            this.dateFrom = new Date(DATE[0].trim());
            this.dateTill = new Date(DATE[1].trim());
        } 
        if (creationDate.length < 20 && creationDate) {
            this.dateFrom = new Date(creationDate.trim());
            this.dateTill = false;
        } 
        // 
        // Add filter criteria to obj
        filterName ? this.filter.name = filterName : null;
        // 
        // Request for data 
        var data = {
            number: 0, 
            limit: 10, 
            filter: this.filter, 
            dateFrom: this.dateFrom, 
            dateTill: this.dateTill
        };
        console.log(data);
        const res = await this.getMerchantsReport(data);
        // 
        // Table cleaning
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";
        // 
        // Render wallets 
        this.countNextPage(res.merchants, res.count);
        // 
        // Loading GIF appear and scroll off
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    listOfMerchantName = async () => {
        const merchantArr = await this.getAllMerchants();
        const merchantNames = merchantArr.map(item => item.name);
        const container = document.querySelector("#filterName");
        this.renderOption(container, merchantNames);
    }

    renderOption = (container, array) => {
        array.forEach(item => {
            let option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            container.appendChild(option);
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

    renderNextPage = (page) => {
        this.buttonNext = document.createElement("button");
        this.buttonNext.textContent = page;
        this.buttonNext.classList.add("nextPage-btn");
        this.containerPages.appendChild(this.buttonNext);
    }

    
    countNextPage = (arr, numbersOfpages) => {
        this.render(arr);
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
                var data = {
                    number: listNumber,
                    limit: 10, 
                    filter: this.filter
                };

                var nextList = await this.getMerchantsReport(data);

                // Loading GIF appear and scroll off
                this.loadingGif.style.display = "none";
                document.body.classList.remove("modal-open");

                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";
                
                this.render(nextList.merchants);
                this.merchantsArr = nextList.merchants;

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


    getMerchantsReport = async (data) => {
        return  await fetch("http://18.216.223.81:3000/get-merchant-report", {
            method: "POST",
            body: JSON.stringify(data),
            headers:{'Content-Type': 'application/json'}
        })
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err, "Error with uploding Commission Part, Front-End!");
        });
    }


    saveLocalMerchantReport = async () => {
        var data = {
            number: 0, 
            limit: 10, 
            filter: this.filter, 
            // dateFrom: new Date(), 
            // dateTill: new Date()
        };
        const res = await this.getMerchantsReport(data);
       
        this.firstMerchantsArr = res.merchants;
        this.merchantsArrNum = res.count;
        this.countNextPage(this.firstMerchantsArr, this.merchantsArrNum);

        // Loading GIF Off
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    render(arr){
        const container = document.getElementById("table-list");
        arr.forEach((merchant) => {
            // const currency = commission.currency === "USD" ? "$" : "€";
            const merchantList = document.createElement("tr");
            merchantList.innerHTML = `
                <td class="column1">
                    <div class="commDate">
                        ${moment(merchant.creation_date).format("ll")}
                    </div>
                    <div>
                        ${merchant.name}
                    </div>
                </td> 
                <td class="column2">${merchant.users.affiliate}</td> 
                <td class="column3">${merchant.countInvoice}</td> 
                <td class="column4">${merchant.balance_EUR.balance_available}€</td> 
                <td class="column5">${merchant.balance_USD.balance_available}$</td> 
                <td class="column6">
                    ${  
                        merchant.walletsReport 
                        ?
                        merchant.walletsReport.map((wallet) => {
                            return ` 
                            <div class="walletItem">
                                ${wallet.name}: 
                                ${wallet.balance}${wallet.currency === "USD" ? "$" : "€"}
                            </div>
                            `
                        }).join(" ").split(',')
                        :
                        0
                    }
                </td> 
            `;
            container.appendChild(merchantList);
        });
    }
}

const merchant_report = new merchantReport();