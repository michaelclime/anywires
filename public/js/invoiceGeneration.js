
 // Generate merchants list for selected menu

//let fetchPromise  = fetch('http://18.216.223.81:3000/getMerchants');
let fetchPromise  = fetch('http://18.216.223.81:3000/getMerchants');
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

// Generate banks list for selected menu

//let fetchPromise2  = fetch('http://18.216.223.81:3000/getBanks');
let fetchPromise2  = fetch('http://18.216.223.81:3000/getBanks');
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
                    if (this.container) {
                    this.option = document.createElement("option");
                    this.option.value = item.name;
                    this.option.innerHTML =  item.name;   
                    this.container.append(this.option);
                    }
                });
            }
            render(){
                this.loadBank(this.list);
            }
        };

    const b = new BankOptoinList(banks);
});

// Alert modal window
const alertWindow = document.querySelector('.alert');
if (alertWindow) {
  alertWindow.addEventListener("click", (event) => {
      event.target === alertWindow ? alertWindow.style.display = "none" : "";
  });
}

// Open Invoice Preview
let fetchPromise3  = fetch('http://18.216.223.81:3000/getInvNumber');

fetchPromise3.then(response => {
    return response.json();
    }).then(number => {
        jQuery(".invoiceBtn").click(function(){
            var win = window.open();
            win.location = "/invoice-preview?&" + (number + 1);
            win.opener = null;
            win.blur();
            window.focus();
        });
    });

