
// http://localhost:3000/getList

let fetchPromise  = fetch('http://18.216.223.81:3000/getList');
fetchPromise.then(response => {
    return response.json();
  }).then(invoices => {

        class InvoiceList {
            constructor(){
                this.list = invoices;
                this.render();
            }
        
            loadInvoice(list) {
                this.container = document.querySelector(".tableList");
                list.slice(0, list.length).forEach((item, i) => {
                    this.settleList = document.createElement("tr");
                    this.settleList.className = `tr${i}`;
                        this.settleList.innerHTML =  `
                        <td class="column column0">${item.name}</td> 
                        <td class="column column1">${item.address}</td> 
                        <td class="column column2">${item.country}</td> 
                        <td class="column column3">${item.phone}</td> 
                        <td class="column column4">${item.email}</td> 
                        <td class="column column5">${item.amount}</td>
                        <td class="column column6">${item.currency}</td>
                        <td class="column column7">${item.sepa}</td>
                        <td class="column column8">${item.merch}</td>
                        <td class="column column9">${item.bank}</td>
                    `;   
                this.container.appendChild(this.settleList);
                });
            }
            render(){
                this.loadInvoice(this.list);
            }
        };

    const a = new InvoiceList(invoices);
  });