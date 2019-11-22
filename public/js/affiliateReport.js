async function loadPge(chosenDate)  {
    const affEmail = document.querySelector('.affiliateEmail').textContent;
    let date = 0;

    if (chosenDate) {
         date = chosenDate;
    } else {
         date = 'now';
    }
    
    const dataList = await  fetch('http://localhost:3000/getDatasList/' + affEmail + '/' + date);
    const Data = await dataList.json();
    let merchantsNameList = Data.merchantsName,
        invoicesList  = Data.invoices;
    
    // Creat menu of merchants on the top of page
    const merchantInfoLoad = (merchName, turnover, currency) => {
        const container = document.querySelector('.leftBlockChoosePeriod');
        const span = document.createElement("span");
        const p = document.createElement("p");

        span.innerHTML = merchName;
        p.innerHTML = `
            Turnover: <span class="amountTurnover number">€${turnover}</span>
        `;

        container.appendChild(span);
        container.appendChild(p);
    }
}

loadPge();

// Load page when chosen period
document.querySelector('#inputPeriod').addEventListener('focusout', (event) => {
    //const date = document.querySelector('.datepicker-here').nodeValue;
    console.log('date');
});
