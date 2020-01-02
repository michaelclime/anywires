
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

// Merchant window

const curentUserID = document.querySelector('.curentUserId').textContent;
const currentUserTypeClass = document.querySelector('.currentUserTypeClass').textContent;
const merchantChooseBtn = document.querySelector('.merchantChooseList');
let showIndicator = true;

if ( currentUserTypeClass === 'admin' ) {

    merchantChooseBtn.addEventListener('click', () => {
        document.querySelector('.selectAllBox').innerHTML = 'Loading...';
        if (showIndicator) {
            let fetchPromise  = fetch('http://localhost:3000/getMerchants'); // in settlements.js route file
            fetchPromise.then(response => {
                return response.json();
                }).then(merchants => {
    
                    class MerchantOptoinList {
                        constructor(){
                            this.list = merchants;
                            this.render();
                        }
    
                        loadMerchant(list) {
    
                            this.container = document.querySelector('.selectAllBox');
                            this.container.innerHTML = ` 
                                <span class="mechCheckBox"> <input onclick="selectAll(this)" type="checkbox" name="select-all" id="selectAll "> Select / Remove All</span>
                            `;
    
                            list.slice(0, list.length).forEach((item, i) => {
                                this.span = document.createElement("span");
                                this.span.className = `mechCheckBox`;
                                this.span.innerHTML =  `
                                    <span class="mechCheckBox"><input class="check" type="checkbox" name='merchant' value=${item._id }> ${item.name}</span>
                                `;
                                this.leftBox =  document.querySelector('.leftBox');
                                this.rightBox = document.querySelector('.rightBox');
                                if ( i % 2 === 0) {
                                    this.leftBox.append(this.span);
                                } else {
                                    this.rightBox.append(this.span);
                                }
                                
                            });
                        }
    
                        render(){
                            this.loadMerchant(this.list);
                        }
                    };
    
                const a = new MerchantOptoinList(merchants);
    
                
            });
            showIndicator = false; 
        } else {
            showIndicator = true;
            document.querySelector('.selectAllBox').innerHTML = '';
            document.querySelector('.leftBox').innerHTML = '';
            document.querySelector('.rightBox').innerHTML = '';
        }
    });
} else {

    merchantChooseBtn.addEventListener('click', () => {

        document.querySelector('.selectAllBox').innerHTML = 'Loading...';
        if (showIndicator) {
            let fetchPromise  = fetch('http://localhost:3000/getMerchant/' + curentUserID); // in settlements.js route file
            fetchPromise.then(response => {
                return response.json();
                }).then(merchants => {
                    
                    class MerchantOptoinList {
                        constructor(){
                            this.list = merchants;
                            this.render();
                        }
    
                        loadMerchant(list) {
    
                            this.container = document.querySelector('.selectAllBox');
                            this.container.innerHTML = ` 
                                <span class="mechCheckBox"> <input onclick="selectAll(this)" type="checkbox" name="select-all" id="selectAll "> Select / Remove All</span>
                            `;
    
                            list.slice(0, list.length).forEach((item, i) => {
                                this.span = document.createElement("span");
                                this.span.className = `mechCheckBox`;
                                this.span.innerHTML =  `
                                    <span class="mechCheckBox"><input class="check" type="checkbox" name='merchant' value=${item._id }> ${item.name}</span>
                                `;
                                this.leftBox =  document.querySelector('.leftBox');
                                this.rightBox = document.querySelector('.rightBox');
                                if ( i % 2 === 0) {
                                    this.leftBox.append(this.span);
                                } else {
                                    this.rightBox.append(this.span);
                                }
                                
                            });
                        }
    
                        render(){
                            this.loadMerchant(this.list);
                        }
                    };
    
                const a = new MerchantOptoinList(merchants);
    
                
            });
            showIndicator = false; 
        } else {
            showIndicator = true;
            document.querySelector('.selectAllBox').innerHTML = '';
            document.querySelector('.leftBox').innerHTML = '';
            document.querySelector('.rightBox').innerHTML = '';
        }
    });
}

const selectAll = (source) => {
    checkboxes = document.getElementsByName('merchant');
    for(let i = 0, n = checkboxes.length; i < n; i++) {
      checkboxes[i].checked = source.checked;
    }       
};

// Email validation 

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  
  function validateE() {
    const $result = $("#username");
    const email = $("#username").val();
    $result.text("");
  
    if (validateEmail(email)) {
      $result.css("border", " 1px solid green");
    } else {
      $result.val('');
      $result.css("border", " 1px solid red");
      Swal.fire('Please, enter correct email!');
    }
    return false;
  }
  
  $("#username").change(validateE);