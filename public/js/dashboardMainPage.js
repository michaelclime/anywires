let allInvoicesList = [];
const periodTitle = document.querySelector('.periodTitle'),
    period =  document.querySelector('.period'),
    today =  document.querySelector('.today'),
    week =  document.querySelector('.week'),
    month = document.querySelector('.month'),
    allTime =  document.querySelector('.allTime');

const merchantName = document.querySelector('.merchantName'),
      merchant1 =  document.querySelector('.merchant1'),
      merchant2 =  document.querySelector('.merchant2'),
      merchant1Name = merchant1.textContent,
      merchant2Name =  merchant2.textContent;

const receivedUSD = document.querySelector('.receivedUSD'),
      receivedEUR = document.querySelector('.receivedEUR'),
      approvedUSD = document.querySelector('.approvedUSD'),
      approvedEUR = document.querySelector('.approvedEUR'),
      settledUSD = document.querySelector('.settledUSD'),
      settledEUR = document.querySelector('.settledEUR'),
      sentUSD = document.querySelector('.sentUSD'),
      sentEUR = document.querySelector('.sentEUR');

const  transactionsNumber = document.querySelector('.transactionsNumber'),
       transPerDayNum = document.querySelector('.transactionsPerDayNumber'),
       avgTransactionUSD = document.querySelector('.avgTransactionUSD'),
       avgTransactionEUR = document.querySelector('.avgTransactionEUR'),
       awWalletValue = document.querySelector('awWalletValue'),
       persWalletValue = document.querySelector('persWalletValue');

// Merchant select

merchantName.onmouseenter = function() {
    if (merchant1Name) {
        document.querySelector('.merchantSelec').style.display = 'flex';
    }
    
};

document.querySelector('.merchantSelec').onmouseenter = function() {
    document.querySelector('.merchantSelec').style.display = 'flex';
};

document.querySelector('.merchantSelec').onmouseleave = function() {
    document.querySelector('.merchantSelec').style.display = 'none';
};

merchantName.onmouseleave = function() {
    document.querySelector('.merchantSelec').style.display = 'none';
};

merchant1.onclick = function() {
    merchantName.innerHTML = `${merchant1Name}<i class="fas fa-sort-down"></i>`;

    let currentPeriod = document.querySelector('.periodTitle').textContent;
    
    switch (currentPeriod) {
        case 'Today':
            todayAmount();
          break;
        case 'Week':
            weekAmount();
          break;
        case 'Month':
            monthAmount();
          break;
        case 'All Time':
            allTimeAmount();
        break;
      }
};

merchant2.onclick = function() {
    merchantName.innerHTML = `${merchant2Name}<i class="fas fa-sort-down"></i>`;

    let currentPeriod = document.querySelector('.periodTitle').textContent;
    
    switch (currentPeriod) {
        case 'Today':
            todayAmount();
          break;
        case 'Week':
            weekAmount();
          break;
        case 'Month':
            monthAmount();
          break;
        case 'All Time':
            allTimeAmount();
        break;
      }
};

// Period select

periodTitle.onmouseenter = function() {
    document.querySelector('.period').style.display = 'flex';
};

period.onmouseenter = function() {
    document.querySelector('.period').style.display = 'flex';
};

period.onmouseleave = function() {
    document.querySelector('.period').style.display = 'none';
};

periodTitle.onmouseleave = function() {
    document.querySelector('.period').style.display = 'none';
};

// TODAY amount process

const todayAmount = () => {
let sentAmountEuro = 0,
    sentAmountDollar = 0,
    receivedAmountEuro = 0,
    receivedAmountDollar = 0,
    approvedAmountEuro = 0,
    approvedAmountDollar = 0,
    settledAmountEuro = 0;
    settledAmountDollar = 0,
    transactionsUSD = 0,
    transactionsEUR = 0,
    receivedInvCount = 0;

    periodTitle.innerHTML = `Today<i class="fas fa-sort-down"></i>`;

    if (merchantName.textContent == 'Select period') {

        let fetchPromise  = fetch('http://localhost:3000/getInvListToday');
        //let fetchPromise  = fetch('http://18.216.223.81:3000/getInvListToday');
        fetchPromise.then(response => {
            return response.json();
        }).then(invoices => {
            invoices.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent,
                    receivedAmountEuro += +i.amount.amount_received,
                    approvedAmountEuro += +i.amount.amount_approved,
                    settledAmountEuro += 0;
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent,
                        receivedAmountDollar += +i.amount.amount_received,
                        approvedAmountDollar += +i.amount.amount_approved,
                        settledAmountDollar += 0;
                    }
                }
            });
            sentUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(sentAmountDollar))}`;
            sentEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(sentAmountEuro))}`;
            receivedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(receivedAmountDollar))}`;
            receivedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(receivedAmountEuro))}`;
            approvedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(approvedAmountDollar))}`;
            approvedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(approvedAmountEuro))}`;
            settledUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(settledAmountDollar))}`; 
            settledEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(settledAmountEuro))}`;
            
            if (!transactionsUSD) transactionsUSD += 1;
            if (!transactionsEUR) transactionsUSD += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = receivedInvCount;
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        });
     } else if (!merchant1.textContent) { 
        let newFetchPromise  = fetch(`http://localhost:3000/getInvListToday/${merchantName.textContent}`);
        //let newFetchPromise  = fetch(`http://18.216.223.81:3000/getInvListToday/${merchantName.textContent}`);
        newFetchPromise.then(response => {
            return response.json();
        }).then(inv => {   
            inv.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent,
                    receivedAmountEuro += +i.amount.amount_received,
                    approvedAmountEuro += +i.amount.amount_approved,
                    settledAmountEuro += 0;
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent,
                        receivedAmountDollar += +i.amount.amount_received,
                        approvedAmountDollar += +i.amount.amount_approved,
                        settledAmountDollar += 0;
                    }
                }
            });
            sentUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(sentAmountDollar))}`;
            sentEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(sentAmountEuro))}`;
            receivedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(receivedAmountDollar))}`;
            receivedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(receivedAmountEuro))}`;
            approvedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(approvedAmountDollar))}`;
            approvedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(approvedAmountEuro))}`;
            settledUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(settledAmountDollar))}`; 
            settledEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(settledAmountEuro))}`; 
        
            if (!transactionsUSD) transactionsUSD += 1;
            if (!transactionsEUR) transactionsUSD += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = receivedInvCount;
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        });
    } else {
        let merLink = document.querySelector('.merchantName');
        let newFetchPromise  = fetch(`http://localhost:3000/getInvListToday/${merLink.textContent}`);
        //let newFetchPromise  = fetch(`http://18.216.223.81:3000/getInvListToday/${merLink.textContent}`);
        newFetchPromise.then(response => {
            return response.json();
        }).then(inv => {   
            inv.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent,
                    receivedAmountEuro += +i.amount.amount_received,
                    approvedAmountEuro += +i.amount.amount_approved,
                    settledAmountEuro += 0;
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent,
                        receivedAmountDollar += +i.amount.amount_received,
                        approvedAmountDollar += +i.amount.amount_approved,
                        settledAmountDollar += 0;
                    }
                }
            });
            sentUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(sentAmountDollar))}`;
            sentEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(sentAmountEuro))}`;
            receivedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(receivedAmountDollar))}`;
            receivedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(receivedAmountEuro))}`;
            approvedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(approvedAmountDollar))}`;
            approvedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(approvedAmountEuro))}`;
            settledUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(settledAmountDollar))}`; 
            settledEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(settledAmountEuro))}`; 
        
            if (!transactionsUSD) transactionsUSD += 1;
            if (!transactionsEUR) transactionsUSD += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = receivedInvCount;
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        });
    }
};
todayAmount();
today.onclick = todayAmount;

// WEEK amount process

const weekAmount = () => {
    let sentAmountEuro = 0,
        sentAmountDollar = 0,
        receivedAmountEuro = 0,
        receivedAmountDollar = 0,
        approvedAmountEuro = 0,
        approvedAmountDollar = 0,
        settledAmountEuro = 0;
        settledAmountDollar = 0,
        transactionsUSD = 0,
        transactionsEUR = 0,
        receivedInvCount = 0;

    periodTitle.innerHTML = `Week<i class="fas fa-sort-down"></i>`;

    if (merchantName.textContent == 'Select period') {
        //let fetchPromise  = fetch('http://18.216.223.81:3000/getInvListWeek');
        let fetchPromise  = fetch('http://localhost:3000/getInvListWeek');
        fetchPromise.then(response => {
            return response.json();
        }).then(invoices => {
            invoices.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent,
                    receivedAmountEuro += +i.amount.amount_received,
                    approvedAmountEuro += +i.amount.amount_approved,
                    settledAmountEuro += 0;
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent,
                        receivedAmountDollar += +i.amount.amount_received,
                        approvedAmountDollar += +i.amount.amount_approved,
                        settledAmountDollar += 0;
                    }
                }
            });
            sentUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(sentAmountDollar))}`;
            sentEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(sentAmountEuro))}`;
            receivedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(receivedAmountDollar))}`;
            receivedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(receivedAmountEuro))}`;
            approvedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(approvedAmountDollar))}`;
            approvedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(approvedAmountEuro))}`;
            settledUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(settledAmountDollar))}`; 
            settledEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(settledAmountEuro))}`;
        
            if (!transactionsUSD) transactionsUSD += 1;
            if (!transactionsEUR) transactionsUSD += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / 7);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        });
        } else if (!merchant1.textContent) {
         //   let newFetchPromise  = fetch(`http://18.216.223.81:3000/getInvListWeek/${merchantName.textContent}`);
        let newFetchPromise  = fetch(`http://localhost:3000/getInvListWeek/${merchantName.textContent}`);
        newFetchPromise.then(response => {
            return response.json();
        }).then(inv => {   
            inv.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent,
                    receivedAmountEuro += +i.amount.amount_received,
                    approvedAmountEuro += +i.amount.amount_approved,
                    settledAmountEuro += 0;
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent,
                        receivedAmountDollar += +i.amount.amount_received,
                        approvedAmountDollar += +i.amount.amount_approved,
                        settledAmountDollar += 0;
                    }
                }
            });
            sentUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(sentAmountDollar))}`;
            sentEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(sentAmountEuro))}`;
            receivedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(receivedAmountDollar))}`;
            receivedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(receivedAmountEuro))}`;
            approvedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(approvedAmountDollar))}`;
            approvedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(approvedAmountEuro))}`;
            settledUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(settledAmountDollar))}`; 
            settledEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(settledAmountEuro))}`; 
        
            if (!transactionsUSD) transactionsUSD += 1;
            if (!transactionsEUR) transactionsUSD += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / 7);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        });
    } else {
        let merLink = document.querySelector('.merchantName');
        //let newFetchPromise  = fetch(`http://18.216.223.81:3000/getInvListWeek/${merLink.textContent}`);
        let newFetchPromise  = fetch(`http://localhost:3000/getInvListWeek/${merLink.textContent}`);
        newFetchPromise.then(response => {
            return response.json();
        }).then(inv => {   
            inv.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent,
                    receivedAmountEuro += +i.amount.amount_received,
                    approvedAmountEuro += +i.amount.amount_approved,
                    settledAmountEuro += 0;
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent,
                        receivedAmountDollar += +i.amount.amount_received,
                        approvedAmountDollar += +i.amount.amount_approved,
                        settledAmountDollar += 0;
                    }
                }
            });
            sentUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(sentAmountDollar))}`;
            sentEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(sentAmountEuro))}`;
            receivedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(receivedAmountDollar))}`;
            receivedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(receivedAmountEuro))}`;
            approvedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(approvedAmountDollar))}`;
            approvedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(approvedAmountEuro))}`;
            settledUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(settledAmountDollar))}`; 
            settledEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(settledAmountEuro))}`; 

            if (!transactionsUSD) transactionsUSD += 1;
            if (!transactionsEUR) transactionsUSD += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / 7);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        });
    }
};
week.onclick = weekAmount;

// MONTH amount process


const monthAmount = () => {
    let sentAmountEuro = 0,
        sentAmountDollar = 0,
        receivedAmountEuro = 0,
        receivedAmountDollar = 0,
        approvedAmountEuro = 0,
        approvedAmountDollar = 0,
        settledAmountEuro = 0;
        settledAmountDollar = 0,
        transactionsUSD = 0,
        transactionsEUR = 0,
        receivedInvCount = 0;

    periodTitle.innerHTML = `Month<i class="fas fa-sort-down"></i>`;

    if (merchantName.textContent == 'Select period') {
        //let fetchPromise  = fetch('http://18.216.223.81:3000/getInvListMonth');
        let fetchPromise  = fetch('http://localhost:3000/getInvListMonth');
        fetchPromise.then(response => {
            return response.json();
        }).then(invoices => {
            invoices.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent,
                    receivedAmountEuro += +i.amount.amount_received,
                    approvedAmountEuro += +i.amount.amount_approved,
                    settledAmountEuro += 0;
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent,
                        receivedAmountDollar += +i.amount.amount_received,
                        approvedAmountDollar += +i.amount.amount_approved,
                        settledAmountDollar += 0;
                    }
                }
            });
            sentUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(sentAmountDollar))}`;
            sentEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(sentAmountEuro))}`;
            receivedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(receivedAmountDollar))}`;
            receivedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(receivedAmountEuro))}`;
            approvedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(approvedAmountDollar))}`;
            approvedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(approvedAmountEuro))}`;
            settledUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(settledAmountDollar))}`; 
            settledEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(settledAmountEuro))}`;
        
            if (!transactionsUSD) transactionsUSD += 1;
            if (!transactionsEUR) transactionsUSD += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / 30);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        });
        } else if (!merchant1.textContent) {
        //let newFetchPromise  = fetch(`http://18.216.223.81:3000/getInvListMonth/${merchantName.textContent}`); 
        let newFetchPromise  = fetch(`http://localhost:3000/getInvListMonth/${merchantName.textContent}`);
        newFetchPromise.then(response => {
            return response.json();
        }).then(inv => {   
            inv.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent,
                    receivedAmountEuro += +i.amount.amount_received,
                    approvedAmountEuro += +i.amount.amount_approved,
                    settledAmountEuro += 0;
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent,
                        receivedAmountDollar += +i.amount.amount_received,
                        approvedAmountDollar += +i.amount.amount_approved,
                        settledAmountDollar += 0;
                    }
                }
            });
            sentUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(sentAmountDollar))}`;
            sentEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(sentAmountEuro))}`;
            receivedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(receivedAmountDollar))}`;
            receivedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(receivedAmountEuro))}`;
            approvedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(approvedAmountDollar))}`;
            approvedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(approvedAmountEuro))}`;
            settledUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(settledAmountDollar))}`; 
            settledEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(settledAmountEuro))}`; 
        
            if (!transactionsUSD) transactionsUSD += 1;
            if (!transactionsEUR) transactionsUSD += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / 30);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        });
    } else {
        let merLink = document.querySelector('.merchantName');
        //let newFetchPromise  = fetch(`http://18.216.223.81:3000/getInvListMonth/${merLink.textContent}`);
        let newFetchPromise  = fetch(`http://localhost:3000/getInvListMonth/${merLink.textContent}`);
        newFetchPromise.then(response => {
            return response.json();
        }).then(inv => {   
            inv.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent,
                    receivedAmountEuro += +i.amount.amount_received,
                    approvedAmountEuro += +i.amount.amount_approved,
                    settledAmountEuro += 0;
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent,
                        receivedAmountDollar += +i.amount.amount_received,
                        approvedAmountDollar += +i.amount.amount_approved,
                        settledAmountDollar += 0;
                    }
                }
            });
            sentUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(sentAmountDollar))}`;
            sentEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(sentAmountEuro))}`;
            receivedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(receivedAmountDollar))}`;
            receivedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(receivedAmountEuro))}`;
            approvedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(approvedAmountDollar))}`;
            approvedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(approvedAmountEuro))}`;
            settledUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(settledAmountDollar))}`; 
            settledEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(settledAmountEuro))}`; 
        
            if (!transactionsUSD) transactionsUSD += 1;
            if (!transactionsEUR) transactionsUSD += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / 30);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        });
    }
};
month.onclick = monthAmount;

// All time amount process

const allTimeAmount = () => {
    let sentAmountEuro = 0,
        sentAmountDollar = 0,
        receivedAmountEuro = 0,
        receivedAmountDollar = 0,
        approvedAmountEuro = 0,
        approvedAmountDollar = 0,
        settledAmountEuro = 0;
        settledAmountDollar = 0,
        transactionsUSD = 0,
        transactionsEUR = 0,
        receivedInvCount = 0;

    periodTitle.innerHTML = `All Time<i class="fas fa-sort-down"></i>`;

    if (merchantName.textContent == 'Select period') {

        let fetchPromise  = fetch('http://localhost:3000/getInvListAll');
        //let fetchPromise  = fetch('http://18.216.223.81:3000/getInvListAll');
        fetchPromise.then(response => {
            return response.json();
        }).then(invoices => {
            invoices.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent,
                    receivedAmountEuro += +i.amount.amount_received,
                    approvedAmountEuro += +i.amount.amount_approved,
                    settledAmountEuro += 0;
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent,
                        receivedAmountDollar += +i.amount.amount_received,
                        approvedAmountDollar += +i.amount.amount_approved,
                        settledAmountDollar += 0;
                    }
                }
            });
            sentUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(sentAmountDollar))}`;
            sentEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(sentAmountEuro))}`;
            receivedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(receivedAmountDollar))}`;
            receivedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(receivedAmountEuro))}`;
            approvedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(approvedAmountDollar))}`;
            approvedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(approvedAmountEuro))}`;
            settledUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(settledAmountDollar))}`; 
            settledEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(settledAmountEuro))}`;
            
            let bigDate = Math.round( (new Date() - new Date("2019-04-09")) / 86400000);
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / bigDate);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        });
     } else if (!merchant1.textContent) { 
        let newFetchPromise  = fetch(`http://localhost:3000/getInvListAll/${merchantName.textContent}`);
        //let newFetchPromise  = fetch(`http://18.216.223.81:3000/getInvListAll/${merchantName.textContent}`);
        newFetchPromise.then(response => {
            return response.json();
        }).then(inv => {   
            inv.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent,
                    receivedAmountEuro += +i.amount.amount_received,
                    approvedAmountEuro += +i.amount.amount_approved,
                    settledAmountEuro += 0;
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent,
                        receivedAmountDollar += +i.amount.amount_received,
                        approvedAmountDollar += +i.amount.amount_approved,
                        settledAmountDollar += 0;
                    }
                }
            });
            sentUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(sentAmountDollar))}`;
            sentEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(sentAmountEuro))}`;
            receivedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(receivedAmountDollar))}`;
            receivedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(receivedAmountEuro))}`;
            approvedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(approvedAmountDollar))}`;
            approvedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(approvedAmountEuro))}`;
            settledUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(settledAmountDollar))}`; 
            settledEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(settledAmountEuro))}`; 
        
            if (!transactionsUSD) transactionsUSD += 1;
            if (!transactionsEUR) transactionsUSD += 1;
            let bigDate = Math.round( (new Date() - new Date("2019-04-09")) / 86400000);
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / bigDate);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        });
    } else {
        let merLink = document.querySelector('.merchantName');
        let newFetchPromiseA  = fetch(`http://localhost:3000/getInvListAll/${merLink.textContent}`);
        //let newFetchPromiseA  = fetch(`http://18.216.223.81:3000/getInvListAll/${merLink.textContent}`);
        newFetchPromiseA.then(response => {
            return response.json();
        }).then(inv => {   
            inv.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent,
                    receivedAmountEuro += +i.amount.amount_received,
                    approvedAmountEuro += +i.amount.amount_approved,
                    settledAmountEuro += 0;
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent,
                        receivedAmountDollar += +i.amount.amount_received,
                        approvedAmountDollar += +i.amount.amount_approved,
                        settledAmountDollar += 0;
                    }
                }
            });
            sentUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(sentAmountDollar))}`;
            sentEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(sentAmountEuro))}`;
            receivedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(receivedAmountDollar))}`;
            receivedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(receivedAmountEuro))}`;
            approvedUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(approvedAmountDollar))}`;
            approvedEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(approvedAmountEuro))}`;
            settledUSD.innerHTML = `<i class="fas fa-dollar-sign"> ${formatStr(Math.round(settledAmountDollar))}`; 
            settledEUR.innerHTML = `<i class="fas fa-euro-sign"> ${formatStr(Math.round(settledAmountEuro))}`; 
        
            if (!transactionsUSD) transactionsUSD += 1;
            if (!transactionsEUR) transactionsUSD += 1;
            let bigDate = Math.round( (new Date() - new Date("2019-04-09")) / 86400000);
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / bigDate);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        });
    }
};
allTime.onclick = allTimeAmount;

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
