
// Settle Transfers

$(document).ready(function(){
    $('.settleTransfBtn').on('click', function(event){
      event.preventDefault();
      let merchantName = document.querySelector('.merchantList').value;
      if (!merchantName) {
          return Swal.fire("Please, choose the merchant");
      }
      $('.SettleTransfersWindow').fadeIn();
      
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
                    this.container.innerHTML = '';
                    list.slice(0, list.length).forEach((item, i) => {
                        this.invsList = document.createElement("tr");
                        this.invsList.className = `tr${i}`;
                            this.invsList.innerHTML =  `
                            <td class="column column0">  <input class="check" type="checkbox" name='invoices' value=${item.amount.amount_approved + '/' + item.currency + '/' + item._id + '/' + merchantName}> ${item.client_details.full_name}</td> 
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
                            let currencyarr = e.target.value.split('/');
                            let selectedSum = parseFloat(e.target.value);
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

         //let walletsList  = fetch(`http://18.216.223.81:3000/getWalletsList/${merchantName}`);
       let walletsList  = fetch(`http://localhost:3000/getWalletsList/${merchantName}`);
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
                            this.option.value = item._id;
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
      let merchantName = document.querySelector('.merchantList').value;
      if (!merchantName) {
         return Swal.fire("Please, choose the merchant");
      }
      $('.MerchantPayWindow').fadeIn();
      document.querySelector(".walletPayFrom").innerHTML = '<option value="">Choose your wallet:</option>';
      document.querySelector(".inside_wallet").innerHTML = '';
       //let walletsList  = fetch(`http://18.216.223.81:3000/getWalletsList/${merchantName}`);
       let walletsList  = fetch(`http://localhost:3000/getWalletsList/${merchantName}`);
       walletsList.then(response => {
           return response.json();
           }).then(wallets => {
       
               class WalletOptoinList {
                   constructor(){
                       this.list = wallets;
                       this.render();
                   }
               
                   loadWalllet(list) {
                       this.container = document.querySelector('.walletPayFrom');
                       list.slice(0, list.length).forEach((item, i) => {
                           if ( this.container) {
                           this.option = document.createElement("option");
                           this.option.value = item._id;
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

           let walletPayFrom = document.querySelector('.walletPayFrom');

           walletPayFrom.addEventListener('change', (event) => {
            event.preventDefault();

            let currentWallet = wallets.filter(item => item._id == walletPayFrom.value); 
            document.querySelector('.hide-currency').innerHTML =  `<input name="currency" value=${currentWallet[0].currency}>`;
            document.querySelector('.hide-type').innerHTML =  `<input name="type" value="${currentWallet[0].type}">`;

            document.querySelector('.beneficiaryName').innerHTML = `${currentWallet[0].requisites.beneficiary_name}`;
            document.querySelector('.beneficiaryAddress').innerHTML = `${currentWallet[0].requisites.beneficiary_address}`;
            document.querySelector('.bankName').innerHTML = `${currentWallet[0].requisites.bank_name}`;
            document.querySelector('.bankAddress').innerHTML = `${currentWallet[0].requisites.bank_address}`;
            document.querySelector('.iban').innerHTML = `${currentWallet[0].requisites.iban}`;
            document.querySelector('.swift').innerHTML = `${currentWallet[0].requisites.swift}`;
       });

       //let inside_walletsList  = fetch(`http://18.216.223.81:3000/getInside_walletsList/${merchantName}`);
       let inside_walletsList  = fetch(`http://localhost:3000/getInside_walletsList/${merchantName}`);
       inside_walletsList.then(response => {
           return response.json();
           }).then(wallets => {
               class Inside_WalletOptoinList {
                   constructor(){
                       this.list = wallets;
                       this.render();
                   }
               
                   loadWalllet(list) {
                       this.container = document.querySelector('.inside_wallet');
                       this.inside_walletValance = document.querySelector('.AWBalance');
                       list.slice(0, list.length).forEach((item, i) => {
                           if ( this.container) {
                           this.option = document.createElement("option");
                           this.option.value = item._id;
                           this.option.innerHTML =  item.name;   
                           this.container.append(this.option);
                           };
                        this.inside_walletValance.innerHTML = `${list[0].balance} ${list[0].currency}`
                       });
                   }
                   render(){
                       this.loadWalllet(this.list);
                   }
               };
           const p = new Inside_WalletOptoinList(wallets);

            let insideWallet =  document.querySelector('.inside_wallet');

            insideWallet.addEventListener('change', (event) => {
                event.preventDefault();
                let currentInsideWallet = wallets.filter(item => item._id == insideWallet.value);
                document.querySelector('.AWBalance').innerHTML =  `${currentInsideWallet[0].balance} ${currentInsideWallet[0].currency}`;
            });
       });
    
      
    });
    });

    
    $('.MerchantPayWindow-close').on('click', function(event){
      event.preventDefault();
      $('.MerchantPayWindow').fadeOut();
            document.querySelector('.beneficiaryName').innerHTML = '';
            document.querySelector('.beneficiaryAddress').innerHTML ='';
            document.querySelector('.bankName').innerHTML = '';
            document.querySelector('.bankAddress').innerHTML = '';
            document.querySelector('.iban').innerHTML = '';
            document.querySelector('.swift').innerHTML = '';
    });
});


// Generate merchants list for selected menu

//let fetchPromise  = fetch('http://18.216.223.81:3000/getMerchants');
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
                    this.option.value = item._id;
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

    let merchantList = document.querySelector('.merchantList');

    merchantList.addEventListener('change', (event) => {
        event.preventDefault();
        let currentMerchant =  merchants.filter(item => item._id == merchantList.value);
        document.querySelector('.hide-merchantID').innerHTML =  `<input name="merchantID" value=${currentMerchant[0]._id}>`;
    });
});

// SETTLEMENTS LIST 

// Show settlements list

async function loadSettleList()  {
    //let settleList = await  fetch('http://18.216.223.81:3000/getSettlementsList');
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
            document.querySelector(".tableList").innerHTML = '';
            list.slice(0, list.length).forEach((item, i) => {
                this.settleList = document.createElement("tr");
                this.settleList.className = `tr${i}`;
                    this.settleList.innerHTML =  `
                    <td class="col column0">${item.mercName[0].name}</td> 
                    <td class="col column1">${new Date(item.dates.creation_date).getDate() + '/' + (new Date(item.dates.creation_date).getMonth()+ 1) + '/' +   new Date(item.dates.creation_date).getFullYear()}</td> 
                    <td class="col column2">${formatStr(item.amount)} ${item.currency}</td> 
                    <td class="col column3">${item.type}</td> 
                    <td class="col column4">${item.wallet[0].name}</td> 
                    <td class="col column5">${item.status}</td>
                `;
                
            // Settlement Details Window 

            this.settleList.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('#table-docs').innerHTML = '';
                document.querySelector('#tableTbody-comments').innerHTML = '';
                document.querySelector('#tableTbody-commissions').innerHTML = '';
                $('.filter').css('display', 'flex');
                
                this.merchName = document.querySelector('#settleMerchant');
                this.merchName.innerHTML = `${item.mercName[0].name}`
               
                document.querySelector('.settleInfoTitle').innerHTML = `Settlement to <strong>${item.wallet[0].name}</strong> made on  
                     <strong>${new Date(item.dates.creation_date).getDate() + '/' + (new Date(item.dates.creation_date).getMonth()+ 1) + '/' +   new Date(item.dates.creation_date).getFullYear()}</strong> for <strong>${formatStr(item.amount)} ${item.currency}</strong> - <span class="currentStatus">${item.status}</span>`;
                
                // EDIT BUTTONS

                this.sentBTN = document.querySelector('#sent');
                this.receivedBTN = document.querySelector('#received');
                this.declinedBTN = document.querySelector('#declined');

                this.sentBTN.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelector('.settleInfoTitle').innerHTML = `Settlement to <strong>${item.wallet[0].name}</strong> made on  
                     <strong>${new Date(item.dates.creation_date).getDate() + '/' + (new Date(item.dates.creation_date).getMonth()+ 1) + '/' +   new Date(item.dates.creation_date).getFullYear()}</strong> for <strong>${formatStr(item.amount)} ${item.currency}</strong> - <span class="currentStatus">Sent</span>`;
                    
                    (async () => {
                        //let addComment = await fetch(`http://18.216.223.81:3000/changeSettleStatus/${item._id}`, {
                        let changeSStatus = await fetch(`http://localhost:3000/changeSettleStatus/${item._id}`, {
                            method: "POST",
                            body: JSON.stringify({
                                newStatus: 'Sent',
                                sent_date: new Date(),
                            }),
                            headers:{'Content-Type': 'application/json'}
                        });
                    })();
                });

                this.receivedBTN.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelector('.settleInfoTitle').innerHTML = `Settlement to <strong>${item.wallet[0].name}</strong> made on  
                     <strong>${new Date(item.dates.creation_date).getDate() + '/' + (new Date(item.dates.creation_date).getMonth()+ 1) + '/' +   new Date(item.dates.creation_date).getFullYear()}</strong> for <strong>${formatStr(item.amount)} ${item.currency}</strong> - <span class="currentStatus">Received</span>`;
                    
                    (async () => {
                        //let addComment = await fetch(`http://18.216.223.81:3000/changeSettleStatus/${item._id}`, {
                        let changeSStatus = await fetch(`http://localhost:3000/changeSettleStatus/${item._id}`, {
                            method: "POST",
                            body: JSON.stringify({
                                newStatus: 'Received',
                                received_date: new Date(),
                            }),
                            headers:{'Content-Type': 'application/json'}
                        });
                    })();
                });

                this.declinedBTN.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.querySelector('.settleInfoTitle').innerHTML = `Settlement to <strong>${item.wallet[0].name}</strong> made on  
                     <strong>${new Date(item.dates.creation_date).getDate() + '/' + (new Date(item.dates.creation_date).getMonth()+ 1) + '/' +   new Date(item.dates.creation_date).getFullYear()}</strong> for <strong>${formatStr(item.amount)} ${item.currency}</strong> - <span class="currentStatus"> Declined</span>`;
                    
                     (async () => {
                        //let addComment = await fetch(`http://18.216.223.81:3000/changeSettleStatus/${item._id}`, {
                        let changeSStatus = await fetch(`http://localhost:3000/changeSettleStatus/${item._id}`, {
                            method: "POST",
                            body: JSON.stringify({
                                newStatus: 'Declined',
                                declined_date: new Date(),
                            }),
                            headers:{'Content-Type': 'application/json'}
                        });
                    })();
                });
                
                // Documents

                item.documentList.forEach((i) => {
                    this.docTable =  document.querySelector('#table-docs');
                    this.docList = document.createElement("tr");
                    this.docList.className = `tr${i}`;
                    this.docList.innerHTML = `
                        <td class="col column0">${i.type}</td> 
                        <td class="col column1">${new Date(i.creation_date).getDate() + '/' + (new Date(i.creation_date).getMonth()+ 1) + '/' +   new Date(i.creation_date).getFullYear()}</td> 
                        <td class="col column2"><span onclick="openDocsImage(event)" class="viewSpan">View</span></td>
                        <td class="col column3 hide">${i.filename}</td> 
                    `;

                    this.docTable.appendChild(this.docList);
                });

                this.uploadDocs = document.querySelector('#uploadDocs');

                this.uploadDocs.addEventListener('input', (e) => {
                   
                    this.clickToDownload = document.querySelector("#uploadDocs");
                    this.fileName = document.querySelector(".fileName");
                    this.fileWrapper = document.querySelector(".fileWrapper");
            
                    var fileName = this.clickToDownload.files[0];
                    this.fileName.innerHTML = fileName.name
            
                    // Add border
                    this.fileWrapper.style.backgroundColor = "rgba(18,199,178,1)";
                    this.fileWrapper.style.color = "white";
                    this.fileWrapper.style.fontWeight = "bold";
                    this.fileWrapper.style.border = "none";
                    
                });

                this.uploadBtn = document.querySelector('#uploadBtn');

                this.uploadBtn.addEventListener('click', (e) => {

                    const initialUpload = async () => {
                        e.preventDefault();
                
                        var type = document.querySelector("#docsSelect").value.trim();
                        var numberID = item._id;
                        var file = document.querySelector("#uploadDocs").files[0];
                        var creator = document.querySelector('.userName').textContent;
                        var emptyFile = checkIsEmptyObj(file);
                        
                        // If File exist and Type too than send req
                        if(!emptyFile && type){
                            var fd = new FormData();
                            fd.append("file", file);
                            fd.append("numberID", numberID);
                            fd.append("type", type);
                            fd.append("creator", creator);
                            await postFile(fd);
                     
                             // Update Modal Window View
                            this.docTablee =  document.querySelector('#table-docs');
                            this.docListt = document.createElement("tr");
                            this.docListt.className = `tr${i}`;
                            this.docListt.innerHTML = `
                                <td class="col column0">${type}</td> 
                                <td class="col column1">${new Date().getDate() + '/' + (new Date().getMonth()+ 1) + '/' +   new Date().getFullYear()}</td> 
                                <td class="col column2"><span onclick="openDocsImage(event)" class="viewSpan">View</span></td> 
                                <td class="col column3 hide">${file.filename}</td>
                            `;

                            this.docTablee.appendChild(this.docListt);
                
                            //  Cleanning Click ti Upload Input
                             document.querySelector("#uploadDocs").value = "";
                             document.querySelector("#docsSelect").value = "";
                             document.querySelector(".fileName").innerHTML = "Click to upload Document";
                            //  Restore style for File Wrapper
                             this.fileWrapper.style.backgroundColor = "white";
                             this.fileWrapper.style.color = "black";
                             this.fileWrapper.style.border = "1px solid rgb(159, 159, 159)";
                             this.fileWrapper.style.fontWeight = "normal";
                        } else {
                            Swal.fire("Please, choose the file and type!");
                        }
                    }
                
                    const postFile = async (fd) => {
                    return  await fetch("http://localhost:3000/uploadSettleDoc", {
                        // return  await fetch("http://18.216.223.81:3000/uploadSettleDoc", {
                            method: "POST",
                            body: fd,
                            mode: "no-cors",
                            headers:{'Accept': 'application/json'}
                        })
                        .then(res => {
                            if (res.status == 200) Swal.fire("Document successfully has been uploaded!");
                        }) 
                        .catch(err => {
                            console.log(err);
                        });
                    }

                    initialUpload();
                   
                });

                // Comments

                item.comments.forEach((i) => {
                    this.commentTable =  document.querySelector('#tableTbody-comments');
                    this.commentList = document.createElement("tr");
                    this.commentList.className = `tr${i}`;
                    this.commentList.innerHTML = `
                        <td class="col column0">${i.created_by}</td> 
                        <td class="col column1">${i.message}</td>
                    `;

                    this.commentTable.appendChild(this.commentList);
                });
                
                this.addCommentBtn = document.querySelector('#addCommentBtn');

                this.addCommentBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    let userName = document.querySelector('.userName').textContent;
                    let comm =  document.querySelector('#commentText').value;
                    this.commentTable =  document.querySelector('#tableTbody-comments');
                    this.commentTr = document.createElement("tr");
                    this.commentTr.innerHTML = `
                        <td class="col column0">${userName}</td> 
                        <td class="col column1">${comm}</td>
                    `;
                    this.commentTable.appendChild(this.commentTr);

                    (async () => {
                        //let addComment = await fetch(`http://18.216.223.81:3000/addSettleComment/${item._id}`, {
                        let addComment = await fetch(`http://localhost:3000/addSettleComment/${item._id}`, {
                            method: "POST",
                            body: JSON.stringify({
                                created_by: userName,
                                creation_date: new Date(),
                                message: comm
                            }),
                            headers:{'Content-Type': 'application/json'}
                        });
                    })();
                });
               
                // Commissions

                item.commissionsList.forEach((i) => {
                    this.commisionTable =  document.querySelector('#tableTbody-commissions');
                    this.commisionList = document.createElement("tr");
                    this.commisionList.className = `tr${i}`;
                    this.commisionList.innerHTML = `
                        <td class="col column0">${i.created_by}</td> 
                        <td class="col column1">${i.type}</td>
                        <td class="col column2">${i.amount}</td>
                    `;
                    this.commisionTable.appendChild(this.commisionList);
                });
                
                this.addCommissionsBtn = document.querySelector('#addCommissionsBtn');
                
                this.addCommissionsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.userName = document.querySelector('.userName').textContent;
                    this.commisType =  document.querySelector('.commissionType').value;
                    this.commisAmount =  +document.querySelector('.commissionAmount').value;

                    this.commisstTable =  document.querySelector('#tableTbody-commissions');
                    this.commisTR = document.createElement("tr");
                    this.commisTR.innerHTML = `
                        <td class="col column0">${this.userName}</td> 
                        <td class="col column1">${this.commisType}</td>
                        <td class="col column2">${this.commisAmount}</td>
                    `;
                    this.commisstTable.appendChild(this.commisTR);

                    (async () => {
                        //let addCommision = await fetch(`http://18.216.223.81:3000/addSettleCommision/${item._id}`, {
                        let addCommision = await fetch(`http://localhost:3000/addSettleCommision/${item._id}`, {
                            method: "POST",
                            body: JSON.stringify({
                                created_by: this.userName,
                                type: this.commisType,
                                amount: this.commisAmount
                            }),
                            headers:{'Content-Type': 'application/json'}
                        });
                    })();
                });

                document.querySelector('.settlementDetails-close').addEventListener('click', (e) => {
                    $('.filter').css('display', 'none');
                    location.reload(true);
                    // document.querySelector(".tableList").innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
                    // loadSettleList();
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
            } else if ( claim1 && claim2 && !date ) {
                newSettleList = SETTLEMENTS.filter( (i) => {
                    return (i.status == claim1) && (i.merchant == claim2)
                } );
            }  else if (!date) {
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
            this.colorStatus();
        }
    };

    // Add action to buttons Clear(ShowAll) and Show(Filter)

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

};
document.querySelector(".tableList").innerHTML = `<div class="loadAnimationWrapp"><img class="loadAnimation" src="img/Gear-2.5s-200px.gif"><span>Loading...</span></div>`;
loadSettleList();

// SETTLEMENT PREVIEW 

let prevSettleBtn = document.querySelector('.settlePrevBtn');

prevSettleBtn.addEventListener('click', (e) => {
    document.location.href='/settlementPreview.html';

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

// Additional function

function checkIsEmptyObj (obj) {
    for (let key in obj) {
        return false; // wrong
    }
    return true; // is epmty
}

// Open downloded files for settlement

function openDocsImage (event) {
    var filename = event.target.closest("tr").children[3].textContent.trim();
    window.open(`http://localhost:3000/upload/${filename}`, '_blank');
    //window.open(`http://18.216.223.81:3000/upload/${filename}`, '_blank');
}


// Alert modal window
const alertWindow = document.querySelector('.alert');
if (alertWindow) {
  alertWindow.addEventListener("click", (event) => {
      event.target === alertWindow ? alertWindow.style.display = "none" : "";
  });
}