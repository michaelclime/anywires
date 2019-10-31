
// Modal Window "Create User"
const createUserWindow = document.querySelector('.popup');
if (createUserWindow) {
    createUserWindow.addEventListener("click", (event) => {
      event.target === createUserWindow ? createUserWindow.style.display = "none" : "";
  });
}

$(document).ready(function(){
    $('#createUser-button').on('click', function(event){
      event.preventDefault();
      $('.popup').fadeIn();
    });
});

// Generate merchants list for selected menu

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
                this.container = document.querySelector('#merchant1');
                list.slice(0, list.length).forEach((item, i) => {
                    this.option = document.createElement("option");
                    this.option.value = item.name;
                    this.option.innerHTML =  item.name;   
                    this.container.append(this.option);
                });
            }

            loadMerchant2(list) {
                this.container = document.querySelector('#merchant2');
                list.slice(0, list.length).forEach((item, i) => {
                    this.option = document.createElement("option");
                    this.option.value = item.name;
                    this.option.innerHTML =  item.name;   
                    this.container.append(this.option);
                });
            }

            render(){
                this.loadMerchant(this.list);
                this.loadMerchant2(this.list);
            }
        };

    const a = new MerchantOptoinList(merchants);
});
