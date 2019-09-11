const USERS = [{
    Date: "Apr 19, 2019 4:00 pm",
    Amount: "54092.52",
    From: '',
    To: '', 
    State: "Received"
},{
    Date: "Apr 26, 2019 4:39 pm",
    Amount: "64840.53",
    From: '',
    To: '', 
    State: "Received"
},{
    Date: "May 3, 2019 5:26 pm",
    Amount: "57288",
    From: '',
    To: '', 
    State: "Received"
},{
    Date: "May 6, 2019 4:29 pm",
    Amount: "57951",
    From: '',
    To: '', 
    State: "Declined"
},{
    Date: "May 6, 2019 6:37 pm",
    Amount: "9306",
    From: '',
    To: '', 
    State: "Received"
},{
    Date: "May 6, 2019 6:39 pm",
    Amount: "5123",
    From: '',
    To: '', 
    State: "Received"
},{
    Date: "May 6, 2019 6:42 pm",
    Amount: "10199",
    From: '',
    To: '', 
    State: "Received"
},{
    Date: "May 6, 2019 6:54 pm",
    Amount: "7943",
    From: '',
    To: '', 
    State: "Received"
},{
    Date: "May 9, 2019 12:07 pm",
    Amount: "7449.5",
    From: '',
    To: '', 
    State: "Requested"
},{
    Date: "May 10, 2019 5:16 pm",
    Amount: "100570.2",
    From: '',
    To: '', 
    State: "Declined"
}
];

class UsersList {
    constructor(){
        this.render();
    }

    loadUsers(){
        this.container = document.getElementsByClassName("tableList")[0];
        USERS.slice(0, USERS.length).forEach((item) => {
            this.userList = document.createElement("tr");
            if (item.State !== 'Received') {
                this.userList.innerHTML =  `
                <td class="column1">${item.Date}</td> 
                <td class="column2">${item.Amount}</td> 
                <td class="column3">${item.From}</td> 
                <td class="column4">${item.To}</td> 
                <td class="column5">${item.State}</td>
                <td class="column6"><button class="receivedBtn">Received</button></td>
            `;
            } else {
                this.userList.innerHTML =  `
                <td class="column1">${item.Date}</td> 
                <td class="column2">${item.Amount}</td> 
                <td class="column3">${item.From}</td> 
                <td class="column4">${item.To}</td> 
                <td class="column5">${item.State}</td>
            `;
            }
            
        this.container.appendChild(this.userList);
        })
    }

    changeState() {
        let btns = document.querySelectorAll('.receivedBtn');

        btns.forEach( (i) => {
            i.addEventListener('click', (e) => {
                let state = (e.target.parentElement).previousElementSibling;
                state.innerHTML = "Received";
                i.style.display = 'none';
            });
        });        
    }

    render(){
        this.loadUsers();
        this.changeState();
    }
};

const userList = new UsersList();

