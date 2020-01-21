// Remove menu items for permissions START

const userRole = document.querySelector('.curentUserRole').textContent.trim()
if (userRole === 'Crm InvoiceManager' || userRole === 'Crm SuccessManager' || userRole === 'Merchant Manager') {
    document.querySelector('.gn-menu__banks').remove()
} 

// Remove menu items for permissions END

class Commission {
    constructor(){
        this.filter = {};
        this.dateFrom = "";
        this.dateTill = "";
        this.firstCommissionArr = [];
        this.commissionsArr = [];
        this.commArrNum = 0;
        this.loadingGif = document.querySelector("#loadingGif");
        this.containerPages = document.querySelector(".nextPage-block");
        this.render();
    }

    jsonToXls = async () => {
        // Loading GIF appear and scroll on
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");
        //
        const createXLSLFormatObj = [];
 
        /* XLS Head Columns */
        const xlsHeader = ["Crated By", "Amount", "Currency", "Type", "Percentage", "Flat", "Addittional", "Bank commission", "Left from transfer", "Bank", "Merchant", "Creation date"];
        
        // /* XLS Rows Data */
        const res = await this.getCommissionsPart(0, "", this.filter, this.dateFrom, this.dateTill);
        const xlsRows = res.commissions;
        
        // Removing ID field and changing Date format
        xlsRows.forEach((item) => {
            delete item["_id"];
            delete item["__v"];
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
        var filename = `commission-report-${moment(new Date()).format("YYYY-MM-DD")}.xlsx`;
 
        /* Sheet Name */
        var ws_name = "commissionReport";
 
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

    saveXls = () => {
        // Loading GIF appear and scroll on
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");
        //
        var tbl = document.getElementById('table_commission');
        var wb = XLSX.utils.table_to_book(tbl, {
            sheet: "Commission Report Table",
            display: true
        });

        var wbout = XLSX.write(wb, {bookType: "xlsx", bookSST: true, type: "binary"});
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };
        
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), `commission-report-${moment(new Date()).format("YYYY-MM-DD")}.xlsx`);

        // Loading GIF off and scroll off
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
        // Loading GIF On
        this.loadingGIF.style.display = "flex";
        this.phrase = document.getElementById('search-input').value;
        this.filter = { $text: { $search: this.phrase } };
        if (this.phrase) {
            const res = await this.getCommissionsPart(0, 10, this.filter);
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
        const creationDate = document.querySelector("#creationDate").value;
        //
        // Add date Filter
        if (creationDate.length > 20) {
            const DATE = creationDate.split("—");
            this.dateFrom = new Date(DATE[0].trim());
            this.dateTill = new Date(DATE[1].trim());
        } 
        if (creationDate.length < 20) {
            this.dateFrom = new Date(creationDate.trim());
            this.dateTill = false;
            console.log(this.dateFrom)
        } 
        // 
        // Add filter criteria to obj
        commBank ? this.filter.bank = commBank : null;
        commMerch ? this.filter.merchant = commMerch : null;
        commCurrency ? this.filter.currency = commCurrency : null;
        commType ? this.filter.type = commType : null;
        // 
        // Request for data 
        const res = await this.getCommissionsPart(0, 10, this.filter, this.dateFrom, this.dateTill);
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

                var nextList = await this.getCommissionsPart(listNumber, 10, this.filter);

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

    getCommissionsPart = async (number, limit, filter, dateFrom, dateTill) => {
        return  await fetch("http://18.216.223.81:3000/getCommissionsPart", {
            method: "POST",
            body: JSON.stringify({number, limit, filter, dateFrom, dateTill}),
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
            const currency = commission.currency === "USD" ? "$" : "€";
            const commissionsList = document.createElement("tr");
            commissionsList.innerHTML = `
                <td class="column1">
                    <div class="commDate">
                        ${moment(commission.creation_date).format("ll")}
                    </div>
                    <div>
                        ${commission.type}
                    </div>
                </td> 
                <td class="column2">${commission.currency}</td> 
                <td class="column3">${commission.amount}${currency}</td> 
                <td class="column4">${Math.floor(commission.percentage)}%</td> 
                <td class="column5">${commission.flat ? commission.flat : 0}€</td> 
                <td class="column6">${commission.additional ? commission.additional : 0}€</td> 
                <td class="column7">${commission.bank ? commission.bank : '-'}</td> 
                <td class="column8">${commission.merchant}</td> 
            `;
            container.appendChild(commissionsList);
        });
    }

    saveLocalCommissions = async () => {
        const res = await this.getCommissionsPart(0, 10, {});
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
        this.hoverXLS();
        
        document.querySelector("#showFilterBtn").addEventListener("click", this.filterList);
        document.querySelector("#clearFilterBtn").addEventListener("click", this.clearFilter);
        document.querySelector("#dowloadPdf").addEventListener("click", this.jsonToXls);
    }
}

const commission = new Commission();