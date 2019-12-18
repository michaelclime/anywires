
let allInvoicesList = [];
const periodTitle = document.querySelector('.periodTitle'),
    period =  document.querySelector('.period'),
    today =  document.querySelector('.today'),
    week =  document.querySelector('.week'),
    month = document.querySelector('.month'),
    allTime =  document.querySelector('.allTime');

const merchantName = document.querySelector('.merchantName');
      merchant =  document.querySelector('.curentUserMerch').textContent.split(',');

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
const curentUserRole = document.querySelector('.curentUserRole').textContent;
const curentUserId = document.querySelector('.curentUserId').textContent;

 ( async () => {
    if (merchantName.textContent !== 'Select period') {
        let fetchPromise  = await fetch('http://18.216.223.81:3000/getMerchListNames/' + curentUserId);
        let merchList = await fetchPromise.json();

       if (merchant.length > 1) {
        merchantName.innerHTML = `${merchList[0]}<i class="fas fa-sort-down"></i>`;
       } else {
        merchantName.innerHTML = `${merchList[0]}`;
       }
        let container = document.querySelector('.merchantSelec');
        if (merchList.length > 1) {
            merchList.forEach( (merchant) => {
                let li = document.createElement('li');
                li.className = 'merchant';
                li.innerHTML = merchant;

                li.addEventListener('click', () => {
                    merchantName.innerHTML = `${merchant}<i class="fas fa-sort-down"></i>`;
                        document.querySelector('.walletInfo').innerHTML = '';
                        walletBalance();
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
                });

                container.append(li);
            });
        }

        // Wallets Balance

        const walletBalance = () => {
            let merchLink = document.querySelector('.merchantName'),
                 walletInfo = document.querySelector('.walletInfo');
          
            let walletPromise = fetch(`http://18.216.223.81:3000/getWallet/${merchLink.textContent}`);
            walletPromise.then(response => {
                return response.json();
            }).then( (wallets) => {
                if (wallets.length) {
                    wallets.forEach((i) => {
                        let node = document.createElement("span");
                        node.className = 'awWallet';
                        let textNode =  document.createTextNode(`${i.name}: ${formatStr(i.balance)} ${i.currency}`);
                        node.append(textNode);
                        walletInfo.append(node);
                    });
                } else {
                    let node = document.createElement("span");
                        node.className = 'awWallet';
                        let textNode =  document.createTextNode(`Wallet hasn'\t been created yet.`);
                        node.append(textNode);
                        walletInfo.append(node);
                }
            });
        }
        
        if (document.querySelector('.walletInfo')) {
            walletBalance();
        }
    }
})();



merchantName.onmouseenter = function() {
    document.querySelector('.merchantSelec').style.display = 'flex';  
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
    document.querySelector(".receivedUSD").innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.receivedUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.receivedEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.approvedUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.approvedEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.settledUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.settledEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.sentUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.sentEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;

let sentAmountEuro = 0,
    sentAmountDollar = 0,
    receivedAmountEuro = 0,
    receivedAmountDollar = 0,
    approvedAmountEuro = 0,
    approvedAmountDollar = 0,
    settledAmountEuro = 0,
    settledAmountDollar = 0,
    transactionsUSD = 0,
    transactionsEUR = 0,
    receivedInvCount = 0,
    dateListSentUSD = [],
    dateListSentEUR = [],
    amountListSentUSD = [],
    amountListSentEUR = [],
    dateListReceivedUSD = [],
    dateListReceivedEUR = [],
    amountListReceivedUSD = [],
    amountListReceivedEUR = [],
    dateListApprovedUSD = [],
    dateListApprovedEUR = [],
    amountListApprovedUSD = [],
    amountListApprovedEUR = [],
    dateListSettledUSD = [],
    dateListSettledEUR = [],
    amountListSettledUSD = [],
    amountListSettledEUR = [],
    datesChart = [],
    amountsChart = [];

    periodTitle.innerHTML = `Today<i class="fas fa-sort-down"></i>`;

    if (merchantName.textContent == 'Select period') {
        let fetchPromise  = fetch('http://18.216.223.81:3000/getInvListToday');
        fetchPromise.then(response => {
            return response.json();
        }).then(invoices => {
            invoices.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent;
                    receivedAmountEuro += +i.amount.amount_received;
                    approvedAmountEuro += +i.amount.amount_approved;
                    if (i.amount.amount_settled) {
                        settledAmountEuro += +i.amount.amount_settled;
                    }

                    let dSU = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                    if (dateListSentEUR.includes(dSU)) {
                        amountListSentEUR[amountListSentEUR.length-1] += +i.amount.amount_sent;
                    } else {
                        if (dSU !== "NaN/NaN/NaN" && dSU !== "1/1/1970") {
                            amountListSentEUR.push(+i.amount.amount_sent);
                            dateListSentEUR.push(dSU);
                        } 
                    }
                    let dRU = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                    if (dateListReceivedEUR.includes(dRU)) {
                        amountListReceivedEUR[amountListReceivedEUR.length-1] += i.amount.amount_received;
                    } else {
                        if (dRU !== "NaN/NaN/NaN" && dRU !== "1/1/1970") {
                            amountListReceivedEUR.push(i.amount.amount_received);
                            dateListReceivedEUR.push(dRU);
                        }
                    }
                    let dAU = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                    if (dateListApprovedEUR.includes(dAU)) {
                        amountListApprovedEUR[amountListApprovedEUR.length-1] += i.amount.amount_approved;
                    } else {
                        if (dAU !== "NaN/NaN/NaN" && dAU !== "1/1/1970") {
                            amountListApprovedEUR.push(i.amount.amount_approved);
                            dateListApprovedEUR.push(dAU);
                        }
                    }
                    let dSsU = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                    if (dateListSettledEUR.includes(dSsU)) {
                        amountListSettledEUR[amountListSettledEUR.length-1] += i.amount.amount_settled;
                    } else {
                        if (dSsU !== "NaN/NaN/NaN" && dSsU !== "1/1/1970") {
                            amountListSettledEUR.push(i.amount.amount_settled);
                            dateListSettledEUR.push(dSsU);
                        }
                    }

                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent;
                        receivedAmountDollar += +i.amount.amount_received;
                        approvedAmountDollar += +i.amount.amount_approved;
                        if (i.amount.amount_settled) {
                            settledAmountDollar += +i.amount.amount_settled;
                        }

                        let dSE = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                        if (dateListSentUSD.includes(dSE)) {
                            amountListSentUSD[amountListSentUSD.length-1] += +i.amount.amount_sent;
                        } else {
                            if (dSE !== "NaN/NaN/NaN" && dSE !== "1/1/1970") {
                                amountListSentUSD.push(+i.amount.amount_sent);
                                dateListSentUSD.push(dSE);
                            }
                        }
                        let dRE = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                        if (dateListReceivedUSD.includes(dRE)) {
                            amountListReceivedUSD[amountListReceivedUSD.length-1] += i.amount.amount_received;
                        } else {
                            if (dRE !== "NaN/NaN/NaN" && dRE !== "1/1/1970") {
                                amountListReceivedUSD.push(i.amount.amount_received);
                                dateListReceivedUSD.push(dRE);
                            }
                        }
                        let dAE = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                        if (dateListApprovedUSD.includes(dAE)) {
                            amountListApprovedUSD[amountListApprovedUSD.length-1] += i.amount.amount_approved;
                        } else {
                            if (dAE !== "NaN/NaN/NaN" && dAE !== "1/1/1970") {
                                amountListApprovedUSD.push(i.amount.amount_approved);
                                dateListApprovedUSD.push(dAE);
                            }
                        }
                        let dSsE = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                        if (dateListSettledUSD.includes(dSsE)) {
                            amountListSettledUSD[amountListSettledUSD.length-1] += i.amount.amount_settled;
                        } else {
                            if (dSsE !== "NaN/NaN/NaN" && dSsE !== "1/1/1970") {
                                amountListSettledUSD.push(i.amount.amount_settled);
                                dateListSettledUSD.push(dSsE);
                            }
                        }
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
            if (!transactionsEUR) transactionsEUR += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = receivedInvCount;
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        
            datesChart.push(dateListSentUSD, dateListReceivedUSD, dateListApprovedUSD, dateListSettledUSD, dateListSentEUR, dateListReceivedEUR, dateListApprovedEUR, dateListSettledEUR);
            amountsChart.push(amountListSentUSD, amountListReceivedUSD, amountListApprovedUSD, amountListSettledUSD, amountListSentEUR, amountListReceivedEUR, amountListApprovedEUR, amountListSettledEUR);
            chartBox(datesChart, amountsChart);
        });
     } else {
        let merLink = document.querySelector('.merchantName');
        let newFetchPromise  = fetch(`http://18.216.223.81:3000/getInvListToday/${merLink.textContent}`);
        newFetchPromise.then(response => {
            return response.json();
        }).then(inv => {   
            inv.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent;
                    receivedAmountEuro += +i.amount.amount_received;
                    approvedAmountEuro += +i.amount.amount_approved;
                    if (i.amount.amount_settled) {
                        settledAmountEuro += +i.amount.amount_settled;
                    }

                    let dSU = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                    if (dateListSentEUR.includes(dSU)) {
                        amountListSentEUR[amountListSentEUR.length-1] += +i.amount.amount_sent;
                    } else {
                        if (dSU !== "NaN/NaN/NaN" && dSU !== "1/1/1970") {
                            amountListSentEUR.push(+i.amount.amount_sent);
                            dateListSentEUR.push(dSU);
                        } 
                    }
                    let dRU = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                    if (dateListReceivedEUR.includes(dRU)) {
                        amountListReceivedEUR[amountListReceivedEUR.length-1] += i.amount.amount_received;
                    } else {
                        if (dRU !== "NaN/NaN/NaN" && dRU !== "1/1/1970") {
                            amountListReceivedEUR.push(i.amount.amount_received);
                            dateListReceivedEUR.push(dRU);
                        }
                    }
                    let dAU = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                    if (dateListApprovedEUR.includes(dAU)) {
                        amountListApprovedEUR[amountListApprovedEUR.length-1] += i.amount.amount_approved;
                    } else {
                        if (dAU !== "NaN/NaN/NaN" && dAU !== "1/1/1970") {
                            amountListApprovedEUR.push(i.amount.amount_approved);
                            dateListApprovedEUR.push(dAU);
                        }
                    }
                    let dSsU = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                    if (dateListSettledEUR.includes(dSsU)) {
                        amountListSettledEUR[amountListSettledEUR.length-1] += i.amount.amount_settled;
                    } else {
                        if (dSsU !== "NaN/NaN/NaN" && dSsU !== "1/1/1970") {
                            amountListSettledEUR.push(i.amount.amount_settled);
                            dateListSettledEUR.push(dSsU);
                        }
                    }

                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent;
                        receivedAmountDollar += +i.amount.amount_received;
                        approvedAmountDollar += +i.amount.amount_approved;
                        if (i.amount.amount_settled) {
                            settledAmountDollar += +i.amount.amount_settled;
                        }

                        let dSE = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                        if (dateListSentUSD.includes(dSE)) {
                            amountListSentUSD[amountListSentUSD.length-1] += +i.amount.amount_sent;
                        } else {
                            if (dSE !== "NaN/NaN/NaN" && dSE !== "1/1/1970") {
                                amountListSentUSD.push(+i.amount.amount_sent);
                                dateListSentUSD.push(dSE);
                            }
                        }
                        let dRE = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                        if (dateListReceivedUSD.includes(dRE)) {
                            amountListReceivedUSD[amountListReceivedUSD.length-1] += i.amount.amount_received;
                        } else {
                            if (dRE !== "NaN/NaN/NaN" && dRE !== "1/1/1970") {
                                amountListReceivedUSD.push(i.amount.amount_received);
                                dateListReceivedUSD.push(dRE);
                            }
                        }
                        let dAE = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                        if (dateListApprovedUSD.includes(dAE)) {
                            amountListApprovedUSD[amountListApprovedUSD.length-1] += i.amount.amount_approved;
                        } else {
                            if (dAE !== "NaN/NaN/NaN" && dAE !== "1/1/1970") {
                                amountListApprovedUSD.push(i.amount.amount_approved);
                                dateListApprovedUSD.push(dAE);
                            }
                        }
                        let dSsE = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                        if (dateListSettledUSD.includes(dSsE)) {
                            amountListSettledUSD[amountListSettledUSD.length-1] += i.amount.amount_settled;
                        } else {
                            if (dSsE !== "NaN/NaN/NaN" && dSsE !== "1/1/1970") {
                                amountListSettledUSD.push(i.amount.amount_settled);
                                dateListSettledUSD.push(dSsE);
                            }
                        }
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
            if (!transactionsEUR) transactionsEUR += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = receivedInvCount;
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        
            datesChart.push(dateListSentUSD, dateListReceivedUSD, dateListApprovedUSD, dateListSettledUSD, dateListSentEUR, dateListReceivedEUR, dateListApprovedEUR, dateListSettledEUR);
            amountsChart.push(amountListSentUSD, amountListReceivedUSD, amountListApprovedUSD, amountListSettledUSD, amountListSentEUR, amountListReceivedEUR, amountListApprovedEUR, amountListSettledEUR);
            chartBox(datesChart, amountsChart);
        });
    }
};
todayAmount();
today.onclick = todayAmount;

// WEEK amount process

const weekAmount = () => {
    document.querySelector(".receivedUSD").innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.receivedUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.receivedEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.approvedUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.approvedEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.settledUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.settledEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.sentUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.sentEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;

    let sentAmountEuro = 0,
        sentAmountDollar = 0,
        receivedAmountEuro = 0,
        receivedAmountDollar = 0,
        approvedAmountEuro = 0,
        approvedAmountDollar = 0,
        settledAmountEuro = 0,
        settledAmountDollar = 0,
        transactionsUSD = 0,
        transactionsEUR = 0,
        receivedInvCount = 0,
        dateListSentUSD = [],
        dateListSentEUR = [],
        amountListSentUSD = [],
        amountListSentEUR = [],
        dateListReceivedUSD = [],
        dateListReceivedEUR = [],
        amountListReceivedUSD = [],
        amountListReceivedEUR = [],
        dateListApprovedUSD = [],
        dateListApprovedEUR = [],
        amountListApprovedUSD = [],
        amountListApprovedEUR = [],
        dateListSettledUSD = [],
        dateListSettledEUR = [],
        amountListSettledUSD = [],
        amountListSettledEUR = [],
        datesChart = [],
        amountsChart = [];

    periodTitle.innerHTML = `Week<i class="fas fa-sort-down"></i>`;

    if (merchantName.textContent == 'Select period') {
        let fetchPromise  = fetch('http://18.216.223.81:3000/getInvListWeek');
        fetchPromise.then(response => {
            return response.json();
        }).then(invoices => {
            invoices.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent;
                    receivedAmountEuro += +i.amount.amount_received;
                    approvedAmountEuro += +i.amount.amount_approved;
                    if (i.amount.amount_settled) {
                        settledAmountEuro += +i.amount.amount_settled;
                    }

                    let dSU = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                    if (dateListSentEUR.includes(dSU)) {
                        amountListSentEUR[amountListSentEUR.length-1] += +i.amount.amount_sent;
                    } else {
                        if (dSU !== "NaN/NaN/NaN" && dSU !== "1/1/1970") {
                            amountListSentEUR.push(+i.amount.amount_sent);
                            dateListSentEUR.push(dSU);
                        } 
                    }
                    let dRU = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                    if (dateListReceivedEUR.includes(dRU)) {
                        amountListReceivedEUR[amountListReceivedEUR.length-1] += i.amount.amount_received;
                    } else {
                        if (dRU !== "NaN/NaN/NaN" && dRU !== "1/1/1970") {
                            amountListReceivedEUR.push(i.amount.amount_received);
                            dateListReceivedEUR.push(dRU);
                        }
                    }
                    let dAU = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                    if (dateListApprovedEUR.includes(dAU)) {
                        amountListApprovedEUR[amountListApprovedEUR.length-1] += i.amount.amount_approved;
                    } else {
                        if (dAU !== "NaN/NaN/NaN" && dAU !== "1/1/1970") {
                            amountListApprovedEUR.push(i.amount.amount_approved);
                            dateListApprovedEUR.push(dAU);
                        }
                    }
                    let dSsU = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                    if (dateListSettledEUR.includes(dSsU)) {
                        amountListSettledEUR[amountListSettledEUR.length-1] += i.amount.amount_settled;
                    } else {
                        if (dSsU !== "NaN/NaN/NaN" && dSsU !== "1/1/1970") {
                            amountListSettledEUR.push(i.amount.amount_settled);
                            dateListSettledEUR.push(dSsU);
                        }
                    }

                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent;
                        receivedAmountDollar += +i.amount.amount_received;
                        approvedAmountDollar += +i.amount.amount_approved;
                        if (i.amount.amount_settled) {
                            settledAmountDollar += +i.amount.amount_settled;
                        }

                        let dSE = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                        if (dateListSentUSD.includes(dSE)) {
                            amountListSentUSD[amountListSentUSD.length-1] += +i.amount.amount_sent;
                        } else {
                            if (dSE !== "NaN/NaN/NaN" && dSE !== "1/1/1970") {
                                amountListSentUSD.push(+i.amount.amount_sent);
                                dateListSentUSD.push(dSE);
                            }
                        }
                        let dRE = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                        if (dateListReceivedUSD.includes(dRE)) {
                            amountListReceivedUSD[amountListReceivedUSD.length-1] += i.amount.amount_received;
                        } else {
                            if (dRE !== "NaN/NaN/NaN" && dRE !== "1/1/1970") {
                                amountListReceivedUSD.push(i.amount.amount_received);
                                dateListReceivedUSD.push(dRE);
                            }
                        }
                        let dAE = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                        if (dateListApprovedUSD.includes(dAE)) {
                            amountListApprovedUSD[amountListApprovedUSD.length-1] += i.amount.amount_approved;
                        } else {
                            if (dAE !== "NaN/NaN/NaN" && dAE !== "1/1/1970") {
                                amountListApprovedUSD.push(i.amount.amount_approved);
                                dateListApprovedUSD.push(dAE);
                            }
                        }
                        let dSsE = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                        if (dateListSettledUSD.includes(dSsE)) {
                            amountListSettledUSD[amountListSettledUSD.length-1] += i.amount.amount_settled;
                        } else {
                            if (dSsE !== "NaN/NaN/NaN" && dSsE !== "1/1/1970") {
                                amountListSettledUSD.push(i.amount.amount_settled);
                                dateListSettledUSD.push(dSsE);
                            }
                        }
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
            if (!transactionsEUR) transactionsEUR += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / 7);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        
            datesChart.push(dateListSentUSD, dateListReceivedUSD, dateListApprovedUSD, dateListSettledUSD, dateListSentEUR, dateListReceivedEUR, dateListApprovedEUR, dateListSettledEUR);
            amountsChart.push(amountListSentUSD, amountListReceivedUSD, amountListApprovedUSD, amountListSettledUSD, amountListSentEUR, amountListReceivedEUR, amountListApprovedEUR, amountListSettledEUR);
            chartBox(datesChart, amountsChart);
        });
        } else {
        let merLink = document.querySelector('.merchantName');
        let newFetchPromise  = fetch(`http://18.216.223.81:3000/getInvListWeek/${merLink.textContent}`);
        newFetchPromise.then(response => {
            return response.json();
        }).then(inv => {   
            inv.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent;
                    receivedAmountEuro += +i.amount.amount_received;
                    approvedAmountEuro += +i.amount.amount_approved;
                    if (i.amount.amount_settled) {
                        settledAmountEuro += +i.amount.amount_settled;
                    }

                    let dSU = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                    if (dateListSentEUR.includes(dSU)) {
                        amountListSentEUR[amountListSentEUR.length-1] += +i.amount.amount_sent;
                    } else {
                        if (dSU !== "NaN/NaN/NaN" && dSU !== "1/1/1970") {
                            amountListSentEUR.push(+i.amount.amount_sent);
                            dateListSentEUR.push(dSU);
                        } 
                    }
                    let dRU = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                    if (dateListReceivedEUR.includes(dRU)) {
                        amountListReceivedEUR[amountListReceivedEUR.length-1] += i.amount.amount_received;
                    } else {
                        if (dRU !== "NaN/NaN/NaN" && dRU !== "1/1/1970") {
                            amountListReceivedEUR.push(i.amount.amount_received);
                            dateListReceivedEUR.push(dRU);
                        }
                    }
                    let dAU = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                    if (dateListApprovedEUR.includes(dAU)) {
                        amountListApprovedEUR[amountListApprovedEUR.length-1] += i.amount.amount_approved;
                    } else {
                        if (dAU !== "NaN/NaN/NaN" && dAU !== "1/1/1970") {
                            amountListApprovedEUR.push(i.amount.amount_approved);
                            dateListApprovedEUR.push(dAU);
                        }
                    }
                    let dSsU = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                    if (dateListSettledEUR.includes(dSsU)) {
                        amountListSettledEUR[amountListSettledEUR.length-1] += i.amount.amount_settled;
                    } else {
                        if (dSsU !== "NaN/NaN/NaN" && dSsU !== "1/1/1970") {
                            amountListSettledEUR.push(i.amount.amount_settled);
                            dateListSettledEUR.push(dSsU);
                        }
                    }

                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent;
                        receivedAmountDollar += +i.amount.amount_received;
                        approvedAmountDollar += +i.amount.amount_approved;
                        if (i.amount.amount_settled) {
                            settledAmountDollar += +i.amount.amount_settled;
                        }

                        let dSE = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                        if (dateListSentUSD.includes(dSE)) {
                            amountListSentUSD[amountListSentUSD.length-1] += +i.amount.amount_sent;
                        } else {
                            if (dSE !== "NaN/NaN/NaN" && dSE !== "1/1/1970") {
                                amountListSentUSD.push(+i.amount.amount_sent);
                                dateListSentUSD.push(dSE);
                            }
                        }
                        let dRE = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                        if (dateListReceivedUSD.includes(dRE)) {
                            amountListReceivedUSD[amountListReceivedUSD.length-1] += i.amount.amount_received;
                        } else {
                            if (dRE !== "NaN/NaN/NaN" && dRE !== "1/1/1970") {
                                amountListReceivedUSD.push(i.amount.amount_received);
                                dateListReceivedUSD.push(dRE);
                            }
                        }
                        let dAE = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                        if (dateListApprovedUSD.includes(dAE)) {
                            amountListApprovedUSD[amountListApprovedUSD.length-1] += i.amount.amount_approved;
                        } else {
                            if (dAE !== "NaN/NaN/NaN" && dAE !== "1/1/1970") {
                                amountListApprovedUSD.push(i.amount.amount_approved);
                                dateListApprovedUSD.push(dAE);
                            }
                        }
                        let dSsE = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                        if (dateListSettledUSD.includes(dSsE)) {
                            amountListSettledUSD[amountListSettledUSD.length-1] += i.amount.amount_settled;
                        } else {
                            if (dSsE !== "NaN/NaN/NaN" && dSsE !== "1/1/1970") {
                                amountListSettledUSD.push(i.amount.amount_settled);
                                dateListSettledUSD.push(dSsE);
                            }
                        }
                        
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
            if (!transactionsEUR) transactionsEUR += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / 7);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        
            datesChart.push(dateListSentUSD, dateListReceivedUSD, dateListApprovedUSD, dateListSettledUSD, dateListSentEUR, dateListReceivedEUR, dateListApprovedEUR, dateListSettledEUR);
            amountsChart.push(amountListSentUSD, amountListReceivedUSD, amountListApprovedUSD, amountListSettledUSD, amountListSentEUR, amountListReceivedEUR, amountListApprovedEUR, amountListSettledEUR);
            chartBox(datesChart, amountsChart);
        });
    }
};
week.onclick = weekAmount;

// MONTH amount process


const monthAmount = () => {
    document.querySelector(".receivedUSD").innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.receivedUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.receivedEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.approvedUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.approvedEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.settledUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.settledEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.sentUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.sentEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;

    let sentAmountEuro = 0,
        sentAmountDollar = 0,
        receivedAmountEuro = 0,
        receivedAmountDollar = 0,
        approvedAmountEuro = 0,
        approvedAmountDollar = 0,
        settledAmountEuro = 0,
        settledAmountDollar = 0,
        transactionsUSD = 0,
        transactionsEUR = 0,
        receivedInvCount = 0,
        dateListSentUSD = [],
        dateListSentEUR = [],
        amountListSentUSD = [],
        amountListSentEUR = [],
        dateListReceivedUSD = [],
        dateListReceivedEUR = [],
        amountListReceivedUSD = [],
        amountListReceivedEUR = [],
        dateListApprovedUSD = [],
        dateListApprovedEUR = [],
        amountListApprovedUSD = [],
        amountListApprovedEUR = [],
        dateListSettledUSD = [],
        dateListSettledEUR = [],
        amountListSettledUSD = [],
        amountListSettledEUR = [],
        datesChart = [],
        amountsChart = [];

    periodTitle.innerHTML = `Month<i class="fas fa-sort-down"></i>`;

    if (merchantName.textContent == 'Select period') {
        let fetchPromise  = fetch('http://18.216.223.81:3000/getInvListMonth');
        fetchPromise.then(response => {
            return response.json();
        }).then(invoices => {
            invoices.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent;
                    receivedAmountEuro += +i.amount.amount_received;
                    approvedAmountEuro += +i.amount.amount_approved;
                    if (i.amount.amount_settled) {
                        settledAmountEuro += +i.amount.amount_settled;
                    }

                    let dSU = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                    if (dateListSentEUR.includes(dSU)) {
                        amountListSentEUR[amountListSentEUR.length-1] += +i.amount.amount_sent;
                    } else {
                        if (dSU !== "NaN/NaN/NaN" && dSU !== "1/1/1970") {
                            amountListSentEUR.push(+i.amount.amount_sent);
                            dateListSentEUR.push(dSU);
                        } 
                    }
                    let dRU = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                    if (dateListReceivedEUR.includes(dRU)) {
                        amountListReceivedEUR[amountListReceivedEUR.length-1] += i.amount.amount_received;
                    } else {
                        if (dRU !== "NaN/NaN/NaN" && dRU !== "1/1/1970") {
                            amountListReceivedEUR.push(i.amount.amount_received);
                            dateListReceivedEUR.push(dRU);
                        }
                    }
                    let dAU = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                    if (dateListApprovedEUR.includes(dAU)) {
                        amountListApprovedEUR[amountListApprovedEUR.length-1] += i.amount.amount_approved;
                    } else {
                        if (dAU !== "NaN/NaN/NaN" && dAU !== "1/1/1970") {
                            amountListApprovedEUR.push(i.amount.amount_approved);
                            dateListApprovedEUR.push(dAU);
                        }
                    }
                    let dSsU = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                    if (dateListSettledEUR.includes(dSsU)) {
                        amountListSettledEUR[amountListSettledEUR.length-1] += i.amount.amount_settled;
                    } else {
                        if (dSsU !== "NaN/NaN/NaN" && dSsU !== "1/1/1970") {
                            amountListSettledEUR.push(i.amount.amount_settled);
                            dateListSettledEUR.push(dSsU);
                        }
                    }

                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent;
                        receivedAmountDollar += +i.amount.amount_received;
                        approvedAmountDollar += +i.amount.amount_approved;
                        if (i.amount.amount_settled) {
                            settledAmountDollar += +i.amount.amount_settled;
                        }

                        let dSE = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                        if (dateListSentUSD.includes(dSE)) {
                            amountListSentUSD[amountListSentUSD.length-1] += +i.amount.amount_sent;
                        } else {
                            if (dSE !== "NaN/NaN/NaN" && dSE !== "1/1/1970") {
                                amountListSentUSD.push(+i.amount.amount_sent);
                                dateListSentUSD.push(dSE);
                            }
                        }
                        let dRE = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                        if (dateListReceivedUSD.includes(dRE)) {
                            amountListReceivedUSD[amountListReceivedUSD.length-1] += i.amount.amount_received;
                        } else {
                            if (dRE !== "NaN/NaN/NaN" && dRE !== "1/1/1970") {
                                amountListReceivedUSD.push(i.amount.amount_received);
                                dateListReceivedUSD.push(dRE);
                            }
                        }
                        let dAE = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                        if (dateListApprovedUSD.includes(dAE)) {
                            amountListApprovedUSD[amountListApprovedUSD.length-1] += i.amount.amount_approved;
                        } else {
                            if (dAE !== "NaN/NaN/NaN" && dAE !== "1/1/1970") {
                                amountListApprovedUSD.push(i.amount.amount_approved);
                                dateListApprovedUSD.push(dAE);
                            }
                        }
                        let dSsE = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                        if (dateListSettledUSD.includes(dSsE)) {
                            amountListSettledUSD[amountListSettledUSD.length-1] += i.amount.amount_settled;
                        } else {
                            if (dSsE !== "NaN/NaN/NaN" && dSsE !== "1/1/1970") {
                                amountListSettledUSD.push(i.amount.amount_settled);
                                dateListSettledUSD.push(dSsE);
                            }
                        }
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
            if (!transactionsEUR) transactionsEUR += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / 30);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        
            datesChart.push(dateListSentUSD, dateListReceivedUSD, dateListApprovedUSD, dateListSettledUSD, dateListSentEUR, dateListReceivedEUR, dateListApprovedEUR, dateListSettledEUR);
            amountsChart.push(amountListSentUSD, amountListReceivedUSD, amountListApprovedUSD, amountListSettledUSD, amountListSentEUR, amountListReceivedEUR, amountListApprovedEUR, amountListSettledEUR);
            chartBox(datesChart, amountsChart);
        })
        } else {
        let merLink = document.querySelector('.merchantName');
        let newFetchPromise  = fetch(`http://18.216.223.81:3000/getInvListMonth/${merLink.textContent}`);
        newFetchPromise.then(response => {
            return response.json();
        }).then(inv => {   
            inv.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent;
                    receivedAmountEuro += +i.amount.amount_received;
                    approvedAmountEuro += +i.amount.amount_approved;
                    if (i.amount.amount_settled) {
                        settledAmountEuro += +i.amount.amount_settled;
                    }

                    let dSU = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                    if (dateListSentEUR.includes(dSU)) {
                        amountListSentEUR[amountListSentEUR.length-1] += +i.amount.amount_sent;
                    } else {
                        if (dSU !== "NaN/NaN/NaN" && dSU !== "1/1/1970") {
                            amountListSentEUR.push(+i.amount.amount_sent);
                            dateListSentEUR.push(dSU);
                        } 
                    }
                    let dRU = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                    if (dateListReceivedEUR.includes(dRU)) {
                        amountListReceivedEUR[amountListReceivedEUR.length-1] += i.amount.amount_received;
                    } else {
                        if (dRU !== "NaN/NaN/NaN" && dRU !== "1/1/1970") {
                            amountListReceivedEUR.push(i.amount.amount_received);
                            dateListReceivedEUR.push(dRU);
                        }
                    }
                    let dAU = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                    if (dateListApprovedEUR.includes(dAU)) {
                        amountListApprovedEUR[amountListApprovedEUR.length-1] += i.amount.amount_approved;
                    } else {
                        if (dAU !== "NaN/NaN/NaN" && dAU !== "1/1/1970") {
                            amountListApprovedEUR.push(i.amount.amount_approved);
                            dateListApprovedEUR.push(dAU);
                        }
                    }
                    let dSsU = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                    if (dateListSettledEUR.includes(dSsU)) {
                        amountListSettledEUR[amountListSettledEUR.length-1] += i.amount.amount_settled;
                    } else {
                        if (dSsU !== "NaN/NaN/NaN" && dSsU !== "1/1/1970") {
                            amountListSettledEUR.push(i.amount.amount_settled);
                            dateListSettledEUR.push(dSsU);
                        }
                    }

                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent;
                        receivedAmountDollar += +i.amount.amount_received;
                        approvedAmountDollar += +i.amount.amount_approved;
                        if (i.amount.amount_settled) {
                            settledAmountDollar += +i.amount.amount_settled;
                        }

                        let dSE = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                        if (dateListSentUSD.includes(dSE)) {
                            amountListSentUSD[amountListSentUSD.length-1] += +i.amount.amount_sent;
                        } else {
                            if (dSE !== "NaN/NaN/NaN" && dSE !== "1/1/1970") {
                                amountListSentUSD.push(+i.amount.amount_sent);
                                dateListSentUSD.push(dSE);
                            }
                        }
                        let dRE = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                        if (dateListReceivedUSD.includes(dRE)) {
                            amountListReceivedUSD[amountListReceivedUSD.length-1] += i.amount.amount_received;
                        } else {
                            if (dRE !== "NaN/NaN/NaN" && dRE !== "1/1/1970") {
                                amountListReceivedUSD.push(i.amount.amount_received);
                                dateListReceivedUSD.push(dRE);
                            }
                        }
                        let dAE = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                        if (dateListApprovedUSD.includes(dAE)) {
                            amountListApprovedUSD[amountListApprovedUSD.length-1] += i.amount.amount_approved;
                        } else {
                            if (dAE !== "NaN/NaN/NaN" && dAE !== "1/1/1970") {
                                amountListApprovedUSD.push(i.amount.amount_approved);
                                dateListApprovedUSD.push(dAE);
                            }
                        }
                        let dSsE = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                        if (dateListSettledUSD.includes(dSsE)) {
                            amountListSettledUSD[amountListSettledUSD.length-1] += i.amount.amount_settled;
                        } else {
                            if (dSsE !== "NaN/NaN/NaN" && dSsE !== "1/1/1970") {
                                amountListSettledUSD.push(i.amount.amount_settled);
                                dateListSettledUSD.push(dSsE);
                            }
                        }
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
            if (!transactionsEUR) transactionsEUR += 1;
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / 30);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
        
            datesChart.push(dateListSentUSD, dateListReceivedUSD, dateListApprovedUSD, dateListSettledUSD, dateListSentEUR, dateListReceivedEUR, dateListApprovedEUR, dateListSettledEUR);
            amountsChart.push(amountListSentUSD, amountListReceivedUSD, amountListApprovedUSD, amountListSettledUSD, amountListSentEUR, amountListReceivedEUR, amountListApprovedEUR, amountListSettledEUR);
            chartBox(datesChart, amountsChart);
        });
    }
};
month.onclick = monthAmount;

// All time amount process

const allTimeAmount = () => {
    document.querySelector(".receivedUSD").innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.receivedUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.receivedEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.approvedUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.approvedEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.settledUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.settledEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.sentUSD').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    document.querySelector('.sentEUR').innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
    
    let sentAmountEuro = 0,
        sentAmountDollar = 0,
        receivedAmountEuro = 0,
        receivedAmountDollar = 0,
        approvedAmountEuro = 0,
        approvedAmountDollar = 0,
        settledAmountEuro = 0,
        settledAmountDollar = 0,
        transactionsUSD = 0,
        transactionsEUR = 0,
        receivedInvCount = 0,
        dateListSentUSD = [],
        dateListSentEUR = [],
        amountListSentUSD = [],
        amountListSentEUR = [],
        dateListReceivedUSD = [],
        dateListReceivedEUR = [],
        amountListReceivedUSD = [],
        amountListReceivedEUR = [],
        dateListApprovedUSD = [],
        dateListApprovedEUR = [],
        amountListApprovedUSD = [],
        amountListApprovedEUR = [],
        dateListSettledUSD = [],
        dateListSettledEUR = [],
        amountListSettledUSD = [],
        amountListSettledEUR = [],
        datesChart = [],
        amountsChart = [];
    periodTitle.innerHTML = `All Time<i class="fas fa-sort-down"></i>`;

    if (merchantName.textContent == 'Select period') {
        let fetchPromise  = fetch('http://18.216.223.81:3000/getInvListAll');
        fetchPromise.then(response => {
            return response.json();
        }).then(invoices => {
            invoices.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent;
                    receivedAmountEuro += +i.amount.amount_received;
                    approvedAmountEuro += +i.amount.amount_approved;
                    if (i.amount.amount_settled) {
                        settledAmountEuro += +i.amount.amount_settled;
                    }

                    let dSU = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                    if (dateListSentEUR.includes(dSU)) {
                        amountListSentEUR[amountListSentEUR.length-1] += +i.amount.amount_sent;
                    } else {
                        if (dSU !== "NaN/NaN/NaN" && dSU !== "1/1/1970") {
                            amountListSentEUR.push(+i.amount.amount_sent);
                            dateListSentEUR.push(dSU);
                        } 
                    }
                    let dRU = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                    if (dateListReceivedEUR.includes(dRU)) {
                        amountListReceivedEUR[amountListReceivedEUR.length-1] += i.amount.amount_received;
                    } else {
                        if (dRU !== "NaN/NaN/NaN" && dRU !== "1/1/1970") {
                            amountListReceivedEUR.push(i.amount.amount_received);
                            dateListReceivedEUR.push(dRU);
                        }
                    }
                    let dAU = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                    if (dateListApprovedEUR.includes(dAU)) {
                        amountListApprovedEUR[amountListApprovedEUR.length-1] += i.amount.amount_approved;
                    } else {
                        if (dAU !== "NaN/NaN/NaN" && dAU !== "1/1/1970") {
                            amountListApprovedEUR.push(i.amount.amount_approved);
                            dateListApprovedEUR.push(dAU);
                        }
                    }
                    let dSsU = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                    if (dateListSettledEUR.includes(dSsU)) {
                        amountListSettledEUR[amountListSettledEUR.length-1] += i.amount.amount_settled;
                    } else {
                        if (dSsU !== "NaN/NaN/NaN" && dSsU !== "1/1/1970") {
                            amountListSettledEUR.push(i.amount.amount_settled);
                            dateListSettledEUR.push(dSsU);
                        }
                    }

                    //amountListSentEUR.push(i.amount.amount_sent);
                    //dateListSentEUR.push( new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear());
                    //amountListReceivedEUR.push(i.amount.amount_received);
                    //dateListReceivedEUR.push( new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear());
                    //amountListApprovedEUR.push(+i.amount.amount_approved);
                    //dateListApprovedEUR.push( new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear());
                    //amountListSettledEUR.push(+i.amount.amount_settled);
                    //dateListSettledEUR.push( new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear());
                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent;
                        receivedAmountDollar += +i.amount.amount_received;
                        approvedAmountDollar += +i.amount.amount_approved;
                        if (i.amount.amount_settled) {
                            settledAmountDollar += +i.amount.amount_settled;
                        }

                        let dSE = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                        if (dateListSentUSD.includes(dSE)) {
                            amountListSentUSD[amountListSentUSD.length-1] += +i.amount.amount_sent;
                        } else {
                            if (dSE !== "NaN/NaN/NaN" && dSE !== "1/1/1970") {
                                amountListSentUSD.push(+i.amount.amount_sent);
                                dateListSentUSD.push(dSE);
                            }
                        }
                        let dRE = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                        if (dateListReceivedUSD.includes(dRE)) {
                            amountListReceivedUSD[amountListReceivedUSD.length-1] += i.amount.amount_received;
                        } else {
                            if (dRE !== "NaN/NaN/NaN" && dRE !== "1/1/1970") {
                                amountListReceivedUSD.push(i.amount.amount_received);
                                dateListReceivedUSD.push(dRE);
                            }
                        }
                        let dAE = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                        if (dateListApprovedUSD.includes(dAE)) {
                            amountListApprovedUSD[amountListApprovedUSD.length-1] += i.amount.amount_approved;
                        } else {
                            if (dAE !== "NaN/NaN/NaN" && dAE !== "1/1/1970") {
                                amountListApprovedUSD.push(i.amount.amount_approved);
                                dateListApprovedUSD.push(dAE);
                            }
                        }
                        let dSsE = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                        if (dateListSettledUSD.includes(dSsE)) {
                            amountListSettledUSD[amountListSettledUSD.length-1] += i.amount.amount_settled;
                        } else {
                            if (dSsE !== "NaN/NaN/NaN" && dSsE !== "1/1/1970") {
                                amountListSettledUSD.push(i.amount.amount_settled);
                                dateListSettledUSD.push(dSsE);
                            }
                        }
                       
                        // amountListSentUSD.push(i.amount.amount_sent);
                        // dateListSentUSD.push( new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear());
                        // amountListReceivedUSD.push(i.amount.amount_received);
                        // dateListReceivedUSD.push( new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear());
                        // amountListApprovedUSD.push(+i.amount.amount_approved);
                        // dateListApprovedUSD.push(new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear());
                        // amountListSettledUSD.push(+i.amount.amount_settled);
                        // dateListSettledUSD.push( new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear());
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
            
            datesChart.push(dateListSentUSD, dateListReceivedUSD, dateListApprovedUSD, dateListSettledUSD, dateListSentEUR, dateListReceivedEUR, dateListApprovedEUR, dateListSettledEUR);
            amountsChart.push(amountListSentUSD, amountListReceivedUSD, amountListApprovedUSD, amountListSettledUSD, amountListSentEUR, amountListReceivedEUR, amountListApprovedEUR, amountListSettledEUR);
            chartBox(datesChart, amountsChart);
        });
     } else {
        let merLink = document.querySelector('.merchantName');
        let newFetchPromiseA  = fetch(`http://18.216.223.81:3000/getInvListAll/${merLink.textContent}`);
        newFetchPromiseA.then(response => {
            return response.json();
        }).then(inv => {   
            inv.forEach( (i) => {
                if (i.status == 'Received') { receivedInvCount += 1; }
                if (i.currency == 'EUR') {
                    transactionsEUR += 1;
                    sentAmountEuro += +i.amount.amount_sent;
                    receivedAmountEuro += +i.amount.amount_received;
                    approvedAmountEuro += +i.amount.amount_approved;
                    if (i.amount.amount_settled) {
                        settledAmountEuro += +i.amount.amount_settled;
                    }

                    let dSU = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                    if (dateListSentEUR.includes(dSU)) {
                        amountListSentEUR[amountListSentEUR.length-1] += +i.amount.amount_sent;
                    } else {
                        if (dSU !== "NaN/NaN/NaN" && dSU !== "1/1/1970") {
                            amountListSentEUR.push(+i.amount.amount_sent);
                            dateListSentEUR.push(dSU);
                        } 
                    }
                    let dRU = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                    if (dateListReceivedEUR.includes(dRU)) {
                        amountListReceivedEUR[amountListReceivedEUR.length-1] += i.amount.amount_received;
                    } else {
                        if (dRU !== "NaN/NaN/NaN" && dRU !== "1/1/1970") {
                            amountListReceivedEUR.push(i.amount.amount_received);
                            dateListReceivedEUR.push(dRU);
                        }
                    }
                    let dAU = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                    if (dateListApprovedEUR.includes(dAU)) {
                        amountListApprovedEUR[amountListApprovedEUR.length-1] += i.amount.amount_approved;
                    } else {
                        if (dAU !== "NaN/NaN/NaN" && dAU !== "1/1/1970") {
                            amountListApprovedEUR.push(i.amount.amount_approved);
                            dateListApprovedEUR.push(dAU);
                        }
                    }
                    let dSsU = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                    if (dateListSettledEUR.includes(dSsU)) {
                        amountListSettledEUR[amountListSettledEUR.length-1] += i.amount.amount_settled;
                    } else {
                        if (dSsU !== "NaN/NaN/NaN" && dSsU !== "1/1/1970") {
                            amountListSettledEUR.push(i.amount.amount_settled);
                            dateListSettledEUR.push(dSsU);
                        }
                    }

                } else {
                    if (i.currency == 'USD') {
                        transactionsUSD += 1;
                        sentAmountDollar += +i.amount.amount_sent;
                        receivedAmountDollar += +i.amount.amount_received;
                        approvedAmountDollar += +i.amount.amount_approved;
                        if (i.amount.amount_settled) {
                            settledAmountDollar += +i.amount.amount_settled;
                        }

                        let dSE = new Date(i.dates.sent_date).getDate() + '/' + ( new Date(i.dates.sent_date).getMonth() + 1) + '/' + new Date(i.dates.sent_date).getFullYear();
                        if (dateListSentUSD.includes(dSE)) {
                            amountListSentUSD[amountListSentUSD.length-1] += +i.amount.amount_sent;
                        } else {
                            if (dSE !== "NaN/NaN/NaN" && dSE !== "1/1/1970") {
                                amountListSentUSD.push(+i.amount.amount_sent);
                                dateListSentUSD.push(dSE);
                            }
                        }
                        let dRE = new Date(i.dates.received_date).getDate() + '/' + ( new Date(i.dates.received_date).getMonth() + 1) + '/' + new Date(i.dates.received_date).getFullYear();
                        if (dateListReceivedUSD.includes(dRE)) {
                            amountListReceivedUSD[amountListReceivedUSD.length-1] += i.amount.amount_received;
                        } else {
                            if (dRE !== "NaN/NaN/NaN" && dRE !== "1/1/1970") {
                                amountListReceivedUSD.push(i.amount.amount_received);
                                dateListReceivedUSD.push(dRE);
                            }
                        }
                        let dAE = new Date(i.dates.approved_date).getDate() + '/' + ( new Date(i.dates.approved_date).getMonth() + 1) + '/' + new Date(i.dates.approved_date).getFullYear();
                        if (dateListApprovedUSD.includes(dAE)) {
                            amountListApprovedUSD[amountListApprovedUSD.length-1] += i.amount.amount_approved;
                        } else {
                            if (dAE !== "NaN/NaN/NaN" && dAE !== "1/1/1970") {
                                amountListApprovedUSD.push(i.amount.amount_approved);
                                dateListApprovedUSD.push(dAE);
                            }
                        }
                        let dSsE = new Date(i.dates.settled_date).getDate() + '/' + ( new Date(i.dates.settled_date).getMonth() + 1) + '/' + new Date(i.dates.settled_date).getFullYear();
                        if (dateListSettledUSD.includes(dSsE)) {
                            amountListSettledUSD[amountListSettledUSD.length-1] += i.amount.amount_settled;
                        } else {
                            if (dSsE !== "NaN/NaN/NaN" && dSsE !== "1/1/1970") {
                                amountListSettledUSD.push(i.amount.amount_settled);
                                dateListSettledUSD.push(dSsE);
                            }
                        }
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
            if (!transactionsEUR) transactionsEUR += 1;
            let bigDate = Math.round( (new Date() - new Date("2019-04-09")) / 86400000);
            transactionsNumber.innerHTML = receivedInvCount;
            transPerDayNum.innerHTML = Math.ceil(receivedInvCount / bigDate);
            avgTransactionUSD.innerHTML = `${formatStr(Math.round((receivedAmountDollar)/(transactionsUSD)))} <i class="fas fa-dollar-sign">`;
            avgTransactionEUR.innerHTML = `${formatStr(Math.round((receivedAmountEuro)/(transactionsEUR)))} <i class="fas fa-euro-sign">`;
            
            datesChart.push(dateListSentUSD, dateListReceivedUSD, dateListApprovedUSD, dateListSettledUSD, dateListSentEUR, dateListReceivedEUR, dateListApprovedEUR, dateListSettledEUR);
            amountsChart.push(amountListSentUSD, amountListReceivedUSD, amountListApprovedUSD, amountListSettledUSD, amountListSentEUR, amountListReceivedEUR, amountListApprovedEUR, amountListSettledEUR);
            chartBox(datesChart, amountsChart);
        });
    }
};
allTime.onclick = allTimeAmount;

// Chart box info

const chartBox = (dates, amounts) => {
    const ctx = document.getElementById('dashboardChart').getContext('2d');
    ctx.innerHTML = '';
    let [dateListSentUSD, dateListReceivedUSD, dateListApprovedUSD, dateListSettledUSD, dateListSentEUR, dateListReceivedEUR, dateListApprovedEUR, dateListSettledEUR] = dates;
    let [amountListSentUSD, amountListReceivedUSD, amountListApprovedUSD, amountListSettledUSD, amountListSentEUR, amountListReceivedEUR, amountListApprovedEUR, amountListSettledEUR] = amounts;
    const sentChartBtn = document.querySelector('.sentChartBtn'),
          receivedChartBtn = document.querySelector('.receivedChartBtn'),
          approvedChartBtn = document.querySelector('.approvedChartBtn'),
          settledChartBtn = document.querySelector('.settledChartBtn');
    
    var activeBtn = '';
    
    let isActiveBtn = () => {
        
       if ( sentChartBtn.classList.contains('selectedBtn') ) {
        activeBtn = 'sent'
       } else  if ( receivedChartBtn.classList.contains('selectedBtn') ) {
        activeBtn = 'received'
       } else  if ( approvedChartBtn.classList.contains('selectedBtn') ) {
        activeBtn = 'approved'
       } else if ( settledChartBtn.classList.contains('selectedBtn') ) {
        activeBtn = 'settled'
       } 
    };
    isActiveBtn();

    let chartData = (dateUSD, dateEUR, amountUSD, amountEUR) => {
        let date;
        if (dateUSD >= dateEUR) {
            date = dateUSD;
        } else {
            date = dateEUR;
        }
       
        var data = {
            labels: date,
            datasets: [{
            label: "Dollar",
            data: amountUSD,
                lineTension: 0.5,
                borderColor: '#475664',
                backgroundColor: 'rgba(225, 225, 225, 0)',
                pointBorderColor: '#475664',
                pointRadius: 3,
                pointHoverRadius: 10,
                pointHitRadius: 30,
                pointBorderWidth: 2,
                pointStyle: 'rectRounded'
                },
                {
                label: "Euro",
                data: amountEUR,
                    lineTension: 0.5,
                    borderColor: 'rgb(78, 185, 235)',
                    backgroundColor: 'rgba(225, 225, 225, 0)',
                    pointBorderColor: 'rgb(78, 185, 235)',
                    pointRadius: 3,
                    pointHoverRadius: 10,
                    pointHitRadius: 30,
                    pointBorderWidth: 2,
                    pointStyle: 'rectRounded'
                    }]
        };
        
        var options = {
            legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 80,
                fontColor: 'black'
            }
            }
        };

        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });
    }

    switch (activeBtn) {
        case 'sent':
            chartData(dateListSentUSD, dateListSentEUR, amountListSentUSD, amountListSentEUR);
          break;
        case 'received':
            chartData(dateListReceivedUSD, dateListReceivedEUR, amountListReceivedUSD, amountListReceivedEUR);
          break;
        case 'approved':
            chartData(dateListApprovedUSD, dateListApprovedEUR, amountListApprovedUSD, amountListApprovedEUR);
          break;
        case 'settled':
            chartData(dateListSettledUSD, dateListSettledEUR, amountListSettledUSD, amountListSettledEUR);
        break;
      }
    
}

$(document).ready(function(){
    $('.sentChartBtn').on('click', function(){
      $('.sentChartBtn').addClass('selectedBtn');
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
      $('.receivedChartBtn').removeClass('selectedBtn');
      $('.approvedChartBtn').removeClass('selectedBtn');
      $('.settledChartBtn').removeClass('selectedBtn');
    });
  });
  $(document).ready(function(){
    $('.receivedChartBtn').on('click', function(){
      $('.sentChartBtn').removeClass('selectedBtn');
      $('.receivedChartBtn').addClass('selectedBtn');
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
      
      $('.approvedChartBtn').removeClass('selectedBtn');
      $('.settledChartBtn').removeClass('selectedBtn');
    });
  });
  $(document).ready(function(){
    $('.approvedChartBtn').on('click', function(){
      $('.sentChartBtn').removeClass('selectedBtn');
      $('.receivedChartBtn').removeClass('selectedBtn');
      $('.approvedChartBtn').addClass('selectedBtn');
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
      $('.settledChartBtn').removeClass('selectedBtn');
    });
  });$(document).ready(function(){
    $('.settledChartBtn').on('click', function(){
      $('.sentChartBtn').removeClass('selectedBtn');
      $('.receivedChartBtn').removeClass('selectedBtn');
      $('.approvedChartBtn').removeClass('selectedBtn');
      $('.settledChartBtn').addClass('selectedBtn');
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
    });
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