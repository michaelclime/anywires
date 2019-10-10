
// Settle Transfers

$(document).ready(function(){
    $('.settleTransfBtn').on('click', function(event){
      event.preventDefault();
      $('.SettleTransfersWindow').fadeIn();
        let merchantName = document.querySelector('.merchantList').value;
        document.querySelector(".ttableList").innerHTML = '';
        document.querySelector(".walletList").innerHTML = '<option value="">Wallet for Settlement:</option>';
        //let availableInvs  = fetch('http://18.216.223.81:3000/getList');
        let availableInvs  = fetch(`http://localhost:3000/availableInvs/${merchantName}`);
        availableInvs.then(response => {
            return response.json();
        }).then(invoices => {

            class InvoicesList {
                constructor(){
                    this.list = invoices;
                    this.render();
                }
            
                loadInvoice(list) {
                    this.container = document.querySelector(".ttableList");
                    list.slice(0, list.length).forEach((item, i) => {
                        this.invsList = document.createElement("tr");
                        this.invsList.className = `tr${i}`;
                            this.invsList.innerHTML =  `
                            <td class="column column0">  <input class="check" type="checkbox" name=${item.amount.amount_approved + '/' + item.currency}> ${item.client_details.full_name}</td> 
                            <td class="column column1"> ${formatStr(item.amount.amount_received)} ${item.currency}</td> 
                            <td class="column column2">${formatStr(item.commissions)} ${item.currency}</td> 
                            <td class="column column3">${formatStr(item.amount.amount_approved)} ${item.currency}</td> 
                        `;   
                    this.container.appendChild(this.invsList);
                    });
                }

                approvedSum = () => {
                    const checkBoxes = document.querySelectorAll(".check");
                
                    checkBoxes.forEach((i) => {
                        i.addEventListener('click', (e) => {
                            let spanSum = document.querySelector(".totalSum");
                            let currencyarr = e.target.name.split('/');
                            let selectedSum = parseFloat(e.target.name);
                            let classesList = e.target.className.split(' ');
                            
                            if (classesList.includes("selected")) {
                                e.target.classList.remove("selected");
                                spanSum.innerHTML = `${parseFloat(spanSum.textContent) - selectedSum + ' ' + currencyarr[1]}`;
                            } else {
                                if (spanSum.textContent) {
                                    let prevCurr = spanSum.textContent.split(' ')[1];
                                    if (prevCurr == currencyarr[1]) {
                                        spanSum.innerHTML = `${parseFloat(spanSum.textContent) + selectedSum + ' ' + currencyarr[1]}`;
                                    } else {
                                        spanSum.innerHTML = `${selectedSum + ' ' + currencyarr[1]}`;
                                        checkBoxes.forEach( (it) => { it.checked = false; it.classList.remove("selected"); } );
                                        e.target.checked = true; 
                                        Swal.fire({ type: 'error', title: 'Not correct currency', text: 'Please, select the same currency!'});
                                    }
                                    
                                } else {
                                    spanSum.innerHTML = `${selectedSum + ' ' + currencyarr[1]}`;
                                }
                                e.target.classList.add("selected");
                            }
                        });
                    });
                };

                render(){
                    this.loadInvoice(this.list);
                    this.approvedSum();
                }
            };

            const a = new InvoicesList(invoices);
        });

        //let walletsList  = fetch('http://18.216.223.81:3000/getWalletsList');
        let walletsList  = fetch('http://localhost:3000/getWalletsList');
        walletsList.then(response => {
            return response.json();
            }).then(wallets => {
        
                class WalletOptoinList {
                    constructor(){
                        this.list = wallets;
                        this.render();
                    }
                
                    loadWalllet(list) {
                        this.container = document.querySelector('.walletList');
                        list.slice(0, list.length).forEach((item, i) => {
                            if ( this.container) {
                            this.option = document.createElement("option");
                            this.option.value = item.name;
                            this.option.innerHTML =  item.name;   
                            this.container.append(this.option);
                            }
                        });
                    }
                    render(){
                        this.loadWalllet(this.list);
                    }
                };
        
            const a = new WalletOptoinList(wallets);
        });
    });
    $('.SettleTransfersWindow-close').on('click', function(event){
      event.preventDefault();
      $('.SettleTransfersWindow').fadeOut();
    });
});

// Pay From AW Wallet

$(document).ready(function(){
    $('.payFromAwWalletBtn').on('click', function(event){
      event.preventDefault();
      $('.MerchantPayWindow').fadeIn();
    });
    $('.MerchantPayWindow-close').on('click', function(event){
      event.preventDefault();
      $('.MerchantPayWindow').fadeOut();
    });
});

// CREATE WALLET

$(document).ready(function(){
    $('.createWalletBtn').on('click', function(event){
      event.preventDefault();
      $('.MerchantPayWindow').fadeOut();
      $('.createWalletWindow').fadeIn();
    });
    $('.createWalletWindow-close').on('click', function(event){
      event.preventDefault();
      $('.createWalletWindow').fadeOut();
      $('.MerchantPayWindow').fadeIn();
    });
});


$(document).ready(function(){
    $('.creatingWalletBtn').on('click', function(event){
      event.preventDefault();
      $('.createWalletWindow').fadeOut();
      $('.wallet').append(`<option>${$('.walletName').val()}</option>`);
      $('.MerchantPayWindow').fadeIn();
    });
});

// Generate merchants list for selected menu

let fetchPromise  = fetch('http://localhost:3000/getMerchants');
fetchPromise.then(response => {
    return response.json();
    }).then(merchants => {

        class MerchantOptoinList {
            constructor(){
                this.list = merchants;
                this.render();
            }
        
            loadMerchant(list) {
                this.container = document.querySelector('#filterMerchantA');
                list.slice(0, list.length).forEach((item, i) => {
                    if ( this.container) {
                    this.option = document.createElement("option");
                    this.option.value = item.name;
                    this.option.innerHTML =  item.name;   
                    this.container.append(this.option);
                    }
                });
            }
            render(){
                this.loadMerchant(this.list);
            }
        };

    const a = new MerchantOptoinList(merchants);
});

// SETTLEMENTS LIST 

// Show settlements list

(async () => {
    let settleList = await  fetch('http://localhost:3000/getSettlementsList');
    let SETTLEMENTS = await settleList.json();

    class SettlementsList {
        constructor(){
            this.buttonSearch = document.querySelector('.search-btn');
            this.searchInput =  document.querySelector('.input-search');
            this.render();
        }
    
        loadSettle(list) {
            this.container = document.querySelector(".tableList");
            list.slice(0, list.length).forEach((item, i) => {
                this.settleList = document.createElement("tr");
                this.settleList.className = `tr${i}`;
                 
                    this.settleList.innerHTML =  `
                    <td class="col column0">${item.merchant}</td> 
                    <td class="col column1">${new Date(item.dates.creation_date).getDate() + '/' + (new Date(item.dates.creation_date).getMonth()+ 1) + '/' +   new Date(item.dates.creation_date).getFullYear()}</td> 
                    <td class="col column2">${formatStr(item.amount)} ${item.currency}</td> 
                    <td class="col column3">${item.type}</td> 
                    <td class="col column4">${item.wallet[0].name}</td> 
                    <td class="col column5">${item.status}</td>
                `;
                
            this.settleList.addEventListener('click', (e) => {
                e.preventDefault();
                $('.filter').css('display', 'flex');

                // Settlement Details Window
                
                this.merchName = document.querySelector('#settleMerchant');
                this.merchName.innerHTML = `${item.merchant}`
               
                document.querySelector('.settleInfoTitle').innerHTML = `Settlement to <strong>${item.wallet[0].name}</strong> made on  
                     <strong>${new Date(item.dates.creation_date).getDate() + '/' + (new Date(item.dates.creation_date).getMonth()+ 1) + '/' +   new Date(item.dates.creation_date).getFullYear()}</strong> for <strong>${formatStr(item.amount)} ${item.currency}</strong> - <span class="currentStatus">${item.status}</span>`;
                
                

                document.querySelector('.settlementDetails-close').addEventListener('click', (e) => {
                    $('.filter').css('display', 'none');
                });
            });   
            this.container.appendChild(this.settleList);
            });
        }
    
        colorStatus() {
            let statusCells = document.querySelectorAll('.column5');
            
            statusCells.forEach( (i) => {
                switch (i.textContent + '') {
                    case 'Received':
                        i.style.color = 'rgb(0, 200, 81)';
                        break;
                    case 'Declined':
                        i.style.color = 'rgb(255, 119, 119)';
                        break;
                    case 'Requested':
                        i.style.color = '#5cb9f3';
                        break;
                    case 'Sent':
                        i.style.color = '#f48120';
                        break;
                }
            });
        }
    
        changeStatus() {
            let btns = document.querySelectorAll('.receivedBtn');
    
            btns.forEach( (i) => {
                i.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let state = (e.target.parentElement).previousElementSibling;
                    state.innerHTML = "Received";
                    this.colorStatus();
                    i.style.display = 'none';
                    let rowId = +((e.target.parentElement).parentElement).className.match(/\d+/);
                    SETTLEMENTS[rowId].Status = "Received";
                });
            });        
        }
    
        searchFunction() {
            let table = document.getElementById('main-table');
            let phrase = document.querySelector('.input-search').value.toLowerCase();
            for (var i = 1; i < table.rows.length; i++) {
                var flag = false;
                for (var j = 0; j < 6; j++) {
                    var item = table.rows[i].cells[j].textContent.toLowerCase();
                    if (item.includes(phrase)) flag = true;
                }
                if (!flag) {
                    table.rows[i].style.display = "none";
                }
            }
        }
    
        keyPressSearch() {
            this.searchInput.addEventListener('keydown', (event) => {
                if (event.key == "Enter") {
                   this.searchFunction();
                }
            });
        }
    
        render(){
            this.loadSettle(SETTLEMENTS);
            this.changeStatus();
            this.colorStatus();
            this.buttonSearch.addEventListener("click", this.searchFunction);
            this.keyPressSearch();
        }
    };
    const settlementsList1 = new SettlementsList();

    // FILTER

    let newSettleList = [];
    class FilterList extends SettlementsList {
    
        filter() {
            let statusMenu = document.querySelector('.status');
            let merchantList = document.querySelector('.merchantList');
            let date =  document.querySelector('.dateForm').value;
            let dateArr = date.split('—');
            let [date1, date2] = dateArr;
            let claim1 = statusMenu.options[statusMenu.selectedIndex].value;
            let claim2 = merchantList.options[merchantList.selectedIndex].value;

            if (claim1 && claim2 && date ) {
                newSettleList = SETTLEMENTS.filter( (i) => {
                    return (i.status == claim1) && (i.merchant == claim2) && ( new Date(i.dates.creation_date) > new Date(date1) ) && ( new Date(i.dates.creation_date) < new Date(date2) )
                } );
            } else if (claim1 && date ) {
                newSettleList = SETTLEMENTS.filter( (i) => {
                    return (i.status == claim1) && ( new Date(i.dates.creation_date) > new Date(date1) ) && ( new Date(i.dates.creation_date) < new Date(date2) )
                } );
            } else if (claim2 && date ) {
                newSettleList = SETTLEMENTS.filter( (i) => {
                    return (i.merchant == claim2) && ( new Date(i.dates.creation_date) > new Date(date1) ) && ( new Date(i.dates.creation_date) < new Date(date2) )
                } );
            } else if (!date) {
                newSettleList = SETTLEMENTS.filter( (i) => {
                    return claim1 ? (i.status == claim1) : (i.merchant == claim2);
                } );
            } else if ( !claim1 && !claim2 && date ) {
                newSettleList = SETTLEMENTS.filter( (i) => {
                    return ( new Date(i.dates.creation_date) > new Date(date1) ) && ( new Date(i.dates.creation_date) < new Date(date2) )
                } );
            }
        }

        render() {
            this.filter()
            this.loadSettle(newSettleList);
            this.changeStatus();
            this.colorStatus();
        }
    };

    // Add action to buttons ShowAll and Filter

    let showAllBtn = document.querySelector('.showAllBtn');
    let filterlBtn = document.querySelector('.filterBtn');

    showAllBtn.addEventListener('click', (e) => { 
        document.querySelector(".tableList").innerHTML = '';
        //const settlementsList = new SettlementsList();
        location.reload(true);
    });
    filterlBtn.addEventListener('click', (e) => { 
        document.querySelector(".tableList").innerHTML = '';
        const filterList = new FilterList();
    });

})();

// SETTLEMENT PREVIEW 

let prevSettleBtn = document.querySelector('.settlePrevBtn');

prevSettleBtn.addEventListener('click', (e) => {
    document.location.href='/settlementPreview.html';

});


// // UPLOAD FILE BUTTON

// document.getElementById('buttonid').addEventListener('click', openDialog);

// function openDialog() {
//   document.getElementById('fileid').click();
// }

// // COMMENT BUTTON

// class Comment {
//     constructor(userName, comm) {
//         this.userName = userName;
//         this.comm = comm;
//         this.render();
//     }

//     coment() {
//         this.container = document.querySelector(".commentTitile");
//         this.div = document.createElement("div");
//         this.div.className = 'comment';
//         this.div.innerHTML = `
//             <span>${this.userName}</span>
//             <p>${this.comm}</p>
//         `;
//      this.div.appendAfter(this.container);
//     }

//     render() {
//         this.coment();
//     }
// }

// let commentBtn = document.querySelector('.addCommentBtn');

// commentBtn.addEventListener('click', (e) => {
//     let userName = 'AW_Finance';
//     let comm =  document.querySelector('.commentField').value;
//     let a = new Comment(userName, comm);
// });


// // ADD COMMISSION BUTTON

// class Commission {
//     constructor(userName, commis, commisSum) {
//         this.userName = userName;
//         this.commis = commis;
//         this.commisSum = commisSum;
//         this.render();
//     }

//     commissions() {
//         this.container = document.querySelector(".fourthRowCommentBlock");
//         this.div = document.createElement("div");
//         this.div.className = 'comment';
//         this.div.innerHTML = `
//             <span>${this.userName}</span>
//             <p>${this.commis}</p>
//             <span>€${this.commisSum}</span>
//         `;
//      this.div.appendAfter(this.container);
//     }

//     render() {
//         this.commissions();
//     }
// }

// let commissionBtn = document.querySelector('.addCommissionBtn');

// commissionBtn.addEventListener('click', (e) => {
//     let userName = 'AW_Finance';
//     let commis =  document.querySelector('.commissionType').value;
//     let commisSum =  document.querySelector('.commissionAmount').value;
//     let c = new Commission(userName, commis, commisSum);
// });


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

// Add appendAfter method

Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
  },false;