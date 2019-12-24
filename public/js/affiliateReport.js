const usertypeClass = document.querySelector('.usertypeClass').textContent;

if (usertypeClass === 'admin') {
    selectMenuLoad();
} else {
    const broughtTitle = document.querySelector('.broughtTitle');
    broughtTitle.innerHTML = 'You kindly brought to us this merchants:'
    loadPage();
}

// Create Select Menu of Affiliates
 async function selectMenuLoad() {
    const affNameList = await  fetch('http://18.216.223.81:3000/getAffNameList');
    if (affNameList.status !== 200) {
        Swal.fire('Something went wrong on server side');
    }
    const affList = await affNameList.json();

    const broughtTitle = document.querySelector('.broughtTitle');
    const leftBlockChoosePeriod = document.querySelector('.leftBlockChoosePeriod');
    
    if (broughtTitle) leftBlockChoosePeriod.removeChild(broughtTitle);
    
    const selectMenuDiv = document.querySelector('.selectMenuDiv');
    let selectMenu = document.createElement('select');
    selectMenu.className = 'selectMenu';
    const opt = document.createElement('option');
    opt.innerHTML = `Select Affiliate`;
    selectMenu.append(opt);

    //Load page when chosen affiliate user
    selectMenu.addEventListener('change', async (event) => {
        if (event.target.value && event.target.value !== 'Select Affiliate') {
        // Dates parameters
        let date = document.querySelector('#inputPeriod').value;
        if ( !date.includes('-')) {
            date = 'now';
        }

        // Get all data from DB
        const currentAffName = event.target.value;
        let currentAffEmail = '';
        affList.forEach( (item) => {
            if (item.fullname === currentAffName)
            currentAffEmail = item.email;
        });
        const dataList = await  fetch('http://18.216.223.81:3000/getDatasList/' + currentAffEmail + '/' + date);
        if (dataList.status !== 200) {
            Swal.fire('Something went wrong on server side');
        }
        const Data = await dataList.json();
        if (!Data.merchantsName.length) {
            Swal.fire('Sorry, we don\'t have any info about this affiliate yet.');
        } else {
            loadPage(date, Data);
        }
        } else {
            location.reload();
        }
    });

    affList.forEach( (item) => {
        let option = document.createElement('option');
        option.innerHTML = `${item.fullname}`;
        selectMenu.append(option);
    });
    selectMenuDiv.append(selectMenu);
 }

 // Load page function
async function loadPage(chosenDate, Data)  {
    const affEmail = document.querySelector('.affiliateEmail').textContent; 
    const url = 'https://api.exchangeratesapi.io/latest';
    const getCurrencyJSON = await fetch(url);
    const cerrencyCoefList = await getCurrencyJSON.json();
    const coefEURtoUSD = cerrencyCoefList.rates.USD;

    // Dates parameters
    let date = 0;
    let dateDifference = 1;
    if (chosenDate && chosenDate !== 'now') {
         const datesArr = chosenDate.split('-');
         date = chosenDate;
         dateDifference = Math.round( (new Date(datesArr[1]) - new Date(datesArr[0])) / 86400000 );
    } else {
         date = 'now';
    }

    
    if (!Data) {
        // Get all data from DB
        const dataList = await  fetch('http://18.216.223.81:3000/getDatasList/' + affEmail + '/' + date);
        if (dataList.status !== 200) {
            Swal.fire('Something went wrong on server side');
        }
        const Data = await dataList.json();
        loadData(date, Data);
    } else {
        loadData(date, Data);
    }
    
    function loadData(chosenDate, Data) {
        // Dates parameters
        let date = 0;
        let dateDifference = 1;
        if (chosenDate && chosenDate !== 'now') {
            const datesArr = chosenDate.split('-');
            date = chosenDate;
            dateDifference = Math.round( (new Date(datesArr[1]) - new Date(datesArr[0])) / 86400000 );
        } else {
            date = 'now';
        }

        let merchantsNameList = Data.merchantsName,
        invoicesList  = Data.invoices;

        // Creat array with all info about merchant
        let = merchantInfoList = [];
        merchantsNameList.forEach( (name) => {
            let obj = { merchant: name};
            obj.invoices = [];
            obj.turnover = 0;
            invoicesList.forEach( (invoice) => {
                if (invoice.merchant === name) {
                    obj.invoices.push(invoice);

                if (invoice.currency === 'EUR') {
                    obj.turnover += invoice.amount.amount_received;
                } else {
                    obj.turnover += invoice.amount.amount_received / coefEURtoUSD;
                }
                }
            });
            obj.transactions =  obj.invoices.length;
            obj.ransactionsPerDay = Math.ceil( obj.transactions / dateDifference )
            if (obj.transactions !== 0) {
                obj.avgRransaction = Math.round( obj.turnover / obj.transactions );
            } else {
                obj.avgRransaction = 0;
            }
            merchantInfoList.push(obj);
        });

        // Creat menu of merchants on the top of page
        const merchantInfoLoad = (obj) => {
            const container = document.querySelector('.merchContainer');
            const span = document.createElement("span");
            const p = document.createElement("p");
            const hr = document.createElement("hr");

            span.innerHTML = obj.merchant;
            p.innerHTML = `
                Turnover: <span class="amountTurnover number">€ ${formatStr(obj.turnover)}</span>
            `;
            
            container.appendChild(hr);
            container.appendChild(span);
            container.appendChild(p);
            container.appendChild(hr);
        }

        // Turnover report
        const turnoverReport = (obj) => {
            const affiliateNameReport = document.querySelector('.affiliateNameReport');
            const amountTurnoverR = document.querySelector('.amountTurnoverR');
            const amountTransactions = document.querySelector('.amountTransactions');
            const TransactionsPerDay = document.querySelector('.TransactionsPerDay');
            const amountAvgTransaction = document.querySelector('.amountAvgTransaction');

            affiliateNameReport.innerHTML = obj.merchant;
            amountTurnoverR.innerHTML = '€ ' + formatStr(obj.turnover);
            amountTransactions.innerHTML = obj.transactions;
            TransactionsPerDay.innerHTML = obj.ransactionsPerDay;
            amountAvgTransaction.innerHTML = obj.avgRransaction;


            if (chosenDate && chosenDate !== 'now') {
                const secondTitle = document.querySelector('.chartTitle');
                const datesArr = chosenDate.split('-');
                const correctDate = [];
                datesArr.forEach( (d) => {
                    let dt = new Date(d);
                    correctDate.push(dt.getDate() +'/' +(dt.getMonth() + 1) + '/' + dt.getFullYear());
                });
                
                secondTitle.innerHTML = 'Report from ' + correctDate[0] + ' to ' + correctDate[1];
            }
            chart(obj);
        }

        // Switch Buttons Turnover report
        const affiliateNameLeftBtn = document.querySelector('.affiliateNameLeftBtn');
        const affiliateNameRightBtn = document.querySelector('.affiliateNameRightBtn');
        let index = 0;

        affiliateNameLeftBtn.addEventListener('click', () => {
            const i = merchantInfoList.length;
            if (index) {
                index -= 1;
                turnoverReport(merchantInfoList[index]);
            } else {
                index = i - 1;
                turnoverReport(merchantInfoList[i-1]);
            }
        });

        affiliateNameRightBtn.addEventListener('click', () => {
            const i = merchantInfoList.length;
            if (index === (i - 1) ) {
                index = 0;
                turnoverReport(merchantInfoList[0]);
            } else {
                index += 1;
                turnoverReport(merchantInfoList[index]);  
            }
        });

        // Chart 
        const chart = (obj) => {
            document.getElementById('affiliateReportChart').innerHTML = '';
            let datesArr = [];
            let amountsArr = [];
            let sortedObj = obj.invoices.sort((a, b) => new Date(a.dates.received_date) - new Date(b.dates.received_date));

            sortedObj.forEach( (invoice) => {
                let d = new Date(invoice.dates.received_date);
                let correctDate = d.getDate() +'/' +(d.getMonth() + 1) + '/' + d.getFullYear();
                if (datesArr.includes(correctDate)) {
                    if (invoice.currency === 'EUR') {
                        amountsArr[amountsArr.length-1] += invoice.amount.amount_received;
                    } else {
                        amountsArr[amountsArr.length-1] += Math.round(invoice.amount.amount_received / coefEURtoUSD);
                    }
                } else {
                    datesArr.push(correctDate);
                    if (invoice.currency === 'EUR') {
                        amountsArr.push(invoice.amount.amount_received);
                    } else {
                        amountsArr.push(Math.round(invoice.amount.amount_received / coefEURtoUSD));
                    }
                }
            });

            const ctx = document.getElementById('affiliateReportChart').getContext('2d');
            const data = {
                labels: datesArr,
                datasets: [
                    {
                    label: "Total turnover:",
                    data: amountsArr,
                        lineTension: 0.5,
                        borderColor: 'rgb(78, 185, 235)',
                        backgroundColor: 'rgba(191, 237, 255, 0.2)',
                        pointBorderColor: 'rgb(78, 185, 235)',
                        pointRadius: 3,
                        pointHoverRadius: 10,
                        pointHitRadius: 30,
                        pointBorderWidth: 2,
                        pointStyle: 'rectRounded'
                        }
                    ]
            };   
            const options = {
                legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 80,
                    fontColor: 'black'
                }
                }
            };
            const myLineChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
            });
        }

        // All Turnover Chart
        const turnOverChartBtn = document.querySelector('.turnOverChartBtn');
        turnOverChartBtn.addEventListener('click', () => {
            document.getElementById('affiliateReportChart').innerHTML = '';
            let datesArr = [];
            let amountsArr = [];

            merchantInfoList.forEach( (merch) => {
                merch.invoices.forEach( (invoice) => {
                    let d = new Date(invoice.dates.received_date);
                    let correctDate = d.getDate() +'/' +(d.getMonth() + 1) + '/' + d.getFullYear();
                    if (datesArr.includes(correctDate)) {
                        if (invoice.currency === 'EUR') {
                            amountsArr[amountsArr.length-1] += invoice.amount.amount_received;
                        } else {
                            amountsArr[amountsArr.length-1] += Math.round(invoice.amount.amount_received / coefEURtoUSD);
                        }
                    } else {
                        datesArr.push(correctDate);
                        if (invoice.currency === 'EUR') {
                            amountsArr.push(invoice.amount.amount_received);
                        } else {
                            amountsArr.push(Math.round(invoice.amount.amount_received / coefEURtoUSD));
                        }
                    }
                });
            });

            const ctx = document.getElementById('affiliateReportChart').getContext('2d');
            const data = {
                labels: datesArr,
                datasets: [
                    {
                    label: "Total turnover:",
                    data: amountsArr,
                        lineTension: 0.5,
                        borderColor: 'rgb(78, 185, 235)',
                        backgroundColor: 'rgba(191, 237, 255, 0.2)',
                        pointBorderColor: 'rgb(78, 185, 235)',
                        pointRadius: 3,
                        pointHoverRadius: 10,
                        pointHitRadius: 30,
                        pointBorderWidth: 2,
                        pointStyle: 'rectRounded'
                        }
                    ]
            };   
            const options = {
                legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 80,
                    fontColor: 'black'
                }
                }
            };
            const myLineChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
            });
        });

        // Fill hiden table
        const loadTable = (merchantInfoList) => {
            const tableList = document.querySelector('#table-list');
            tableList.innerHTML = '';
            let totalSumUSD = 0;
            let totalSumEUR = 0;

            merchantInfoList.forEach( (merch) => {
            
                merch.invoices.forEach( (invoice) => {
                    let tr = document.createElement("tr");
                    tr.innerHTML =  `
                        <td class="column1">${invoice.merchant}</td> 
                        <td class="column2">${invoice.dates.received_date}</td> 
                        <td class="column3">${invoice.amount.amount_received}</td>
                        <td class="column4">${invoice.currency}</td> 
                    `;   
                    tableList.appendChild(tr);

                    if (invoice.currency === 'EUR') {
                        totalSumEUR += invoice.amount.amount_received;
                    } else {
                        totalSumUSD += invoice.amount.amount_received;
                    }
                });
            });

            const totalSumRow = document.querySelector('.totalSum');
            if (totalSumRow) {
                tableList.removeChild(totalSumRow);
            }
            let totalTr = document.createElement("tr");
            totalTr.className = 'totalSum';
            totalTr.innerHTML =  `
                <td class="column1">Total amount</td> 
                <td class="column2">${totalSumUSD} USD</td> 
                <td class="column3">${totalSumEUR} EUR</td>
            `;
            tableList.appendChild(totalTr);
        };

        // Render page
        document.querySelector('.merchContainer').innerHTML = '';
        merchantInfoList.forEach ( merchantInfo => merchantInfoLoad(merchantInfo) );
        turnoverReport(merchantInfoList[0]);
        loadTable(merchantInfoList);
    }
}


// Load page when chosen period
document.querySelector('#inputPeriod').addEventListener('focusout', async (event) => {
    let date = event.target.value;

    if ( !date.includes('-')) {
        date = 'now';
    }

    const currentAffName = document.querySelector('.selectMenu');

    if (currentAffName && currentAffName.value !== 'Select Affiliate') {
        const affNameList = await  fetch('http://18.216.223.81:3000/getAffNameList');
        if (affNameList.status !== 200) {
            Swal.fire('Something went wrong on server side');
        }
        const affList = await affNameList.json();

        // Get all data from DB
        let currentAffEmail = '';
        affList.forEach( (item) => {
            if (item.fullname === currentAffName.value)
            currentAffEmail = item.email;
        });
        const dataList = await  fetch('http://18.216.223.81:3000/getDatasList/' + currentAffEmail + '/' + date);
        if (dataList.status !== 200) {
            Swal.fire('Something went wrong on server side');
        }
        const Data = await dataList.json();
        loadPage(date, Data);
    } else {
        loadPage(date);
    }
});

// Correct amount function
function formatStr(num) {
    let str = num + '';
    str = str.replace(/(\.(.*))/g, '');
    var arr = str.split('');
    var str_temp = '';
    if (str.length > 3) {
        for (var i = arr.length - 1, j = 1; i >= 0; i--, j++) {
            str_temp = arr[i] + str_temp;
            if (j % 3 == 0) {
                str_temp = ' ' + str_temp;
            }
        }
        return str_temp;
    } else {
        return str;
    }
}

// Exel table download function
saveXls = () => { 
    const tbl = document.getElementById('table-affiliate');
    const wb = XLSX.utils.table_to_book(tbl, {
        sheet: "Affiliate report table",
        display: true
    });
    const wbout = XLSX.write(wb, {bookType: "xlsx", bookSST: true, type: "binary"});
    function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    };

    const affName = document.querySelector('.userName').textContent;
    const date = new Date();
    const dateNow = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    const currentAffName = document.querySelector('.selectMenu');
    if (currentAffName) {
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}),
     `AffiliateReport-${currentAffName.value}-${dateNow}.xlsx`);
    } else {
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}),
        `AffiliateReport-${affName}-${dateNow}.xlsx`);
    }
    
    
}
