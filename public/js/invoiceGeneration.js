
 // http://18.216.223.81:3000/getMerchanList

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
                this.container = document.querySelector('#merchList');
                list.slice(0, list.length).forEach((item, i) => {
                    this.option = document.createElement("option");
                    this.option.value = item.name;
                    this.option.innerHTML =  item.name;   
                    this.container.append(this.option);
                });
            }
            render(){
                this.loadMerchant(this.list);
            }
        };

    const a = new MerchantOptoinList(merchants);
});

// Generate banks list for selected menu

let fetchPromise2  = fetch('http://localhost:3000/getBanks');
fetchPromise2.then(response => {
    return response.json();
    }).then(banks => {

        class BankOptoinList {
            constructor(){
                this.list = banks;
                this.render();
            }
        
            loadBank(list) {
                this.container = document.querySelector('#bankList');
                list.slice(0, list.length).forEach((item, i) => {
                    this.option = document.createElement("option");
                    this.option.value = item.name;
                    this.option.innerHTML =  item.name;   
                    this.container.append(this.option);
                });
            }
            render(){
                this.loadBank(this.list);
            }
        };

    const b = new BankOptoinList(banks);
});