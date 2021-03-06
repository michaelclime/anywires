
// Alert modal window
const alertWindow = document.querySelector('.alert');
if (alertWindow) {
  alertWindow.addEventListener("click", (event) => {
      event.target === alertWindow ? alertWindow.style.display = "none" : "";
  });
}

const curentUserMerchantList = document.querySelector('.curentUserMerchantList').textContent;

if (curentUserMerchantList && curentUserMerchantList !== 'null') {
  let getMerch = fetch('http://18.216.223.81:3000/getPersonalMerch/' + curentUserMerchantList);

  getMerch.then( response => {
    return response.json();
    }).then( list => {
    loadInvoice(list);
  });
}


const loadInvoice = (list) => {
  let container = document.querySelector(".merList");
  container.innerHTML = '';
  list.slice(0, list.length).forEach((item, i) => {
      let p = document.createElement("p");
      p.className = "description-info";
          p.innerHTML =  `${item}`;   
  container.appendChild(p);
  });
}



// Remove menu items for permissions START

const userRole = document.querySelector('.curentUserRole').textContent.trim()
if (userRole === 'Crm InvoiceManager' || userRole === 'Crm SuccessManager') {
    document.querySelector('.gn-menu__banks').remove()
} 

// Remove menu items for permissions END