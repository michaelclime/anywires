class Commission {
    constructor(){

        this.render();
    }

    getCommissionsPart = async (number, filter) => {
        return  await fetch("http://18.216.223.81:3000/getCommissionsPart", {
            method: "POST",
            body: JSON.stringify({number, filter}),
            headers:{'Content-Type': 'application/json'}
        })
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err, "Error with uploding Commission Part, Front-End!");
        });
    }

    renderCommissionTable = (arr) => {
        const container = document.getElementById("table-list");
        arr.forEach((commission, index) => {
            const commissionsList = document.createElement("tr");
            commissionsList.innerHTML = `
                <td class="column1">${commission.type}</td> 
                <td class="column2">${commission.currency}</td> 
                <td class="column3">${commission.amount}</td> 
                <td class="column4">${commission.bank}</td> 
                <td class="column5">${commission.merchant}</td> 
            `;
            container.appendChild(commissionsList);
        });
    }

    saveLocalCommissions = async () => {
        const res = await this.getCommissionsPart(0, {});
        this.renderCommissionTable(res.commissions);
        console.log(res);
    }

    render(){
        this.saveLocalCommissions();
    }
}

const commission = new Commission();