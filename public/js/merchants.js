class UsersList {
    constructor(){
        this.ArrayLIst = [];
        this.buttonCreate_merchant = document.querySelector("#create-button");
        this.btnExel = document.querySelector("#dowloadXls");
        this.buttonSearch = document.getElementById("search-button");
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
        this.data = document.querySelectorAll(".allData");
        this.b2bCheckBox = document.querySelector("#b2b");
        this.b2bCheckBox.checked ? this.valueB2B = true : this.valueB2B = false;
        this.newMerchant = {
            "name": this.data[0].value,
            "b2b" : this.valueB2B,
            "fees" : {
                "setup_fee" : 1000,
                "wire_recall" : 100,
                "settlement_fee_flat" : 100,
                "monthly_fee" : 50,
                "incoming_transfer" : 10,
                "incoming_wire" : "0.06",
                "settlement_fee_percent" : "0",
                "settlement_return" : "0.2",
                "refund_fee_flat" : 20,
                "refund_fee_percent" : "0.02"
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
            "available_banks" : []
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
                    await this.saveLocalBanks();
                })
                .catch(err => {
                    console.log(err);
                });

        this.dataIfB2B.forEach((item) => item.value = "");
        this.data.forEach((item) => item.value = "");
        this.block = document.querySelector(".if_B2B_true-block");
        this.block.style.display = "none"; 
        this.filter.style.display = "none";
        this.B2B.checked = false;
        }
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

        this.modalAdd_merchant = document.querySelector("#modalCreate-btn");
        this.modalAdd_merchant.addEventListener("click", this.initCreate_Merchant);
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

    searchFunction(){
        var phrase = document.getElementById('search-input');
        var table = document.getElementById('main-table');
        var regPhrase = new RegExp(phrase.value, 'i');
        var flag = false;
        for (var i = 1; i < table.rows.length; i++) {
            flag = false;
            for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
                flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
                if (flag) break;
            }
            if (flag) {
                table.rows[i].style.display = "";
            } else {
                table.rows[i].style.display = "none";
            }
        }
    }

    saveLocalBanks = async (array) => {
        array = await this.getMerchants();
        array.forEach((item) => {
            this.ArrayLIst.push(item);
        });
        this.loadUsers(this.ArrayLIst);
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

    loadUsers(arr){
        var size = 15;
        this.container = document.getElementById("table-list");
        arr.slice(0, size).forEach((item) => {
            item === "" ? item = "—" : "";
            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1">${item.name}</td> 
                    <td class="column2">${"Admin"}</td> 
                    <td class="column3">${item.promo_code}</td> 
                    <td class="column4">${item.users.affiliate}</td> 
                    <td class="column5">${item.fees.incoming_wire}</td>
                    <td class="column5">${""}</td>
                    <td class="column6"> 
                        <div id="merchantButtons">
                            <button class="buttonView">View</button> 
                            <button class="buttonAddSettle">Add Settle</button>
                        </div>
                    </td>
               
            `;
        this.container.appendChild(this.userList);
        })
    }

    render(){
        this.saveLocalBanks();
        this.buttonSearch.addEventListener("click", this.searchFunction);
        this.btnExel.addEventListener("click", this.saveXls);
        this.buttonCreate_merchant.addEventListener("click", this.createMerchant);
    }
};

const userList = new UsersList();



// { 
//     "_id" : ObjectId("5d7752ba79d4255064ff3e1f"), 
//     "name" : "Merchant 1", 
//     "b2b" : false, 
//     "fees" : { 
//         "setup_fee" : 1000, 
//         "wire_recall" : 100, 
//         "settlement_fee_flat" : 100, 
//         "monthly_fee" : 50, 
//         "incoming_transfer" : 10, 
//         "incoming_wire" : NumberDecimal("0.05"), 
//         "settlement_fee_percent" : NumberDecimal("0"), 
//         "settlement_return" : NumberDecimal("0.2"), 
//         "refund_fee_flat" : 20, 
//         "refund_fee_percent" : NumberDecimal("0.02") 
//             }, 
//     "specifications" : { 
//         "background" : "#FFFFFF", 
//         "first_color" : "#1f7be2", 
//         "second_color" : "#67d1a5", 
//         "logo" : "", 
//         "tagline" : "We are the champions!" 
//             }, 
//     "support_email" : "info@merchant1.com", 
//     "promo_code" : "001", 
//     "users" : [ "user@gmail.com", "user2@gmail.com", "vlad@gmail.com", "bogdan@gmail.com", "michael@gmail.com" ], 
//     "wallets" : [ 
//         ObjectId("5d77601479d4255064ff3e20"), 
//         ObjectId("5d77603579d4255064ff3e21") ], 
//     "available_banks" : [ ObjectId("5d77605679d4255064ff3e22"), ObjectId("5d77605c79d4255064ff3e23") ], 
//     "specifications_b2b" : { 
//         "beneficiary_name" : "", 
//         "beneficiary_address" : "", 
//         "bank_name" : "", 
//         "bank_address" : "", 
//         "iban" : "", "swift" : "" 
//         } 
//     }