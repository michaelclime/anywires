const USERS = [{
    Name: "AW_Finance",
    Email: "n.soul@brokers.expert",
    Merchant: "Omer",
    Role: "New", 
    Last_login_date: "Jul 7, 2019"
},{
    Name: "Jack Wilson",
    Email: "france@brokers.expert",
    Merchant: "",
    Role: "", 
    Last_login_date: "Apr 10, 2019"
},{
    Name: "Mark Novak",
    Email: "mark.n@cryptopmarket.com",
    Merchant: "Omer",
    Role: "Brank", 
    Last_login_date: "Apr 9, 2019"
},{
    Name: "Darina Smith",
    Email: "dan@bitsale.com",
    Merchant: "",
    Role: "Affiliate", 
    Last_login_date: "Jun 28, 2019"
},{
    Name: "Alexa Bauman",
    Email: "eagl@bitsale.com",
    Merchant: "",
    Role: "Ceclen", 
    Last_login_date: "Jun 28, 2019"
},{
    Name: "Clime Michael",
    Email: "jack.wilson@brokers.expert",
    Merchant: "",
    Role: "", 
    Last_login_date: "Apr 10, 2019"
},{
    Name: "Zayan Le Blank",
    Email: "arra.n@cryptopmarket.com",
    Merchant: "Omer",
    Role: "New", 
    Last_login_date: "Apr 9, 2019"
},{
    Name: "Alice Blair",
    Email: "bruce@bitsale.com",
    Merchant: "",
    Role: "Admin", 
    Last_login_date: "Jun 28, 2019"
},{
    Name: "Bruce Willis",
    Email: "corc@bitsale.com",
    Merchant: "",
    Role: "Affiliate", 
    Last_login_date: "Jun 28, 2019"
}];

MERCHANTS = ["CK", "CMP24", "GigaFX", "Omer", "Lions", "BU", "Tesla", "CFM Solution", "English", "TurboF"];

class UsersList {
    constructor(){
        this.sortNameBtnUp = document.querySelectorAll(".sortUp");
        this.sortNameBtnDown = document.querySelectorAll(".sortDown");
        this.buttonSearch = document.getElementById("search-button");
        this.createUser_btn = document.querySelector("#createUser-button");
        this.buttonPdf = document.querySelector("#dowloadPdf");
        this.render();
    }

    marchantsForSelect = () => {
        this.container = document.querySelector("#filterMerchant");
        MERCHANTS.forEach((item) => {
            console.log(item);
            this.option = document.createElement("option");
            this.option.textContent = item;
            this.option.value = item;
            this.container.appendChild(this.option);
        })
    }

    sortArrDown = (arr, key) => {
        this.sortByValue = arr.slice(0);
        this.key = key;
        this.sortByValue.sort((a,b) => {
            var x = a[this.key].toLowerCase();
            var y = b[this.key].toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });

        this.container = document.querySelector("#table-list");
        this.container.innerHTML = "";

        this.loadUsers(this.sortByValue);
    }

    sortArrUp = (arr, key) => {
        this.sortByValue = arr.slice(0);
        this.key = key;
        this.sortByValue.sort((a,b) => {
            var x = a[this.key].toLowerCase();
            var y = b[this.key].toLowerCase();
            return x < y ? 1 : x > y ? -1 : 0;
        });

        this.container = document.querySelector("#table-list");
        this.container.innerHTML = "";

        this.loadUsers(this.sortByValue);
    }

    downloadPdf(){
        var doc = new jsPDF();
        doc.autoTable({html: '#table-user'});
        doc.save('table.pdf');
    }

    hideBlock(){
        jQuery(function($){
            $(document).mouseup(function (e){ // событие клика по веб-документу
                var div = $("#modal-createUser"); // тут указываем ID элемента
                if (!div.is(e.target) // если клик был не по нашему блоку
                    && div.has(e.target).length === 0) { // и не по его дочерним элементам
                    div.hide(); // скрываем его
                    $("#wrapper").removeClass("opacityWrapper");
                }
            });
        });
    }

    createUser(){
        this.wrapper = document.querySelector("#wrapper");
        this.wrapper.classList.add("opacityWrapper");

        this.modalWindow = document.querySelector("#modal-createUser");
        this.modalWindow.style.display = "flex";
        
        this.modalName = document.querySelector(".modal-InputName");
        this.modalEmail = document.querySelector(".modal-InputEmail");
        this.modalMer = document.querySelector(".modal-InputMer");
        this.modalRole = document.querySelector(".modal-InputRole");
        this.DATA = "Aug 10, 2019";

        this.btnAdd = document.querySelector("#saveUser-btn");
        this.btnAdd.addEventListener("click", () => {

            this.table = document.querySelector("#table-list");
            this.newUser = document.createElement("tr");
            this.newUser.innerHTML = `
            <td class="column1">${this.modalName.value}</td> 
            <td class="column2">${this.modalEmail.value}</td> 
            <td class="column3">${this.modalMer.value}</td> 
            <td class="column4">${this.modalRole.value}</td> 
            <td class="column5">${this.DATA}</td>
        `;
        this.table.appendChild(this.newUser);
            this.modalName.value = "";
            this.modalEmail.value = "";
            this.modalMer.value = "";
            this.modalRole.value = "";

            jQuery(function($){
                var div = $("#modal-createUser"); // тут указываем ID элемента
                    div.hide(); // скрываем его
                    $("#wrapper").removeClass("opacityWrapper");
            });
        },{once:true});
        
    }

    searchFunction(){
        var phrase = document.getElementById('search-input');
        var table = document.getElementById('table-user');
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

    loadUsers = (arr) => {
        this.container = document.getElementById("table-list");
        arr.forEach((item) => {
            item.Merchant === "" ? item.Merchant = "—" : item.Merchant;
            item.Name === "" ? item.Name = "—" : item.Name;
            item.Email === "" ? item.Email = "—" : item.Email;
            item.Role === "" ? item.Role = "—" : item.Role;
            item.Last_login_date === "" ? item.Last_login_date = "—" : item.Last_login_date;

            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1">${item.Name}</td> 
                    <td class="column2">${item.Email}</td> 
                    <td class="column3">${item.Merchant}</td> 
                    <td class="column4">${item.Role}</td> 
                    <td class="column5">${item.Last_login_date}</td>
               
            `;
        this.container.appendChild(this.userList);
        })
    }

    render(){
        this.loadUsers(USERS);
        this.hideBlock();
        this.createUser_btn.addEventListener("click", this.createUser);
        this.buttonPdf.addEventListener("click", this.downloadPdf);

        this.sortNameBtnDown.forEach((btn) => {
            btn.addEventListener("click", () => {
                this.value = btn.closest("th").innerText.trim();
                this.sortArrDown(USERS, this.value);

                this.toggleBtn = btn.closest('th').children[0];
                this.toggleBtn.style.display = "inline-block";
                btn.style.display = "none";
            });
        });

        this.sortNameBtnUp.forEach((btn) => {
            btn.addEventListener("click", () => {
                this.value = btn.closest("th").innerText.trim();
                this.sortArrUp(USERS, this.value );

                this.toggleBtn = btn.closest('th').children[1];
                this.toggleBtn.style.display = "inline-block";
                btn.style.display = "none";
            });
        })

        this.marchantsForSelect();
    }
};

const userList = new UsersList();








