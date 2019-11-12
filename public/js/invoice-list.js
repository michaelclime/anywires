class invoiceList {
    constructor(){
        this.currency = "";
        this.currentTr = "";
        this.ArrayLIst = [];
        this.ArrayBanks = [];
        this.ArrayMerchants = []; 
        this.InvoiceNumbers = [];
        this.btnExel = document.querySelector("#dowloadXls");
        this.clearFilterBtn = document.querySelector("#clearFilterBtn");
        this.showFilterBtn = document.querySelector("#showBtn");
        this.btn_search = document.querySelector(".search-btn");
        this.containerPages = document.querySelector(".nextPage-block");
        this.bankFilter = document.querySelector("#filterBank");
        this.merchFilter = document.querySelector("#filterMerchant");
        this.creationDate = document.querySelector(".creationDate");
        this.receiveDate = document.querySelector(".receiveDate");
        this.currentUser = document.querySelector("#currentUser");
        this.textAreaAddComment = document.querySelector("#commentText")
        this.firstPage = document.querySelector(".firstPage-block");
        this.firstPageImg = document.querySelector("#first-img");
        this.editData = document.querySelectorAll(".editData");
        this.inputSearch = document.querySelector(".input-search");
        this.currentInvoice = [];
        this.currentBank = [];
        this.currentMerhcant = [];
        this.currentUserRole = document.querySelector(".curentUserRole");
        this.sentFilter = document.querySelector(".sent_Filter");
        this.loadingGif = document.querySelector("#loadingGif");
        this.filterReceive = document.querySelector(".receive_Filter");
        this.filterApproved = document.querySelector(".approved_Filter");
        this.render();
    }

    reCallStatusRequest = async (data) => {
        return  await fetch("http://18.216.223.81:3000/recallStatus", {
                method: "POST",
                body: JSON.stringify(data),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    reCallStatus = async () => {
        var checkStatus = ["Received", "Approved", "Available"].some((item) => item === this.currentInvoice[0].status);
        if (checkStatus) {
            // Loading GIF On
            this.loadingGif.style.display = "flex";

            var createdBy = this.currentUser.textContent.trim();
            var currentAmount = `amount_${this.currentInvoice[0].status.toLowerCase()}`;

            // If Invoice currency USD
            var USD = "";
            if (this.currentInvoice[0].currency === "USD"){
                var currencyInv = await this.getEURexchange("EUR", "USD");
                USD = currencyInv.rates.USD;
            }

            // Recall request
            var data = {
                "invNumber": this.currentInvoice[0].number,
                "createdBy": createdBy,
                "currencySymbol": this.currency,
                "amountReceived": this.currentInvoice[0].amount.amount_received,
                "amountRecall": this.currentInvoice[0].amount[currentAmount],
                "beforeRecallStatus": this.currentInvoice[0].status,
                "USD": USD
            };

            await this.reCallStatusRequest(data);

            // Change status for currentInvoice
            this.currentInvoice[0].status = "Recall";
            this.currentInvoice[0].dates.recall_date = new Date();

            // Update Comment Area for this.currentInvoce Obj
            this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
            this.currentInvoice[0].comments.unshift({
                "created_by": createdBy,
                "creation_date": new Date(),
                "message": `Invoice #${this.currentInvoice[0].number}. Transfer for ${this.currency}${this.currentInvoice[0].amount[currentAmount]} was Recall!`
            });
            this.tableCommentsRender(this.currentInvoice[0].comments);

             // Change table info for current Invoice
             this.currentTr.children[8].innerHTML = `<strong>Recall</strong>`;
             this.currentTr.children[8].style.color = `#560795`;
             document.querySelector(".currentStatus").innerHTML = `Recall`;
             document.querySelector(".currentStatus").style.color = `#560795`;
             
             // Loading GIF Off
            this.loadingGif.style.display = "none";

        } else {
            this.alertWindow(`Your current status ${this.currentInvoice[0].status} does't allow this!`);
        }
    }

    unfrozenStatusRequest = async (data) => {
        return  await fetch("http://18.216.223.81:3000/unfrozenStatus", {
                method: "POST",
                body: JSON.stringify(data),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    unfrozenStatus = async () => {
        if (this.currentInvoice[0].status === "Frozen") {
            // Loading GIF On
            this.loadingGif.style.display = "flex";

            var createdBy = this.currentUser.textContent.trim();
            var currentAmount = `amount_${this.currentInvoice[0].before_freeze.toLowerCase()}`;

            // Unfrozen request
            var data = {
                "invNumber": this.currentInvoice[0].number,
                "createdBy": createdBy,
                "currencySymbol": this.currency,
                "amountUnfrozen": this.currentInvoice[0].amount[currentAmount],
                "amountReceived": this.currentInvoice[0].amount.amount_received,
                "beforeFreezeStatus": this.currentInvoice[0].before_freeze
            };
            await this.unfrozenStatusRequest(data);

            // Change status for currentInvoice
            this.currentInvoice[0].status = this.currentInvoice[0].before_freeze;
            this.currentInvoice[0].before_freeze = "Unfrozen";
            this.currentInvoice[0].dates.unfrozen_date = new Date();

            // Update Comment Area for this.currentInvoce Obj
            this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
            this.currentInvoice[0].comments.unshift({
                "created_by": createdBy,
                "creation_date": new Date(),
                "message": `Invoice #${this.currentInvoice[0].number}. Transfer for ${this.currency}${this.currentInvoice[0].amount[currentAmount]} was Unfrozen!`
            });
            this.tableCommentsRender(this.currentInvoice[0].comments);

            // Change table info for current Invoice
            var color = "rgb(49, 117, 218)";
            this.currentInvoice[0].status === "Approved" ? color = "rgb(11, 158, 141)" : "";
            this.currentInvoice[0].status === "Available" ? color = "rgb(0, 200, 81)" : "";
            this.currentTr.children[8].innerHTML = `<strong>${this.currentInvoice[0].status}</strong>`;
            this.currentTr.children[8].style.color = `${color}`;
            document.querySelector(".currentStatus").innerHTML = `${this.currentInvoice[0].status}`;
            document.querySelector(".currentStatus").style.color = `${color}`;

            // Remove Unfroze btn
            document.getElementById('frozenWrapper').innerHTML = `<button id="frozenBtn">Frozen</button>`;
            document.querySelector("#frozenBtn").addEventListener("click", this.frozenStatus);

            // Loading GIF Off
            this.loadingGif.style.display = "none";

        } else {
            this.alertWindow(`Your current status ${this.currentInvoice[0].status} does't allow this!`);
        }
    }

    frozenStatusRequest = async (data) => {
        return  await fetch("http://18.216.223.81:3000/frozenStatus", {
                method: "POST",
                body: JSON.stringify(data),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    frozenStatus = async () => {
        var checkStatus = ["Received", "Approved", "Available"].some((item) => item === this.currentInvoice[0].status);
        if (checkStatus) {
            // Loading GIF On
            this.loadingGif.style.display = "flex";

            var currentAmount = `amount_${this.currentInvoice[0].status.toLowerCase()}`;
            var createdBy = this.currentUser.textContent.trim();

            // Frozen request
            var data = {
                "invNumber": this.currentInvoice[0].number,
                "invStatus": this.currentInvoice[0].status,
                "createdBy": createdBy,
                "currencySymbol": this.currency,
                "amountFrozen": this.currentInvoice[0].amount[currentAmount],
                "amountReceived": this.currentInvoice[0].amount.amount_received
            };
            await this.frozenStatusRequest(data);

            // Change status for currentInvoice
            this.currentInvoice[0].before_freeze = this.currentInvoice[0].status;
            this.currentInvoice[0].status = "Frozen";
            this.currentInvoice[0].dates.frozen_date = new Date();

            // Change table info for current Invoice
            this.currentTr.children[8].innerHTML = `<strong>Frozen</strong>`;
            this.currentTr.children[8].style.color = "rgb(101, 152, 228)";
            document.querySelector(".currentStatus").innerHTML = "Frozen";
            document.querySelector(".currentStatus").style.color = "rgb(101, 152, 228)";

            // Update Comment Area for this.currentInvoce Obj
            this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
            this.currentInvoice[0].comments.unshift({
                "created_by": createdBy,
                "creation_date": new Date(),
                "message": `Invoice #${this.currentInvoice[0].number}. Transfer for ${this.currency}${this.currentInvoice[0].amount[currentAmount]} was Frozen!`
            });
            this.tableCommentsRender(this.currentInvoice[0].comments);

            // Remove Froze btn
            document.getElementById('frozenWrapper').innerHTML = `<button id="unFrozenBtn">Unfrozen</button>`;
            document.querySelector("#unFrozenBtn").addEventListener("click", this.unfrozenStatus);


            // Loading GIF OFF
            this.loadingGif.style.display = "none";

        } else {
            this.alertWindow(`Your current status ${this.currentInvoice[0].status} does't allow this!`);
        }
    }

    alertWindow = (text) => {
        var filter =  document.querySelector(".alert_filter");
        filter.style.display = "flex";
        document.querySelector("#alert_body_text").innerHTML = text;
        document.querySelector("#alert_button").onclick = () => filter.style.display = "none";
    }

    settledInvoiceStatus = async (data) => {
        return  await fetch("http://18.216.223.81:3000/settledStatus", {
                method: "POST",
                body: JSON.stringify(data),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    settledStatus = async () => {
        if (this.currentInvoice[0].status !== "Declined" && this.currentInvoice[0].status !== "Settled") {
            // Loading GIF ON
            this.loadingGif.style.display = "flex";

            var amountSettled = `amount_${this.currentInvoice[0].status.toLowerCase()}`;
            var createdBy = this.currentUser.textContent.trim();

            // Settled request
            var data = {
                "invNumber": this.currentInvoice[0].number,
                "createdBy": createdBy,
                "currencySymbol": this.currency,
                "amountSettled": this.currentInvoice[0].amount[amountSettled],
                "oldInvStatus": this.currentInvoice[0].status
            };
            await this.settledInvoiceStatus(data);

            // Change status, Declined date and Status for currentInvoice
            this.currentInvoice[0].status = "Settled";
            this.currentInvoice[0].dates.settled_date = new Date();
            this.currentInvoice[0].settleSelectedStatus = true;

            // Change table info for current Invoice
            this.currentTr.children[8].innerHTML = `<strong>Settled</strong>`;
            this.currentTr.children[8].style.color = "black";
            document.querySelector(".currentStatus").innerHTML = "Settled";
            document.querySelector(".currentStatus").style.color = "black";

            // Update Comment Area for this.currentInvoce Obj
            this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
            this.currentInvoice[0].comments.unshift({
                "created_by": createdBy,
                "creation_date": new Date(),
                "message": `Invoice #${this.currentInvoice[0].number}. Transfer for ${this.currency}${this.currentInvoice[0].amount[amountSettled]} was Settled!!`
            });
            this.tableCommentsRender(this.currentInvoice[0].comments);

            // Loading GIF OFF
            this.loadingGif.style.display = "none";

        } else {
            this.alertWindow(`Your current status ${this.currentInvoice[0].status} does't allow this!`);
        } 
    }    

    declinedInvoiceStatus = async (data) => {
        return  await fetch("http://18.216.223.81:3000/declinedStatus", {
                method: "POST",
                body: JSON.stringify(data),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    declinedStatus = async () => {
        if (this.currentInvoice[0].status === "Sent" || this.currentInvoice[0].status === "Requested") {
            // Loading GIF ON
            this.loadingGif.style.display = "flex";

            // Declined request
            var amountDeclined = `amount_${this.currentInvoice[0].status.toLowerCase()}`;
            var createdBy = this.currentUser.textContent.trim();

            var data = {
                "invNumber": this.currentInvoice[0].number,
                "oldInvStatus": this.currentInvoice[0].status,
                "amountDeclined": this.currentInvoice[0].amount[amountDeclined],
                "createdBy": createdBy,
                "currency" : this.currency
            };
            await this.declinedInvoiceStatus(data);

            // Change status, Declined date and Status for currentInvoice
            this.currentInvoice[0].status = "Declined";
            this.currentInvoice[0].dates.declined_date = new Date();

            // Change table info for current Invoice
            this.currentTr.children[8].innerHTML = `<strong>Declined</strong>`;
            this.currentTr.children[8].style.color = "red";
            document.querySelector(".currentStatus").innerHTML = "Declined";
            document.querySelector(".currentStatus").style.color = "red";

            // Update Comment Area for this.currentInvoce Obj
            this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
            this.currentInvoice[0].comments.unshift({
                "created_by": createdBy,
                "creation_date": new Date(),
                "message": `Invoice #${this.currentInvoice[0].number}. Transfer for ${this.currency}${amountDeclined} was Declined!`
            });
            this.tableCommentsRender(this.currentInvoice[0].comments);

            // Loading GIF OFF
            this.loadingGif.style.display = "none";

        } else {
            this.alertWindow(`Your current status ${this.currentInvoice[0].status} does't allow this!`);
        }
    }

    availableInvoiceStatus = async (invNumber, amountAvailable, createBy, currency) => {
        return  await fetch("http://18.216.223.81:3000/availableStatus", {
                method: "POST",
                body: JSON.stringify({
                    invNumber,
                    amountAvailable,
                    createBy,
                    currency
                }),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    availableStatus = async () => {
        // Check if status Approved
        if (this.currentInvoice[0].status === "Approved"){
            var creator = this.currentUser.textContent.trim();

            // Loading GIF ON
            this.loadingGif.style.display = "flex";

            // Change status, Available date, amount Available for currentInvoice
            this.currentInvoice[0].status = "Available";
            this.currentInvoice[0].dates.available_date = new Date();
            this.currentInvoice[0].amount.amount_available = this.currentInvoice[0].amount.amount_approved;

            // Change table info for current Invoice
            this.currentTr.children[8].innerHTML = `<strong>Available</strong>`;
            this.currentTr.children[8].style.color = "rgb(24, 209, 24)";
            this.currentTr.children[7].children[0].innerHTML = `${this.currency}${this.currentInvoice[0].amount.amount_available}`;
            this.currentTr.children[7].children[1].innerHTML = `${this.checkDate(new Date())}`;
            document.querySelector(".currentStatus").innerHTML = "Available";
            document.querySelector(".currentStatus").style.color = "rgb(24, 209, 24)";

            // Request
            await this.availableInvoiceStatus(this.currentInvoice[0].number, this.currentInvoice[0].amount.amount_approved, creator, this.currency);

            // Update Comment Area for this.currentInvoce Obj
            this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
            this.currentInvoice[0].comments.unshift({
                "created_by": creator,
                "creation_date": new Date(),
                "message": `Invoice #${this.currentInvoice[0].number}. Transfer for ${this.currency}${this.currentInvoice[0].amount.amount_approved} was Available!`
            });
            this.tableCommentsRender(this.currentInvoice[0].comments);

            // Loading GIF OFF
            this.loadingGif.style.display = "none";

        } else {
            this.alertWindow(`Your current status ${this.currentInvoice[0].status} does't allow this!`);
        }
    }

    approvedInvoiceStatus = async (data) => {
        return  await fetch("http://18.216.223.81:3000/approvedStatus", {
                method: "POST",
                body: JSON.stringify(data),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    approvedStatusInit = async () => {
        if (this.currentInvoice[0].status === "Received") {
            //////  AnyWires Commissions  //////
            var amountReceive = this.currentInvoice[0].amount.amount_received;
            var anyFeePercent = this.currentMerhcant[0].fees.in_c2b.percent;
            var anyFeeFlat = this.currentMerhcant[0].fees.in_c2b.flat;
            var AdditionaFee = Math.round(document.querySelector("#inputAdditionalFee").value);

            if (this.currentInvoice[0].type === "b2b") {
                anyFeePercent = this.currentMerhcant[0].fees.in_b2b.percent;
                anyFeeFlat = this.currentMerhcant[0].fees.in_b2b.flat;
            }
            var anywiresPercent = anyFeePercent;

            // Check if this $
            var currencyInv = "";
            if (this.currentInvoice[0].currency === "USD") {
                var currencyInv = await this.getEURexchange("EUR", "USD");
                anyFeeFlat = Math.round(anyFeeFlat * currencyInv.rates.USD);
            }

            anyFeePercent = (amountReceive/100)*anyFeePercent;
            AdditionaFee < 0 ? AdditionaFee = 0 : "";
            var amountApproved = Math.round(amountReceive - anyFeePercent - anyFeeFlat - AdditionaFee);
            var createBy = this.currentUser.textContent.trim();
            var totalAny = Math.round(anyFeePercent + anyFeeFlat + AdditionaFee);


            ////////  Solution Commission  //////
            var bankCommission = Math.round(document.querySelector("#bankCommission").value);
            bankCommission < 0 ? bankCommission = 0 : "";
            var solutionPercent = +(document.querySelector("#solutionCommPercent").value);
            solutionPercent < 0 ? solutionPercent = 0 : "";
            var solutionFlat = Math.round(document.querySelector("#solutionCommFlat").value);
            solutionFlat < 0 ? solutionFlat = 0 : "";

            var totalSolution = Math.round(+bankCommission + ((amountReceive/100) * solutionPercent) + solutionFlat);
            var leftFromTransfer = Math.round(amountReceive - totalSolution);
             
            // Request to Server for changes
            var data = {
                // ANYWIRES_FEES
                "invNumber": this.currentInvoice[0].number,
                "createBy": createBy,
                "currency": this.currency,
                "amountApproved": amountApproved,
                "AdditionaFee": AdditionaFee,
                "totalAny": totalAny,
                "anywiresPercent": anywiresPercent,
                "anyFeeFlat": anyFeeFlat,
                // SOLUTION_FEES
                "bankCommission": +bankCommission,
                "solutionPercent": solutionPercent,
                "solutionFlat": solutionFlat,
                "totalSolution": +totalSolution,
                "leftFromTransfer": leftFromTransfer
            };
            // Loading GIF appear
            this.loadingGif.style.display = "flex";

            await this.approvedInvoiceStatus(data);

            // Change Table info for current Invoice
            document.querySelector(".currentStatus").innerHTML = "Approved";
            document.querySelector(".currentStatus").style.color = "#0B9E8D";
            this.currentTr.children[8].innerHTML = `<strong>Approved</strong>`;
            this.currentTr.children[8].style.color = "#0B9E8D";

            // Change this.currentInvoce Obj
            this.currentInvoice[0].status = "Approved";
            this.currentInvoice[0].dates.approved_date = new Date();
            this.currentInvoice[0].amount.amount_approved = +amountApproved;

            // Update Comment Area for this.currentInvoce Obj
            this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
            this.currentInvoice[0].comments.unshift({
                "created_by": createBy,
                "creation_date": new Date(),
                "message": `Invoice #${this.currentInvoice[0].number}. Transfer for ${this.currency}${amountApproved} was Approved!`
            });
            this.tableCommentsRender(this.currentInvoice[0].comments);

            // Loading GIF off
            this.filterApproved.style.display = "none";
            this.loadingGif.style.display = "none";

        } else {
            this.alertWindow("You can't do that!");
        }
    }

    checkDocsApproved = (arr) => {
        var res = false;
        if (arr.length) {
            arr.forEach((item) => {
                if (item.status === "Approved"){
                    return res = true;
                }
            });
        }
        return res;
    }

    approvedStatus = async () => {
        var ID = this.checkDocsApproved(this.currentInvoice[0].documents.id);
        var PaymantProof = this.checkDocsApproved(this.currentInvoice[0].documents.payment_proof);
        var UtilityBill = this.checkDocsApproved(this.currentInvoice[0].documents.utility_bill);
        var Declaration = this.checkDocsApproved(this.currentInvoice[0].documents.declaration);
        
        if (this.currentInvoice[0].status === "Received" && ID && PaymantProof && UtilityBill && Declaration) {
            // Event for Button Submit
            this.approvedBtnSubmit = document.querySelector("#approved_button");
            this.approvedBtnSubmit.addEventListener("click", this.approvedStatusInit);

            // Loading GIF appear
            this.loadingGif.style.display = "flex";

            // Filter for background
            this.filterApproved.style.display = "flex";
            this.filterApproved.addEventListener("click", (event) => {
                event.target === this.filterApproved ? this.filterApproved.style.display = "none" : "";
            });

            // Get Current Merchant
            this.currentMerhcant = await this.getCurrentMerchant(0, {"name": this.currentInvoice[0].merchant});
            // Get Current Bank
            this.currentBank = await this.getCurrentBank(0, {"name": this.currentInvoice[0].bank});

            // Check type of Invoice c2b or b2b
            var anyFeePercent = this.currentMerhcant[0].fees.in_c2b.percent;
            var anyFeeFlat = this.currentMerhcant[0].fees.in_c2b.flat;
            var solutionCommPercent = this.currentBank[0].solution_fees.in_c2b.percent;
            var solutionCommFlat = this.currentBank[0].solution_fees.in_c2b.flat;
            if (this.currentInvoice[0].type === "b2b") {
                anyFeePercent = this.currentMerhcant[0].fees.in_b2b.percent;
                anyFeeFlat = this.currentMerhcant[0].fees.in_b2b.flat;
                solutionCommPercent = this.currentBank[0].solution_fees.in_b2b.percent;
                solutionCommFlat = this.currentBank[0].solution_fees.in_b2b.flat;
            }

            // Check if this $
            if (this.currentInvoice[0].currency === "USD") {
                var currencyInv = await this.getEURexchange("EUR", "USD");
                anyFeeFlat = Math.round(anyFeeFlat * currencyInv.rates.USD);
                solutionCommFlat = Math.round((solutionCommFlat * currencyInv.rates.USD));
            }

            // Counting process
            var amountReceived = this.currentInvoice[0].amount.amount_received;
            var currency = "";
            this.currentInvoice[0].currency === "USD" ? currency = "$" : currency = "€";
            var anyFeePercentRes = Math.round((amountReceived/100)*anyFeePercent);
            var totalAny = Math.round(anyFeePercentRes + anyFeeFlat);

            // Render PopUp Window
            document.querySelector("#approved_receivedAmount").innerHTML = `${amountReceived}${currency}`;
            document.querySelector("#anyFeePercent").innerHTML = `${anyFeePercent}`;
            document.querySelector("#anyFeeSymbol").innerHTML = `${currency}`;
            document.querySelector("#approved_anyFeePercent").innerHTML = `${anyFeePercentRes}${currency}`;
            document.querySelector("#approved_anyFeeFlat").innerHTML = `${anyFeeFlat}${currency}`;
            document.querySelector("#approved_total_comm").innerHTML = `${totalAny}${currency}`;
            document.querySelector("#approved_amount").innerHTML = `${amountReceived-totalAny}${currency}`;
            document.querySelector("#inputAdditionalFee").value = "";

            // Event for input Additiona fee
            document.querySelector("#inputAdditionalFee").addEventListener("keyup", () => {
                var addFeeInputValue = Math.round(document.querySelector("#inputAdditionalFee").value);
                totalAny = Math.round(anyFeePercentRes + anyFeeFlat + addFeeInputValue);

                document.querySelector("#aprroved_additionalFee").innerHTML = `${addFeeInputValue}${currency}`;
                document.querySelector("#approved_total_comm").innerHTML = `${totalAny}${currency}`;
                document.querySelector("#approved_amount").innerHTML = `${Math.round(amountReceived-totalAny)}${currency}`;
            });

            // Solution Commission Counting
            var solutionCountPercent = (amountReceived/100) * solutionCommPercent;
            var totalSolution = Math.round(solutionCommFlat + solutionCountPercent)
            document.querySelector("#solutionCommPercent").value = solutionCommPercent;
            document.querySelector("#solutionCommFlat").value = solutionCommFlat;
            document.querySelector("#totalSolution").innerHTML = `${totalSolution}${currency}`;
            document.querySelector("#leftFromTransfer").innerHTML = `${amountReceived - totalSolution}${currency}`;

            document.querySelectorAll(".solutionInputs").forEach((inpt) => inpt.addEventListener("keyup", () => {
                var bankComm = +(document.querySelector("#bankCommission").value);
                var solComPerInpt = +(document.querySelector("#solutionCommPercent").value);
                var solComPerInptRes = (amountReceived/100) * solComPerInpt;
                var solComFlat = +(document.querySelector("#solutionCommFlat").value);
                var totalSolComm = Math.round(bankComm + solComPerInptRes + solComFlat);
                var leftFromTransferComm = Math.round(amountReceived - totalSolComm);
                document.querySelector("#totalSolution").innerHTML = `${totalSolComm}${currency}`;
                document.querySelector("#leftFromTransfer").innerHTML = `${leftFromTransferComm}${currency}`;
            }));

            // Loading GIF appear
            this.loadingGif.style.display = "none";

            // If not all documents Approved than Alert 
        } else if (this.currentInvoice[0].status === "Received" && !ID ||
                this.currentInvoice[0].status === "Received" && !PaymantProof ||
                this.currentInvoice[0].status === "Received" && !UtilityBill ||
                this.currentInvoice[0].status === "Received" &&  !Declaration) {
            this.alertWindow("First you must download all the documents!");

        } else  {
            this.alertWindow(`Your current status ${this.currentInvoice[0].status} does't allow this!`);
        }      
    }

    getEURexchange = async (base, symbols) => {
        return  await fetch(`https://api.exchangeratesapi.io/latest?base=${base}&symbols=${symbols}`)
         .then(res => {
             return res.json();
         }) 
         .catch(err => {
             console.log(err);
         });
    }

    receivedInvoiceStatus = async (invNumber, typedAmount, amountCommission, percentCommission, createdBy, currency) => {
        return  await fetch("http://18.216.223.81:3000/receivedStatus", {
                method: "POST",
                body: JSON.stringify({
                    invNumber,
                    typedAmount,
                    amountCommission,
                    percentCommission,
                    createdBy,
                    currency
                }),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    receiveStatus = async () => {
        if (this.currentInvoice[0].status === "Sent") {

            // Loading GIF appear
            this.loadingGif.style.display = "flex";

            var typedAmount = document.querySelector("#receive_input").value;
            var amountSent = this.currentInvoice[0].amount.amount_sent;
            var creator = this.currentUser.textContent.trim();

            // Counting proccess for Commission
            var amountCommission = 0;
            var percentCommission = 0;
            if (+typedAmount !== amountSent) {
                amountCommission = amountSent - typedAmount;
                percentCommission = (100*amountCommission)/amountSent;
            }

            // Request for status "Received" 
            await this.receivedInvoiceStatus(this.currentInvoice[0].number, typedAmount, amountCommission, percentCommission, creator, this.currentInvoice[0].currency);

            // Change status, received date, amount received for currentInvoice and create new field received_after_commision
            this.currentInvoice[0].status = "Received";
            this.currentInvoice[0].dates.received_date = new Date();
            this.currentInvoice[0].amount.amount_received = +(typedAmount);

            // Change table information
            this.currentTr.children[8].innerHTML = `<strong>Received</strong>`;
            this.currentTr.children[8].style.color = "rgb(49, 117, 218)";
            this.currentTr.children[5].children[0].children[0].textContent = `${this.currency}${typedAmount}`;
            this.currentTr.children[5].children[0].children[1].textContent = `${this.checkDate(new Date())}`;

            // Change style for popUp
            document.querySelector(".currentStatus").textContent = "Received";
            document.querySelector(".currentStatus").style.color = "rgb(49, 117, 218)";

            // Update Comment Area for this.currentInvoce Obj
            this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
            this.currentInvoice[0].comments.unshift({
                "created_by": creator,
                "creation_date": new Date(),
                "message": `Invoice #${this.currentInvoice[0].number}. Transfer for ${this.currency}${+typedAmount} was Received!`
            });
            this.tableCommentsRender(this.currentInvoice[0].comments);

            // Hide PopUp
            this.filterReceive.style.display = "none";

            // Loading GIF OFF
            this.loadingGif.style.display = "none";

        } else {
            this.alertWindow(`Your current status ${this.currentInvoice[0].status} does't allow this!`);
        }
    }

    initialReceivedStatus = async () => {
        if (this.currentInvoice[0].status === "Sent") {

            // Filter for background
            this.filterReceive.style.display = "flex";
            this.filterReceive.addEventListener("click", (event) => {
                event.target === this.filterReceive ? this.filterReceive.style.display = "none" : "";
            });

            // Counting proccess
            var amountSent = this.currentInvoice[0].amount.amount_sent;

            // PopUp render Info
            document.querySelector(".receive_InvoiceNumber").innerHTML = `invoice #${this.currentInvoice[0].number}`;
            document.querySelector(".receive_SentAmount").innerHTML = `${amountSent}${this.currency}`
            document.querySelector("#receive_input").value = `${amountSent}`;

            // Event For button Submit
            this.receivedBtnSubmit = document.querySelector("#receive_Submit");
            this.receivedBtnSubmit.addEventListener("click", this.receiveStatus);
        } else {
            this.alertWindow(`Your current status ${this.currentInvoice[0].status} does't allow this!`);
        }
    }

    sentInvoiceStatus = async (invNumber, amountSent, currency, creator) => {
        return  await fetch("http://18.216.223.81:3000/sentStatus", {
                method: "POST",
                body: JSON.stringify({
                    invNumber,
                    amountSent,
                    currency,
                    creator
                }),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    initialSentStatus = async () => {
        // Checking role of Current User
        var role = this.currentUserRole.textContent.trim();
        var accessRole = ["Crm FinanceManager", "Crm InvoiceManager", "Crm SuccessManager", "Crm Admin"];
        var result = accessRole.some((item) => item === role);
        
        // If Current User has access
        if (result && this.currentInvoice[0].status === "Requested") {
            // Loading GIF On
            this.loadingGif.style.display = "flex";

            // Loading GIF Off
            this.loadingGif.style.display = "none";

            // Open Modal Sent
            this.sentFilter.style.display = "flex";
            this.sentFilter.style.display = "flex";
            this.sentFilter.addEventListener("click", (event) => {
                event.target === this.sentFilter ? this.sentFilter.style.display = "none" : "";
            });

            // Render PopUp info
            document.querySelector("#sent_input").value = this.currentInvoice[0].amount.amount_requested;

            // Event For button Submit Sent
            this.sentSubmitBtn = document.querySelector("#sent_submitBtn");
            this.sentSubmitBtn.addEventListener("click", this.sentStatus);

        } else {
            this.alertWindow(`Your current status ${this.currentInvoice[0].status} does't allow this!`);
        }
    }

    sentStatus = async () => {
        var sent = document.querySelector("#sent_input").value;
        var creator = this.currentUser.textContent.trim();

        // Loading GIF appear
        this.loadingGif.style.display = "flex";

        // Request for status "Sent" 
        await this.sentInvoiceStatus(this.currentInvoice[0].number, +sent, this.currency, creator);

        // Change status, sent date, amount sent for currentInvoice
        this.currentInvoice[0].status = "Sent";
        this.currentInvoice[0].dates.sent_date = new Date();
        this.currentInvoice[0].amount.amount_sent = +sent;

        // Change table information
        this.currentTr.children[8].innerHTML = `<strong>Sent</strong>`;
        this.currentTr.children[8].style.color = "rgb(255, 187, 51)";
        this.currentTr.children[3].children[0].children[0].textContent = `${this.currency}${+sent}`;
        this.currentTr.children[3].children[0].children[1].innerHTML = `${this.checkDate(new Date())}`;

        // Change style for popUp
        document.querySelector(".currentStatus").textContent = "Sent";
        document.querySelector(".currentStatus").style.color = "rgb(255, 187, 51)";

         // Update Comment Area for this.currentInvoce Obj
         this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
         this.currentInvoice[0].comments.unshift({
             "created_by": creator,
             "creation_date": new Date(),
             "message": `Invoice #${this.currentInvoice[0].number}. Transfer for ${this.currency}${+sent} was Sent!`
         });
         this.tableCommentsRender(this.currentInvoice[0].comments);

        // Loading GIF OFF
        this.loadingGif.style.display = "none";
        

        // Hide Modal Window
        this.sentFilter.style.display = "none";
    }

    requestedInvoiceStatus = async (invoiceNum, sentAmount, currency, amountRequested, creator) => {
        return  await fetch("http://18.216.223.81:3000/requestStatus", {
                method: "POST",
                body: JSON.stringify({
                    invoiceNum,
                    sentAmount,
                    currency,
                    amountRequested,
                    creator
                }),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    requestedStatus = async () => {

        // Get current Invoice
        var role = this.currentUserRole.textContent.trim();
        var creator = this.currentUser.textContent.trim();

        // If user CRM admin and Status is Sent
        if (this.currentInvoice[0].status === "Sent" && role === "CrmAdmin") { 
            // Loading GIF appear
            this.loadingGif.style.display = "flex";

            // Request for status "Requested"
            await this.requestedInvoiceStatus(this.currentInvoice[0].number, this.currentInvoice[0].amount.amount_sent, this.currency, this.currentInvoice[0].amount.amount_requested, creator);

            // Change status, sent date, amount sent for currentInvoice
            this.currentInvoice[0].status = "Requested";
            this.currentInvoice[0].dates.sent_date = "";
            this.currentInvoice[0].amount.amount_sent = 0;

            // Change style for popUp
            document.querySelector(".currentStatus").textContent = "Requested";
            document.querySelector(".currentStatus").style.color = "black";

            // Change table info
            this.currentTr.children[8].innerHTML = `<strong>Requested</strong>`;
            this.currentTr.children[8].style.color = "rgb(104, 103, 103)";
            this.currentTr.children[3].children[0].children[0].textContent = `${this.currency}0`;
            this.currentTr.children[3].children[0].children[1].innerHTML = `mm/dd/yyyy`;
            
            // Update Comment Area for this.currentInvoce Obj
            this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
            this.currentInvoice[0].comments.unshift({
                "created_by": creator,
                "creation_date": new Date(),
                "message": `Invoice #${this.currentInvoice[0].number}. Transfer for ${this.currency}${this.currentInvoice[0].amount.amount_requested} was Requested!`
            });
            this.tableCommentsRender(this.currentInvoice[0].comments);

            // Loading GIF OFF
            this.loadingGif.style.display = "none";

        } else {
            this.alertWindow(`Your current status ${this.currentInvoice[0].status} does't allow this!`);
        }
    }

    changeDocsStatus = async (filename, status, number, type, createdBy) => {
        return  await fetch("http://18.216.223.81:3000/changeDocStatus", {
                method: "POST",
                body: JSON.stringify({
                    filename,
                    status, 
                    number, 
                    type,
                    createdBy
                }),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    docsBad = async () => {
        // Loading GIF appear
        this.loadingGif.style.display = "flex";

        var filename = event.target.closest("tr").children[4].textContent.trim();
        var status = "Declined";
        var type = event.target.closest("tr").children[1].textContent.trim();
        var statusTd = event.target.closest("tr").children[2].innerHTML = status;
        var createdBy = this.currentUser.textContent.trim();
        var docId = event.target.closest("tr").children[5].textContent.trim();

        // Request in MongoDB
        await this.changeDocsStatus(filename, status, this.currentInvoice[0].number, type, createdBy);

        // Update Comment Area for this.currentInvoce Obj
        this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
        this.currentInvoice[0].comments.unshift({
            "created_by": createdBy,
            "creation_date": new Date(),
            "message": `Invoice #${this.currentInvoice[0].number}. ${type} was ${status}!`
        });
        this.tableCommentsRender(this.currentInvoice[0].comments);

        // Change doc status for current Invoice
        type === "Payment proof" ? type = "payment_proof" : "";
        type === "Utility Bill" ? type = "utility_bill" : "";
        var currentObjType = this.currentInvoice[0].documents[type.toLowerCase()];
        currentObjType.forEach((doc) =>{
            doc.id === docId ? doc.status = "Declined" : "";
        });

        // Loading GIF appear
        this.loadingGif.style.display = "none";
    }

    docsGood = async () => {
        // Loading GIF appear
        this.loadingGif.style.display = "flex";

        var filename = event.target.closest("tr").children[4].textContent.trim();
        var status = "Approved";
        var type = event.target.closest("tr").children[1].textContent.trim();
        var statusTd = event.target.closest("tr").children[2].innerHTML = status;
        var createdBy = this.currentUser.textContent.trim();
        var docId = event.target.closest("tr").children[5].textContent.trim();
        
        // Request in MongoDB
        await this.changeDocsStatus(filename, status, this.currentInvoice[0].number, type, createdBy);

        // Update Comment Area for this.currentInvoce Obj
        this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
        this.currentInvoice[0].comments.unshift({
            "created_by": createdBy,
            "creation_date": new Date(),
            "message": `Invoice #${this.currentInvoice[0].number}. ${type} was ${status}!`
        });

        // Change doc status for current Invoice
        type === "Payment proof" ? type = "payment_proof" : "";
        type === "Utility Bill" ? type = "utility_bill" : "";
        var currentObjType = this.currentInvoice[0].documents[type.toLowerCase()];
        currentObjType.forEach((doc) =>{
            doc.id === docId ? doc.status = "Approved" : "";
        });
        this.tableCommentsRender(this.currentInvoice[0].comments);

        // Loading GIF appear
        this.loadingGif.style.display = "none";
    }

    openDocsImage = (event) => {
        var filename = event.target.closest("tr").children[4].textContent.trim();
        window.open(`http://18.216.223.81:3000/upload/${filename}`, '_blank');
    }

    changeFileClickTo = () => {
        this.fileName = document.querySelector(".fileName");
        this.fileWrapper = document.querySelector(".fileWrapper");

        var fileName = this.clickToDownload.files[0];
        this.fileName.innerHTML = fileName.name

        // Add border
        this.fileWrapper.style.backgroundColor = "rgba(18,199,178,1)";
        this.fileWrapper.style.color = "white";
        this.fileWrapper.style.fontWeight = "bold";
        this.fileWrapper.style.border = "none";
    }

    initialUpload = async (event) => {

        event.preventDefault();

        var type = document.querySelector("#docsSelect").value.trim();
        var number = this.currentInvoice[0].number;
        var file = document.querySelector("#uploadDocs").files[0];
        var creator = this.currentUser.textContent.trim();
        var emptyFile = this.checkIsEmptyObj(file);
        
        // If File exist and Type too than send req
        if(!emptyFile && type){
            // Loading GIF appear
            this.loadingGif.style.display = "flex";

            var fd = new FormData();
            fd.append("file", file);
            fd.append("number", number);
            fd.append("type", type);
            fd.append("creator", creator);
            await this.postFile(fd);
     
             // Update Modal Window View
             this.currentInvoice = await this.getInvoices(0, {"number": this.currentInvoice[0].number} ); 

             // Check and render docs
            document.querySelector("#table-docs").innerHTML = "";
            this.tableDocsRender(this.currentInvoice[0].documents.id);
            this.tableDocsRender(this.currentInvoice[0].documents.payment_proof);
            this.tableDocsRender(this.currentInvoice[0].documents.utility_bill);
            this.tableDocsRender(this.currentInvoice[0].documents.declaration);

            // Update Comment Area for this.currentInvoce Obj
            this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
            this.tableCommentsRender(this.currentInvoice[0].comments.reverse());

            //  Cleanning Click to Upload Input
             document.querySelector("#uploadDocs").value = "";
             document.querySelector("#docsSelect").value = "";
             document.querySelector(".fileName").innerHTML = "Click to upload Document";

            //  Restore style for File Wrapper
             this.fileWrapper.style.backgroundColor = "white";
             this.fileWrapper.style.color = "black";
             this.fileWrapper.style.border = "1px solid rgb(159, 159, 159)";
             this.fileWrapper.style.fontWeight = "normal";

             // Loading GIF appear
            this.loadingGif.style.display = "none";
        } else {
            this.alertWindow("Please select the file first!");
        }
    }

    postFile = async (fd) => {
        return  await fetch("http://18.216.223.81:3000/upload", {
                method: "POST",
                body: fd,
                mode: "no-cors",
                headers:{'Accept': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    checkChangesOfEditedInvoice = (current, newData, name, currency) => {
        var comment = ``;
        current = current.toString().trim();
        newData = newData.toString().trim();
        if (current !== newData && name !== "amount requested" && name !== "amount sent") {
            comment = `${comment} ${name} changed from ${current} to ${newData};`;

        } else if(current !== newData && name === "amount requested" || current !== newData && name === "amount sent"){
            comment = `${comment} ${name} changed from ${currency}${current} to ${currency}${newData};`;
        }
        return comment;
    }

    saveEditedInvoice = async () => {
        // Loading GIF appear
        this.loadingGif.style.display = "flex";

        var sepa = false;
        this.editData[6].checked ? sepa = true : sepa = false;

        var newInvoice = {
            "amount.amount_requested": +(this.editData[0].value),
            "amount.amount_sent": +(this.editData[1].value),
            "type": this.editData[2].value,
            "currency": this.editData[3].value,
            "bank": this.editData[4].value,
            "merchant": this.editData[5].value,
            "sepa": sepa,
            "client_details.full_name": this.editData[7].value,
            "client_details.email": this.editData[8].value,
            "client_details.phone": this.editData[9].value,
            "client_details.country": this.editData[10].value,
            "client_details.address": this.editData[11].value,
            "client_details.id_number": this.editData[12].value
        };

        // Add comment about action - "save changes to Invoice".
        var comment = ``;
        var reqNew = this.checkChangesOfEditedInvoice(this.currentInvoice[0].amount.amount_requested, this.editData[0].value, "amount requested", this.currency);
        var sentNew = this.checkChangesOfEditedInvoice(this.currentInvoice[0].amount.amount_sent, this.editData[1].value, "amount sent", this.currency);
        var typeNew = this.checkChangesOfEditedInvoice(this.currentInvoice[0].type, this.editData[2].value, "type");
        var currNew = this.checkChangesOfEditedInvoice(this.currentInvoice[0].currency, this.editData[3].value, "currency");
        var bankNew = this.checkChangesOfEditedInvoice(this.currentInvoice[0].bank, this.editData[4].value, "bank");
        var merchNew = this.checkChangesOfEditedInvoice(this.currentInvoice[0].merchant, this.editData[5].value, "merchant");
        var nameNew = this.checkChangesOfEditedInvoice(this.currentInvoice[0].client_details.full_name, this.editData[7].value, "client's name");
        var emailNew = this.checkChangesOfEditedInvoice(this.currentInvoice[0].client_details.email, this.editData[8].value, "client's email");
        var phNew = this.checkChangesOfEditedInvoice(this.currentInvoice[0].client_details.phone, this.editData[9].value, "client's phone");
        var countryNew = this.checkChangesOfEditedInvoice(this.currentInvoice[0].client_details.country, this.editData[10].value, "client's country");
        var addrNew = this.checkChangesOfEditedInvoice(this.currentInvoice[0].client_details.address, this.editData[11].value, "client's address");
        var idNew = this.checkChangesOfEditedInvoice(this.currentInvoice[0].client_details.id_number, this.editData[12].value, "client's id number");

        comment = reqNew + sentNew + typeNew + currNew + bankNew + merchNew + nameNew + emailNew + phNew + countryNew + addrNew + idNew;


        // If something was changed then ->
        if (comment){
            var createdBy = this.currentUser.textContent.trim();
            var currecyChanged = this.currentInvoice[0].currency !== this.editData[3].value;
            var chnagedAmountReq = this.currentInvoice[0].amount.amount_requested !== +this.editData[0].value;
            var amountReqOld = this.currentInvoice[0].amount.amount_requested;
            var chnagedAmountSent = this.currentInvoice[0].amount.amount_sent !== +this.editData[1].value;
            var amountSentOld = this.currentInvoice[0].amount.amount_sent;
            var changedBank = this.currentInvoice[0].bank !== this.editData[4].value;
            var oldBank = this.currentInvoice[0].bank;

            await this.postEditedInvoice(this.currentInvoice[0].number, newInvoice, comment, createdBy, currecyChanged, chnagedAmountReq, amountReqOld, chnagedAmountSent, amountSentOld, changedBank, oldBank);
            // Update Modal Window View
            this.currentInvoice = await this.getInvoices(0, {"number": this.currentInvoice[0].number} ); 
            this.renderViewInvoice(this.currentInvoice);
        } 

        // Cleanning edit Modal Window Edit
        this.editData.forEach((item) => item.value = "");
        this.editData[6].removeAttribute("checked", "checked");
        this.filterEdit.style.display = "none";

        // Loading GIF appear
        this.loadingGif.style.display = "none";
    }

    postEditedInvoice = async (number, newInvoice, comment, createdBy, currecyChanged, chnagedAmountReq, amountReqOld, chnagedAmountSent, amountSentOld, changedBank, oldBank) => {
    return  await fetch("http://18.216.223.81:3000/postEditedInvoice", {
            method: "POST",
            body: JSON.stringify({
                number,
                newInvoice,
                comment,
                createdBy,
                currecyChanged,
                chnagedAmountReq,
                amountReqOld,
                chnagedAmountSent,
                amountSentOld,
                changedBank,
                oldBank
            }),
            headers:{'Content-Type': 'application/json'}
        })
        .then(res => {
            return res.text();
        }) 
        .catch(err => {
            console.log(err);
        });
    }

    renderOptionFromArray = (obj, value, select, current) => {
        obj.forEach((item) => {
            if (current !== item[value]) {
                this.renderOption(select, item[value]);
            }
        });
    }

    renderAndSelectOption = (select, value) => {
        var option = document.createElement("option");
        option.setAttribute("selected", "selected");
        option.value = value;
        option.innerHTML = value;
        select.appendChild(option);
    }

    editInvoice = () => {
        // Event for button Save
        this.saveEditedInvoice_btn = document.querySelector("#saveEditedInvoice-btn");
        this.saveEditedInvoice_btn.addEventListener("click", this.saveEditedInvoice);

        this.invoceNumber = document.querySelector(".invoceNumber").innerHTML = this.currentInvoice[0].number;
        // If click on filter - close
        this.filterEdit = document.querySelector(".filterEditIvoice");
        this.filterEdit.style.display = "flex";
        this.filterEdit.addEventListener("click", (event) => {
            event.target === this.filterEdit ? this.filterEdit.style.display = "none" : "";
        });

        // Rendering Current Data Objecs
        this.editData[0].value = this.currentInvoice[0].amount.amount_requested;
        this.editData[1].value = this.currentInvoice[0].amount.amount_sent;
        this.editData[2].value = this.currentInvoice[0].type;
        this.editData[7].value = this.currentInvoice[0].client_details.full_name;
        this.editData[8].value = this.currentInvoice[0].client_details.email;
        this.editData[9].value = this.currentInvoice[0].client_details.phone;
        this.editData[10].value = this.currentInvoice[0].client_details.country;
        this.editData[11].value = this.currentInvoice[0].client_details.address;
        this.editData[12].value = this.currentInvoice[0].client_details.id_number;

        // Check currency
        this.editData[3].innerHTML = "";
        if(this.currentInvoice[0].currency === "EUR"){
            this.renderAndSelectOption(this.editData[3], this.currentInvoice[0].currency);
            this.renderOption(this.editData[3], "USD");
        } else {
            this.renderAndSelectOption(this.editData[3], this.currentInvoice[0].currency);
            this.renderOption(this.editData[3], "EUR");
        }

        // Render Merchant and Banks in select
        this.editData[4].innerHTML = "";
        this.renderAndSelectOption(this.editData[4], this.currentInvoice[0].bank);
        this.renderOptionFromArray(this.ArrayBanks, "name", this.editData[4], this.currentInvoice[0].bank);

        this.editData[5].innerHTML = "";
        this.renderAndSelectOption(this.editData[5], this.currentInvoice[0].merchant);
        this.renderOptionFromArray(this.ArrayMerchants, "name", this.editData[5], this.currentInvoice[0].merchant);

        // Check Sepa
        if(this.currentInvoice[0].sepa){
            this.editData[6].setAttribute("checked", "checked");
        } else {
            this.editData[6].removeAttribute("checked", "checked");
        }

        // Checking Invoice Status 
        if (this.currentInvoice[0].status !== "Sent" && this.currentInvoice[0].status !== "Requested") {
            this.editData[0].setAttribute("disabled", "disabled");
            this.editData[1].setAttribute("disabled", "disabled");
            this.editData[2].setAttribute("disabled", "disabled");
            this.editData[3].setAttribute("disabled", "disabled");
            this.editData[4].setAttribute("disabled", "disabled");
            this.editData[5].setAttribute("disabled", "disabled");
            this.editData[6].setAttribute("disabled", "disabled");

        } else if (this.currentInvoice[0].status === "Sent") {
            this.editData[0].setAttribute("disabled", "disabled");
            this.editData[1].removeAttribute("disabled", "disabled");
            this.editData[2].removeAttribute("disabled", "disabled");
            this.editData[3].removeAttribute("disabled", "disabled");
            this.editData[4].removeAttribute("disabled", "disabled");
            this.editData[5].removeAttribute("disabled", "disabled");
            this.editData[6].removeAttribute("disabled", "disabled");

        } else if (this.currentInvoice[0].status === "Requested") {
            this.editData[1].setAttribute("disabled", "disabled");
            this.editData[0].removeAttribute("disabled", "disabled");
            this.editData[2].removeAttribute("disabled", "disabled");
            this.editData[3].removeAttribute("disabled", "disabled");
            this.editData[4].removeAttribute("disabled", "disabled");
            this.editData[5].removeAttribute("disabled", "disabled");
            this.editData[6].removeAttribute("disabled", "disabled");
            
        } else {
            this.editData[0].removeAttribute("disabled", "disabled");
            this.editData[1].removeAttribute("disabled", "disabled");
            this.editData[2].removeAttribute("disabled", "disabled");
            this.editData[3].removeAttribute("disabled", "disabled");
            this.editData[4].removeAttribute("disabled", "disabled");
            this.editData[5].removeAttribute("disabled", "disabled");
            this.editData[6].removeAttribute("disabled", "disabled");
        }
        
    }

    renderViewInvoice = async (obj) => {
        // Events Listeners for PopUp View Invoice
        document.querySelector("#requested").addEventListener("click", this.requestedStatus);
        document.querySelector("#sent").addEventListener("click", this.initialSentStatus);
        document.querySelector("#received").addEventListener("click", this.initialReceivedStatus);
        document.querySelector("#approved").addEventListener("click", this.approvedStatus);
        document.querySelector("#available").addEventListener("click", this.availableStatus);
        document.querySelector("#editBtn").addEventListener("click", this.editInvoice);
        // document.querySelector("#settledBtn").addEventListener("click", this.settledStatus);
        document.querySelector("#declinedBtn").addEventListener("click", this.declinedStatus);
        document.querySelector("#uploadBtn").addEventListener("click", this.initialUpload);
        document.querySelector("#addCommentBtn").addEventListener("click", this.addCommentForBtn);
        document.querySelector("#uploadDocs").addEventListener("input", this.changeFileClickTo);
        document.querySelector("#recallBtn").addEventListener("click", this.reCallStatus);

        // If Frozen status need to change button
        if (this.currentInvoice[0].status === "Frozen") {
            document.getElementById('frozenWrapper').innerHTML = `<button id="unFrozenBtn">Unfrozen</button>`;
            document.querySelector("#unFrozenBtn").addEventListener("click", this.unfrozenStatus);
        } else {
            document.getElementById('frozenWrapper').innerHTML = `<button id="frozenBtn">Frozen</button>`;
            document.querySelector("#frozenBtn").addEventListener("click", this.frozenStatus);
        }

        this.filter = document.querySelector(".filter");
        this.filter.style.display = "flex";
        this.filter.addEventListener("click", (event) => {
            if(event.target === this.filter){
                // "On" overflow for BODY
                document.body.classList.remove("modal-open");
                // Hide Modal Window
                this.filter.style.display = "none";
            }
        });

        var statusColor = "";
        if(obj[0].status === "Sent") statusColor = "#FFBB33";
        if(obj[0].status === "Requested") statusColor = "black";
        if(obj[0].status === "Received") statusColor = "rgb(49, 117, 218)";
        if(obj[0].status === "Approved") statusColor = "rgb(5, 148, 131)";
        if(obj[0].status === "Available") statusColor = "#00C851";
        if(obj[0].status === "Declined") statusColor = "red";
        if(obj[0].status === "Settled") statusColor = "black";
        if(obj[0].status === "Frozen") statusColor = "rgb(101, 152, 228)";
        if(obj[0].status === "Recall") statusColor = "#560795";

        this.invoiceNumber = document.querySelector("#invoiceNumber").innerHTML = obj[0].number;
        this.currentStatus = document.querySelector(".currentStatus");
        this.currentStatus.innerHTML = obj[0].status;
        this.currentStatus.style.color = statusColor;

        this.invoiceMerchant = document.querySelector("#invoiceMerchant").innerHTML = obj[0].merchant;
        this.invoiceBank = document.querySelector("#invoiceBank").innerHTML = obj[0].bank;
        this.clientName = document.querySelector("#clientFullName").innerHTML = obj[0].client_details.full_name;

        document.querySelector("#requestFee").innerHTML = obj[0].amount.amount_requested;

        var currency = "";
        obj[0].currency === "EUR" ? currency = "€" : currency = "$";
        this.invoiceCurrency = document.querySelector("#invoiceCurrency").innerHTML = currency;

        // Cleaning docs table before new docs
        this.tableDocs = document.querySelector("#table-docs").innerHTML = "";
        this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";

        // Check and render docs
        this.tableDocsRender(obj[0].documents.id);
        this.tableDocsRender(obj[0].documents.payment_proof);
        this.tableDocsRender(obj[0].documents.utility_bill);
        this.tableDocsRender(obj[0].documents.declaration);

        // Render all Comments
        this.tableCommentsRender(obj[0].comments.reverse());

        // Off overflow for BODY
        document.body.classList.add("modal-open");
    }

    getCurrentMerchant = async (number, filter) => {
        return  await fetch("http://18.216.223.81:3000/getPart-Merchants", {
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

    getCurrentBank = async (number, filter) => {
        return  await fetch("http://18.216.223.81:3000/getPart-Banks", {
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

    postCommet = async (number, data, create_by) => {
        return  await fetch("http://18.216.223.81:3000/postComment", {
                method: "POST",
                body: JSON.stringify({
                    number,
                    data,
                    create_by
                }),
                headers:{'Content-Type': 'application/json'}
            })
            .then(res => {
                return res.text();
            }) 
            .catch(err => {
                console.log(err);
            });
    }

    addCommentForBtn = () => {
        // Remove spaces form data
        var data = document.querySelector("#commentText").value.trim();
        this.addComment(data);
    }

    addComment = async (data) => {
        data = `Invoice #${this.currentInvoice[0].number}. ${data}`;
        // If not empty than
        if (data) {
            // Get current User
            var created_by = this.currentUser.textContent.trim();
            // Post new comment
            await this.postCommet(this.currentInvoice[0].number, data, created_by);

            this.currentInvoice = await this.getInvoices(0, {"number": this.currentInvoice[0].number} ); 
            this.tableComments = document.querySelector("#tableTbody-comments").innerHTML = "";
            this.tableCommentsRender(this.currentInvoice[0].comments);
        }
        document.querySelector("#commentText").value = "";
    }

    tableCommentsRender = (arr) => {
        // Table wich we need to render
        this.tableComments = document.querySelector("#tableTbody-comments");
        // Check if empty
        var ifEmpty = this.checkIsEmptyObj(arr);
        if(!ifEmpty){
            arr.forEach((item) => {
                var tableTr = document.createElement("tr");
                tableTr.innerHTML = `
                    <td class="comCol1">
                        <div>
                            <div>${item.created_by}</div>
                            <div class="comentsDate">${moment(item.creation_date).format('lll')}</div>
                        </div>
                    </td>
                    <td class="comCol2">${item.message}</td>
                `;

                this.tableComments.appendChild(tableTr);
            });
        }
    }

    tableDocsRender = async (arr) => {
        // Table wich we need to render
        this.tableDocs = document.querySelector("#table-docs");
        // Check if empty
        var ifEmpty = this.checkIsEmptyObj(arr);
        // If not empty render arr
        
        if(!ifEmpty){
            arr.forEach( async (item) => {
                var docArr = await this.getDocs({}, item.id);
                docArr.forEach((doc) => {
                    var tableTr = document.createElement("tr");
                    tableTr.innerHTML = `
                        <td>${doc.creator}</td> 
                        <td>${doc.type}</td> 
                        <td>${doc.status}</td> 
                        <td>
                            <span id="docGood" onclick="userList.docsGood(event)"><i class="far fa-check-circle"></i></span>
                            <span id="docBad" onclick="userList.docsBad(event)"><i class="far fa-times-circle"></i></span>
                        </td>
                        <td class="hide">${doc.filename}</td>
                        <td class="hide">${doc._id}</td>
                        <td> <button class="docPreview" onclick="userList.openDocsImage(event)">Preview</button> </td> 
                    `; 
                    this.tableDocs.appendChild(tableTr);
                });
            });
        }
    }

    getDocs = async (filter, id) => {
         return  await fetch("http://18.216.223.81:3000/getDocs", {
                method: "POST",
                body: JSON.stringify({
                    filter,
                    id
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

    viewInvoice = async () => {
        this.tableTd = document.querySelectorAll(".view");
        this.tableTd.forEach((td) => {

            td.addEventListener("click", async () => {
                // Loading GIF appear and scroll off
                this.loadingGif.style.display = "flex";
                document.body.classList.add("modal-open");
                // Take current Tr for future changed
                this.currentTr = td.parentElement;
                // Remove all filters
                this.filter = {};
                // Get number of invoice
                this.number = td.parentElement.children[0].children[0].children[0].children[0].textContent.split("#")[1];
                // Get invoice
                this.currentInvoice = await this.getInvoices(0, {"number": this.number} ); 
                // Loading GIF hide
                this.loadingGif.style.display = "none";
                // Render popup window
                this.renderViewInvoice(this.currentInvoice);
                // Set currency of Current Invoice
                this.currentInvoice[0].currency === "USD" ? this.currency = "$" : this.currency = "€";
            });

        });
    }

    previewInvoice = (event) => {
        var number = event.target.closest("tr").children[0].children[0].children[0].children[0].textContent.split("#");
        window.open("http://18.216.223.81:3000/invoice-preview?&" + number[1], '_blank');
    }

    invoiceContract = (event) => {
        var number = event.target.closest("tr").children[0].children[0].children[0].children[0].textContent.split("#");
        window.open("http://18.216.223.81:3000/invoiceContract?&" + number[1], '_blank');
    }

    invoiceDecOfPay = (event) => {
        var number = event.target.closest("tr").children[0].children[0].children[0].children[0].textContent.split("#");
        window.open("http://18.216.223.81:3000/invoiceDecOfPay?&" + number[1], '_blank');
    }

    invoicePreviewBankVersion = (event) => {
        var number = event.target.closest("tr").children[0].children[0].children[0].children[0].textContent.split("#");
        window.open("http://18.216.223.81:3000/invoicePreviewBankVersion?&" + number[1], '_blank');
    }

    filtersData = () => {
        var merchList = [];
        var bankList = [];
        this.ArrayBanks.forEach((bank) => bankList.push(bank.name));
        this.ArrayMerchants.forEach((merchant) => merchList.push(merchant.name));
        
        for (let i = 0; i < bankList.length; i++) {
            this.renderOption(this.bankFilter, bankList[i]);
        }
        for (let m = 0; m < merchList.length; m++) {
            this.renderOption(this.merchFilter, merchList[m]);
        }
    }

    renderOption = (filter, name) => {
        this.option = document.createElement("option");
        this.option.value = name;
        this.option.textContent = name;
        filter.appendChild(this.option);
    }

    searchFunction = async () => {
        // Loading GIF appear
        this.loadingGif.style.display = "flex";

        var check = this.inputSearch.value;

        const filter = { $text: { $search: check } };

          if(check){
            const lengthInvoice = await this.getNumberOfinvoices(filter);
            const filterList = await this.getInvoices(0, filter);

            // Очищаємо таблицю
            this.container = document.getElementById("table-list");
            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            this.countNextPage(filterList, lengthInvoice.numbers);

            // Loading GIF off
            this.loadingGif.style.display = "none";
          }

    }

    saveXls = () => {
        // For hide not useless element XLS
        let col12 = document.querySelectorAll(".column12");
        col12.forEach((item) => item.style.display = "none");

        let col11 = document.querySelectorAll(".colum11");
        col11.forEach((item) => item.style.display = "none");

        setTimeout(() => {
            col12.forEach((item) => item.style.display = "table-cell");
            col11.forEach((item) => item.style.display = "table-cell");
        },10);
        // For hide not useless element XLS

        var tbl = document.getElementById('table-invoices');
        var wb = XLSX.utils.table_to_book(tbl, {
            sheet: "Invoice list table",
            display: true
        });

        var wbout = XLSX.write(wb, {bookType: "xlsx", bookSST: true, type: "binary"});
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'invoice_list.xlsx');
        
    }

    clearFilter = () => {
        this.creationDate.value = "";
        this.receiveDate.value = "";
        this.searchInput = this.inputSearch.value = "";
        this.selets = document.querySelectorAll("select");
        this.selets.forEach(item => item.value = "");
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";

        this.countNextPage(this.ArrayLIst, this.InvoiceNumbers[0]);
        this.documentsStatus();
    }

    checkIsEmptyObj = (obj) => {
        for (let key in obj) {
            return false; // wrong
        }
        return true; // is epmty
    }

    dateInRange = (data, first, end) => {
        if (end === false) {
            return +first === +data ? console.log(true) : console.log(false);
        } else {
            return +first <= +data && +data <= +end ? console.log(true) : console.log(false);
        }
        // this.dateInRange(new Date("9/19/2019"), new Date("9/17/2019") , new Date("9/25/2019"));
        // this.dateInRange(new Date("9/19/2019"), new Date("9/17/2019") , false);
    }

    filterList = async () => {
        // Loading GIF appear and scroll off
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");
        //  

        this.filter = {};
        this.status = document.querySelector("#filterStatus").value;
        this.bank = this.bankFilter.value;
        this.merchant = this.merchFilter.value;
        this.documents = document.querySelector("#filterDocuments").value;

        // Додаємо критеріє відбору в об"єкт
        this.status ? this.filter.status = this.status : "";
        this.bank ? this.filter.bank = this.bank : "";
        this.merchant ? this.filter.merchant = this.merchant : "";

        // }) // Знайти всі документи в яких id = "Approved"
        const Approved = { 
            "documents.id": {"$elemMatch": {"status":"Approved"}},
            "documents.payment_proof": {"$elemMatch": { "status":"Approved"}},
            "documents.utility_bill": {"$elemMatch": {"status":"Approved" }},
            "documents.declaration": {"$elemMatch": {"status":"Approved"}}};

        // Знайти всі документи в яких хоча б один "Non-Verified"
        const non_ver = { $or: [
            {"documents.id": {"$elemMatch": {"status":"Non-Verified"}}},
            {"documents.payment_proof": {"$elemMatch": { "status":"Non-Verified"}}},
            {"documents.utility_bill": {"$elemMatch": { "status":"Non-Verified"}}},
            {"documents.declaration": {"$elemMatch": {"status":"Non-Verified"}}}
            
        ]};
        // Знайти всі документи в яких хоча б один EMPTY
        const empty = { $or: [
            {"documents.id": { $exists: true}, "documents.id" :{$size: 0}},
            {"documents.payment_proof": { $exists: true}, "documents.payment_proof" :{$size: 0}},
            {"documents.utility_bill": { $exists: true}, "documents.utility_bill" :{$size: 0}},
            {"documents.declaration": { $exists: true}, "documents.declaration" :{$size: 0}}
            
        ]};

        // Перевірка на дату створення START.
        this.firstCreat = "";
        this.secondCreat = "";

        if(this.creationDate.value.length > 20){
            var DATE = this.creationDate.value.split("—");
            this.firstCreat = new Date(DATE[0].trim());
            this.secondCreat = new Date(DATE[1].trim());

        } else if(this.creationDate.value.length <= 12 && this.creationDate.value.length !== 0){
            var DATE = this.creationDate.value;
            this.firstCreat = new Date(DATE.trim());
            this.secondCreat = false;
        }
        // Перевірка на дату створення END.

        this.firstRec = "";
        this.secondRec = "";

        // Checking Received Date START.
        if(this.receiveDate.value.length > 20){
            var DATE = this.receiveDate.value.split("—");
            this.firstRec = new Date(DATE[0].trim());
            this.secondRec = new Date(DATE[1].trim());

        } else if(this.receiveDate.value.length <= 12 && this.receiveDate.value.length !== 0){
            var DATE = this.receiveDate.value;
            this.firstRec = new Date(DATE.trim());
            this.secondRec = false;
        }
        // Checking Received Date END.

        if(this.documents !== ""){
            this.documents.trim() === "All verified" ? Object.assign(this.filter, Approved): "";
            this.documents.trim() === "Pending verification" ? Object.assign(this.filter, non_ver): "";
            this.documents.trim() === "Without documents" ? Object.assign(this.filter, empty): "";
        }

        const lengthInvoice = await this.getNumberOfinvoices(this.filter, this.firstCreat, this.secondCreat, this.firstRec, this.secondRec);
        const filterList = await this.getInvoices(0, this.filter, this.firstCreat, this.secondCreat, this.firstRec, this.secondRec);

        // Loading GIF appear and scroll off
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
        //  

        // Table cleaning
        this.container = document.getElementById("table-list");
        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";

        this.countNextPage(filterList, lengthInvoice.numbers);
    }

    documentsStatus = () => {
        this.ArrayLIst.forEach((obj) => {
            var ID = obj.documents.id;
            var Utility_bill = obj.documents.utility_bill;
            var Paymant_proof = obj.documents.payment_proof;
            var Declaration = obj.documents.declaration;

                function check(arr) {
                    if(arr.length === 1){
                        return arr[0].status;

                    } else if (arr.length > 1) {
                        var check = [];
                        arr.forEach((item) => check.push(item.status));

                        var approved = check.some((el) => el === "Approved");
                        var non_verAll = check.every((el) => el === "Non-Verified");
                        var declinedAll = check.every((el) => el === "Declined");
                        var non_verOne = check.some((el) => el === "Non-Verified");
                        var declinedOne = check.some((el) => el === "Declined");

                            if (approved === true) {
                                return "Approved";

                            } else if (declinedAll === true) {
                                return "Declined";

                            } else if (non_verAll === true) {
                                return "Non-Verified";

                            } else if (non_verOne === true && declinedOne === true && approved === false) {
                                return "Non-Verified";
                            } else {
                                return "Empty";
                            }

                    } else if (arr.length === 0 || arr.length === undefined) {
                        return "Empty";
                    }
                };

            var result = [];
            result.push(check(ID), check(Utility_bill), check(Paymant_proof), check(Declaration));
            var approvedRes = result.every((item) => item === "Approved");
            var emptyRes = result.some((item) => item === "Empty");
            var non_verRes = result.some((item) => item === "Non-Verified");

            if (approvedRes === true) {
                obj.filter_status = "All verified";

            } else if (emptyRes === true) {
                obj.filter_status = "Without documents";

            } else if (non_verRes === true) {
                obj.filter_status = "Pending verification";
            }
        });
    }

    checkDocuments = (doc) => {
        if(doc.length === 1) {
            doc[0].status === undefined ? doc = "" : doc = doc[0].status;

        } else if(doc.length === 0){
            doc = "";

        } else if(doc.length > 1) {
            var check = [];
            doc.forEach((item) => check.push(item.status));

            var declined = check.every((item) => item === "Declined");
            if (declined === false) {
                var result = check.some(item => item === "Approved");
                result === true ? doc = "Approved" : doc = "Non-Verified";
            } else {
                doc = "Declined";
            }
        } 
        // Drawing docs images
            if(doc === "Approved"){
                return doc = `<i class="far fa-check-circle"></i>`;
            } else if(doc === "Declined"){
                return doc = `<i class="far fa-times-circle"></i>`;
            } else if(doc === "Non-Verified"){
                return doc = `<i class="far fa-question-circle"></i>`;
            } else if(doc === ""){
                return doc = `<img src="img/img_3975.png" alt="empty" width="20px" height="10px">`;
            }
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

    countNextPage = (arr, numbersOfpages) => {
        this.loadInvoices(arr);
        var lastPage = numbersOfpages / 10;

        if (lastPage > 3) {
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

        if (!arr.length) return "";
        
        var buttonsPage = document.querySelectorAll(".nextPage-btn");
        buttonsPage[0].classList.add("highlight");
        buttonsPage.forEach((btn) => {
            
            btn.addEventListener("click", async (event) => {
                // Loading GIF appear and scroll off
                this.loadingGif.style.display = "flex";
                document.body.classList.add("modal-open");
                //  

                let currentEvent = +(event.target.textContent);

                let listNumber = ((currentEvent*10)-10);

                this.nextList = await this.getInvoices(listNumber, this.filter, this.firstCreat, this.secondCreat, this.firstRec, this.secondRec);

                // Loading GIF remove and scroll off
                this.loadingGif.style.display = "none";
                document.body.classList.remove("modal-open");
                //  
                
                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";

                this.loadInvoices(this.nextList);

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
        this.firstPage.style.display = "flex";
    }

    getMerchants = async () => {
        return  await fetch("http://18.216.223.81:3000/getMerchants")
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
   }

    saveLocakBanksAndMerchants = async () => {
        this.arrayBanks = await this.getBanks();
        this.arrayBanks.forEach((bank) => this.ArrayBanks.push(bank));

        this.arrayMerch = await this.getMerchants();
        this.arrayMerch.forEach((merchant) => this.ArrayMerchants.push(merchant));
        this.filtersData();
    }

    getBanks = async () => {
         return  await fetch("http://18.216.223.81:3000/getBanks")
         .then(res => {
             return res.json();
         }) 
         .catch(err => {
             console.log(err);
         });
    }

    saveLocalInvoices = async () => {
        // Отримуємо кількість інвойсів та записуємо їх в глобальну змінну. 
        this.number = await this.getNumberOfinvoices();
        this.InvoiceNumbers.push(this.number.numbers);

        this.array = await this.getInvoices(0);
        this.array.forEach((item) => {
            this.ArrayLIst.push(item);
        });
        this.countNextPage(this.ArrayLIst, this.InvoiceNumbers[0]);
        this.documentsStatus();
    }

    getInvoices = async (count, filter, firstCr, secondCr, firstRe, secondRe) => {
        return  await fetch("http://18.216.223.81:3000/getPart-Invoices", {
            method: "POST",
            body: JSON.stringify({
                numbers: count, 
                filter,
                firstCr: firstCr,
                secondCr: secondCr,
                firstRe: firstRe,
                secondRe: secondRe
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

    getNumberOfinvoices = async (filter, firstCr, secondCr, firstRe, secondRe) => {
       return  await fetch("http://18.216.223.81:3000/getNumber-Invoices", {
            method: "POST",
            body: JSON.stringify({
                filter,
                firstCr: firstCr,
                secondCr: secondCr,
                firstRe: firstRe,
                secondRe: secondRe
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

    checkDate = (data) => {
        return data === "" || !data ? data = "mm/dd/yyyy" : data = moment(data).format('ll');
    }

    loadInvoices = (Arr) => {
        // Loading gif and modal scroll
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");

        this.container = document.getElementById("table-list");
        Arr.forEach((item) => {
            var currency = ""; item.currency === "EUR" ? currency = "€" : currency = "$";
            var color = "";
            var emptyImg = `<img src="img/img_3975.png" alt="empty" width="20px" height="10px">`;
            item.status === "Approved" ? color = "approved" : "";
            item.status === "Declined" ? color = "red" : "";
            item.status === "Received" ? color = "blue" : "";
            item.status === "Sent" ? color = "yellow" : "";
            item.status === "Available" ? color = "green" : "";
            item.status === "Settled" ? color = "black" : "";
            item.status === "Frozen" ? color = "frozen" : "";
            item.status === "Recall" ? color = "recall" : "";

            var docs = "documents" in item;

            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1 view">
                        <div class="createdTd">
                            <p class="green"><b class="number">#${item.number}</b></p>
                            <p class="smallBoldText">${this.checkDate(item.dates.creation_date)}</p>
                            <p>${moment(item.dates.creation_date).format("h:mm a")}</p>
                        </div>
                    </td> 
                    <td class="column2 view">
                        ${item.merchant}
                    </td> 
                    <td class="column3 view">${item.client_details.full_name}</td> 
                    <td class="column4 view">
                        <div class="sentTd">
                            <p>${currency}${item.amount.amount_sent}</p>
                            <p class="yellow smallBoldText">${this.checkDate(item.dates.sent_date)}</p>
                        </div>
                    </td> 
                    <td class="column5 view">${""}</td>
                    <td class="column6 view">
                        <div>
                            <p>${currency}${item.amount.amount_received}</p>
                            <p class="blue smallBoldText">${this.checkDate(item.dates.received_date)}</p>
                        </div>
                    </td>
                    <td class="column7 view">${item.bank}</td>
                    <td class="column8 view">
                        <p>${currency}${item.amount.amount_available}</p>
                        <p class="green smallBoldText">${this.checkDate(item.dates.available_date)}</p>
                    </td>
                    <td class="column9 ${color} view"><strong>${item.status}</strong></td>
                    <td class="column10">
                        <div class="documentsIcon">
                            <div class="marginTop5">ID: ${docs === false ? emptyImg : this.checkDocuments(item.documents.id)}</div>
                            <div>Utility Bill: ${docs === false ? emptyImg : this.checkDocuments(item.documents.utility_bill)}</div>
                            <div>Payment proof: ${docs === false ? emptyImg : this.checkDocuments(item.documents.payment_proof)}</div>
                            <div>Declaration: ${docs === false ? emptyImg : this.checkDocuments(item.documents.declaration)}</div>
                        </div>
                    </td>
                    <td class="column11">
                        <div class="previewIcons">
                            <i class="fas fa-file-alt"></i>
                            <i class="fas fa-file-signature"></i>
                            <i class="fas fa-file-invoice-dollar"></i>
                        </div>
                    </td>
                    <td class="column12">
                        <button target="_blank" class="previewBtn">Preview</button>
                    </td>
            `;
        this.container.appendChild(this.userList);
        });
        this.buttonsPreview = document.querySelectorAll(".previewBtn");
        this.buttonsPreview.forEach((btn) => btn.addEventListener("click", this.previewInvoice));
        this.invoiceContractBtn = document.querySelectorAll(".fa-file-signature");
        this.invoiceContractBtn.forEach((btn) => btn.addEventListener("click", this.invoiceContract));
        this.invoiceDecOfPayBtn = document.querySelectorAll(".fa-file-invoice-dollar");
        this.invoiceDecOfPayBtn.forEach((btn) => btn.addEventListener("click", this.invoiceDecOfPay));
        this.invoicePreviewBankBtn = document.querySelectorAll(".fa-file-alt");
        this.invoicePreviewBankBtn.forEach((btn) => btn.addEventListener("click", this.invoicePreviewBankVersion));
        this.viewInvoice();
    }

    render(){
        this.saveLocalInvoices();
        this.saveLocakBanksAndMerchants();
        this.showFilterBtn.addEventListener("click", this.filterList);
        this.clearFilterBtn.addEventListener("click", this.clearFilter);
        this.btnExel.addEventListener("click", this.saveXls);
        this.btn_search.addEventListener("click", this.searchFunction);
        this.firstPageImg.addEventListener("click", this.clearFilter);
        this.textAreaAddComment.addEventListener("keyup", () => {
            event.preventDefault();
            event.keyCode === 13 ? this.addCommentForBtn() : "";
        });

        this.inputSearch.addEventListener("keyup", () => {
            event.preventDefault();
            event.keyCode === 13 ? this.searchFunction() : "";
        });  
    }
};

const userList = new invoiceList();

// Alert modal window
const alertWindow = document.querySelector('.alert');
if (alertWindow) {
    alertWindow.addEventListener("click", (event) => {
        event.target === alertWindow ? alertWindow.style.display = "none" : "";
    });
};