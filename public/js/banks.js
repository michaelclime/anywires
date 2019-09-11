const USERS = [{
    Name: "AnyWires Bank",
    Country: "United Kingdom",
    Currency: "GBP",
    Requested: "2523", 
    Sent: "2350",
    Received: "350",
    Approved: "400",
    Available: "1350",
    Min_Wire: "500",
    Max_Wire: "30000",
    Sepa: "yes",
    Enabled: "yes"
},{
    Name: "Swes Bank",
    Country: "Sweden",
    Currency: "EUR",
    Requested: "1030", 
    Sent: "2390",
    Received: "250",
    Approved: "400",
    Available: "1350",
    Min_Wire: "500",
    Max_Wire: "30000",
    Sepa: "yes",
    Enabled: "no"
},{
    Name: "Santander",
    Country: "Poland",
    Currency: "EUR",
    Requested: "10000", 
    Sent: "23500",
    Received: "3500",
    Approved: "4000",
    Available: "13500",
    Min_Wire: "500",
    Max_Wire: "30000",
    Sepa: "no",
    Enabled: "yes"
},{
    Name: "AnyWires Bank",
    Country: "United Kingdom",
    Currency: "GBP",
    Requested: "1312", 
    Sent: "2350",
    Received: "350",
    Approved: "400",
    Available: "1350",
    Min_Wire: "500",
    Max_Wire: "30000",
    Sepa: "yes",
    Enabled: "yes"
},{
    Name: "Swes Bank",
    Country: "Sweden",
    Currency: "EUR",
    Requested: "1030", 
    Sent: "2390",
    Received: "250",
    Approved: "400",
    Available: "1350",
    Min_Wire: "500",
    Max_Wire: "30000",
    Sepa: "yes",
    Enabled: "no"
},{
    Name: "AnyWires Bank",
    Country: "United Kingdom",
    Currency: "GBP",
    Requested: "2523", 
    Sent: "2350",
    Received: "350",
    Approved: "400",
    Available: "1350",
    Min_Wire: "500",
    Max_Wire: "30000",
    Sepa: "yes",
    Enabled: "yes"
},{
    Name: "Swes Bank",
    Country: "Sweden",
    Currency: "EUR",
    Requested: "1030", 
    Sent: "2390",
    Received: "250",
    Approved: "400",
    Available: "1350",
    Min_Wire: "500",
    Max_Wire: "30000",
    Sepa: "yes",
    Enabled: "no"
},{
    Name: "Santander",
    Country: "Poland",
    Currency: "EUR",
    Requested: "10000", 
    Sent: "23500",
    Received: "3500",
    Approved: "4000",
    Available: "13500",
    Min_Wire: "500",
    Max_Wire: "30000",
    Sepa: "no",
    Enabled: "yes"
},{
    Name: "AnyWires Bank",
    Country: "United Kingdom",
    Currency: "GBP",
    Requested: "1312", 
    Sent: "2350",
    Received: "350",
    Approved: "400",
    Available: "1350",
    Min_Wire: "500",
    Max_Wire: "30000",
    Sepa: "yes",
    Enabled: "yes"
},{
    Name: "Swes Bank",
    Country: "Sweden",
    Currency: "EUR",
    Requested: "1030", 
    Sent: "2390",
    Received: "250",
    Approved: "400",
    Available: "1350",
    Min_Wire: "500",
    Max_Wire: "30000",
    Sepa: "yes",
    Enabled: "no"
}];

class UsersList {
    constructor(){
        this.buttonSearch = document.getElementById("search-button");
        this.createUser_btn = document.querySelector("#createUser-button");
        this.buttonPdf = document.querySelector("#dowloadPdf");
        this.render();
    }

    downloadPdf(){
        var doc = new jsPDF();
        doc.autoTable({
            html: '#table-user', 
            theme: 'striped',  
            tableWidth: 208, 
            margin: {top: 1, left: 1, right: 1}, 
            columnStyles: {
                0: {halign: 'left', cellWidth: 30}, 
                1: {halign: 'left', cellWidth: 30},
                4: {halign: 'left', cellWidth: 20},
                11: {halign: 'center'}
            }
        });
        doc.save('table.pdf');
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

    loadUsers(){
        this.container = document.getElementById("table-list");
        USERS.forEach((item) => {
            item.Name === "" ? item.Name = "—" : item.Name;
            item.Country === "" ? item.Country = "—" : item.Country;
            item.Currency === "" ? item.Currency = "—" : item.Currency;
            item.Requested === "" ? item.Requested = "—" : item.Requested;
            item.Sent === "" ? item.Sent = "—" : item.Sent;
            item.Received === "" ? item.Received = "—" : item.Received;
            item.Approved === "" ? item.Approved = "—" : item.Approved;
            item.Available === "" ? item.Available = "—" : item.Available;
            item.Min_Wire === "" ? item.Min_Wire = "—" : item.Min_Wire;
            item.Max_Wire === "" ? item.Max_Wire = "—" : item.Max_Wire;
            item.Sepa === "" ? item.Sepa = "—" : item.Sepa;
            item.Enabled === "" ? item.Enabled = "—" : item.Enabled;

            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1">${item.Name}</td> 
                    <td class="column2">${item.Country}</td> 
                    <td class="column3">${item.Currency}</td> 
                    <td class="column4">${item.Requested}</td> 
                    <td class="column5">${item.Sent}</td>
                    <td class="column6">${item.Received}</td> 
                    <td class="column7">${item.Approved}</td> 
                    <td class="column8">${item.Available}</td> 
                    <td class="column9">${item.Min_Wire}</td> 
                    <td class="column10">${item.Max_Wire}</td> 
                    <td class="column11 statusCheck">${item.Sepa}</td> 
                    <td class="column12 statusCheck">${item.Enabled}</td> 
            `;
            this.container.appendChild(this.userList);
        })

        let itemsSepa = document.querySelectorAll(".statusCheck");
        for (let i = 0; i < itemsSepa.length; i++) {
            itemsSepa[i].textContent === "no" ? itemsSepa[i].style.color = "red" : itemsSepa[i].style.color = "green";
        }
    }

    render(){
        this.loadUsers();
        this.buttonSearch.addEventListener("click", this.searchFunction);
        this.buttonPdf.addEventListener("click", this.downloadPdf);
    }
};

const userList = new UsersList();








