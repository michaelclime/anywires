const allCountry = [
    'Zimbabwe',
    'Zambia',
    'Yemen',
    'Western Sahara',
    'Wallis and Futuna',
    'Virgin Islands, U.S.',
    'Virgin Islands, British',
    'Vietnam',
    'Venezuela',
    'Vanuatu',
    'Uzbekistan',
    'Uruguay',
    'United States Minor Outlying Islands',
    'United States',
    'United Kingdom',
    'United Arab Emirates',
    'Ukraine',
    'Uganda',
    'Tuvalu',
    'Turks and Caicos Islands',
    'Turkmenistan',
    'Turkey',
    'Tunisia',
    'Trinidad and Tobago',
    'Tonga',
    'Tokelau',
    'Togo',
    'Timor-Leste',
    'Thailand',
    'Tanzania',
    'Tajikistan',
    'Taiwan',
    'Syrian Arab Republic',
    'Switzerland',
    'Sweden',
    'Swaziland',
    'Svalbard and Jan Mayen',
    'Suriname',
    'Sudan',
    'Sri Lanka',
    'Spain',
    'South Sudan',
    'South Georgia and the South Sandwich Islands',
    'South Africa',
    'Somalia',
    'Solomon Islands',
    'Slovenia',
    'Slovakia',
    'Sint Maarten (Dutch part)',
    'Singapore',
    'Sierra Leone',
    'Seychelles',
    'Serbia',
    'Senegal',
    'Saudi Arabia',
    'Sao Tome and Principe',
    'San Marino',
    'Samoa',
    'Saint Vincent and the Grenadines',
    'Saint Pierre and Miquelon',
    'Saint Martin (French part)',
    'Saint Lucia',
    'Saint Kitts and Nevis',
    'Saint Helena, Ascension and Tristan da Cunha',
    'Saint Barthelemy',
    'Rwanda',
    'Russian Federation',
    'Romania',
    'Réunion',
    'Qatar',
    'Puerto Rico',
    'Portugal',
    'Poland',
    'Pitcairn',
    'Philippines',
    'Peru',
    'Paraguay',
    'Papua New Guinea',
    'Panama',
    'Palestine',
    'Palau',
    'Pakistan',
    'Oman',
    'Norway',
    'Northern Mariana Islands',
    'Norfolk Island',
    'Niue',
    'Nigeria',
    'Niger',
    'Nicaragua',
    'New Zealand',
    'New Caledonia',
    'Netherlands',
    'Nepal',
    'Nauru',
    'Namibia',
    'Myanmar',
    'Mozambique',
    'Morocco',
    'Montserrat',
    'Montenegro',
    'Mongolia',
    'Monaco',
    'Moldova',
    'Micronesia',
    'Mexico',
    'Mayotte',
    'Mauritius',
    'Mauritania',
    'Martinique',
    'Marshall Islands',
    'Malta',
    'Mali',
    'Maldives',
    'Malaysia',
    'Malawi',
    'Madagascar',
    'Macedonia',
    'Macao',
    'Luxembourg',
    'Lithuania',
    'Liechtenstein',
    'Libya',
    'Liberia',
    'Lesotho',
    'Lebanon',
    'Latvia',
    "Lao People's Democratic Republic",
    'Kyrgyzstan',
    'Kuwait',
    'North Korea',
    'South Korea',
    'Kiribati',
    'Kenya',
    'Kazakhstan',
    'Jordan',
    'Jersey',
    'Japan',
    'Jamaica',
    'Italy',
    'Israel',
    'Isle of Man',
    'Ireland',
    'Iraq',
    'Iran',
    'Indonesia',
    'India',
    'Iceland',
    'Hungary',
    'Hong Kong',
    'Honduras',
    'Holy See (Vatican City State)',
    'Heard Island and McDonald Islands',
    'Haiti',
    'Guyana',
    'Guinea-Bissau',
    'Guinea',
    'Guernsey',
    'Guatemala',
    'Guam',
    'Guadeloupe',
    'Grenada',
    'Greenland',
    'Greece',
    'Gibraltar',
    'Ghana',
    'Germany',
    'Georgia',
    'Gambia',
    'Gabon',
    'French Southern Territories',
    'French Polynesia',
    'French Guiana',
    'France',
    'Finland',
    'Fiji',
    'Faroe Islands',
    'Falkland Islands (Malvinas)',
    'Ethiopia',
    'Estonia',
    'Eritrea',
    'Equatorial Guinea',
    'El Salvador',
    'Egypt',
    'Ecuador',
    'Dominican Republic',
    'Dominica',
    'Djibouti',
    'Denmark',
    'Czech Republic',
    'Cyprus',
    'Curaçao',
    'Cuba',
    'Croatia',
    "Cote d'Ivoire",
    'Costa Rica',
    'Cook Islands',
    'Congo',
    'Democratic Republic of the Congo',
    'Comoros',
    'Colombia',
    'Cocos (Keeling) Islands',
    'Christmas Island',
    'China',
    'Chile',
    'Chad',
    'Central African Republic',
    'Cayman Islands',
    'Cape Verde',
    'Canada',
    'Cameroon',
    'Cambodia',
    'Burundi',
    'Burkina Faso',
    'Bulgaria',
    'Brunei Darussalam',
    'British Indian Ocean Territory',
    'Brazil',
    'Bouvet Island',
    'Botswana',
    'Bosnia and Herzegovina',
    'Bonaire, Sint Eustatius and Saba',
    'Bolivia',
    'Bhutan',
    'Bermuda',
    'Benin',
    'Belize',
    'Belgium',
    'Belarus',
    'Barbados',
    'Bangladesh',
    'Bahrain',
    'Bahamas',
    'Azerbaijan',
    'Austria',
    'Australia',
    'Aruba',
    'Armenia',
    'Argentina',
    'Antigua and Barbuda',
    'Antarctica',
    'Anguilla',
    'Angola',
    'Andorra',
    'American Sa,moa',
    'Algeria',
    'Albania',
    'Aland Islands',
    'Afghanistan'
 ];

class BankList {
    constructor(){
        this.filter = {};
        this.permissionFilter = {};
        this.currentUserRole = '';

        this.ArrayLIst = [];
        this.banksNumber = 0;
        this.USD = 1;
        this.solutionNames = [];
        this.container = document.getElementById("table-list");
        this.clearFilter = document.querySelector("#clearFilterBtn");
        this.btnShowFilter = document.querySelector("#showBtn");
        this.buttonSearch = document.getElementById("search-button");
        this.buttonExel = document.querySelector("#dowloadPdf");
        this.containerPages = document.querySelector(".nextPage-block");
        this.openCreatePageBtn = document.querySelector("#createBank-button");
        this.loadingGif = document.querySelector("#loadingGif");
        this.searchInput = document.querySelector("#search-input");
        this.render();
    }

    editBank = async () => {
        const allTd = document.querySelectorAll(".edit");
        allTd.forEach((td) => {
            td.addEventListener("click", () => {
                const bankName = td.parentElement.children[0].textContent;
                window.open("http://18.216.223.81:3000/create-bank?&" + bankName, '_blank');
            });
        });
    }

    openCreatePage = () => {
        // Loading GIF Off
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");

        document.location.href = "http://18.216.223.81:3000/create-bank";
    }

    clearFilters = () => {
        this.filter = {};
        Object.assign(this.filter, this.permissionFilter);

        this.selets = document.querySelectorAll("select");
        this.selets.forEach(item => item.value = "");
        this.searchInput = document.querySelector("#search-input").value = "";

        this.container.innerHTML = "";
        this.containerPages.innerHTML = "";

        this.countNextPage(this.ArrayLIst,  this.banksNumber);
    }

    showFilters = async () => {
        // Loading GIF Off
        this.loadingGif.style.display = "flex";

        this.filter = {};
        Object.assign(this.filter, this.permissionFilter);
        
        const filterMin = document.querySelector("#filterMin").value;
        const filterMax = document.querySelector("#filterMax").value;
        let filterEnable = document.querySelector("#filterEnable").value;
        const filterCountry = document.querySelector("#filterCountry").value;

        // Solution Filter
        if (this.currentUserRole !== 'Solution Manager') {
            const filterSolution = document.querySelector("#filterSolution").value;
            filterSolution !== "" ? this.filter.solution_name = filterSolution : ""; // ID
        }

        // Min Wire Filter
        if (filterMin !== ""){
            this.filter.min_wire = {
                $gte: +(filterMin)
            };
        }

        // Max Wire Filter
        if (filterMax !== ""){
            this.filter.max_wire = {
                $lte: +(filterMax)
            };
        }

        // Enable Filter
        if (filterEnable !== ""){
            filterEnable === "yes" ? filterEnable = true : filterEnable = false;
            this.filter.active = filterEnable;
        }

        // Country Filter
        filterCountry !== "" ? this.filter.country = filterCountry : "";

        // If empty Filter
        var emptyObj = this.checkIsEmptyObj(this.filter);
        if (!emptyObj) {
            const data = {
                filter: this.filter,
                skip: 0,
                limit: 10
            }
            const res = await this.getBanksPartly(data)
            
            // Table cleaning
            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            // If we got Empty Obj from Data Base. 
            if (res.count) {
                this.countNextPage(res.banks, res.count);
            }
        }

        // Loading GIF Off
        this.loadingGif.style.display = "none";
    }

    checkIsEmptyObj = (obj) => {
        for (let key in obj) {
            return false; // wrong
        }
        return true; // is epmty
    }

    downloadExel = () => {
        var tbl = document.getElementById('table-banks');
        var wb = XLSX.utils.table_to_book(tbl, {
            sheet: "Banks table",
            display: true
        });

        var wbout = XLSX.write(wb, {bookType: "xlsx", bookSST: true, type: "binary"});
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'banks.xlsx');
    }

    searchFunction = async () => {
        this.filter = {};
        Object.assign(this.filter, this.permissionFilter);
        
        // Loading GIF On
        this.loadingGif.style.display = "flex";
        document.body.classList.add("modal-open");

        const phrase = document.getElementById('search-input').value;
        this.filter = { $text: { $search: phrase } };

        if (phrase) {
            const data = {
                filter: this.filter,
                skip: 0,
                limit: 10
            };
            const res = await this.getBanksPartly(data);

            this.container.innerHTML = "";
            this.containerPages.innerHTML = "";

            this.countNextPage(res.banks, res.count);
        }

        // Loading GIF Off
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    methodPutEnable = (id, status) => {
        fetch("http://18.216.223.81:3000/putBank", {
                method: "PUT",
                body: JSON.stringify({
                    id: id, //Must be id!
                    active: status //Data which you want to change
                }),
                headers:{'Content-Type': 'application/json'}
                })
                .then(res => {
                    res.text();
                }) 
                .catch(err => {
                    console.log(err);
                });
    }


    disableEnableCheck = () => {
        const btnDisable = document.querySelectorAll(".btnDisable");
        btnDisable.forEach((btn) => {
            btn.addEventListener("click", () => {
                if (btn.textContent === "Disable") {
                    btn.textContent = "Enable";
                    btn.style.background = "#00C851";
                    btn.closest("tr").querySelector('.enableCheck').innerHTML = "<strong>no</strong>";
                    btn.closest("tr").querySelector('.enableCheck').style.color = "#FF4444";
                    const id = btn.closest("tr").querySelector('#bankID').textContent.trim();

                    this.methodPutEnable(id, false);

                } else if (btn.textContent === "Enable") {
                    btn.textContent = "Disable";
                    btn.style.background = "#FF4444";
                    btn.closest("tr").querySelector('.enableCheck').innerHTML = "<strong>yes</strong>";
                    btn.closest("tr").querySelector('.enableCheck').style.color = "#00A542";
                    const id = btn.closest("tr").querySelector('#bankID').textContent.trim();

                    this.methodPutEnable(id, true);
                }
            });
        });
    }

    checkEnable = () => {
        const itemEnables = document.querySelectorAll(".enableCheck");
        itemEnables.forEach((item) => {
            if(item.textContent === "false") {
                item.innerHTML = `<strong>no</strong>`;
                item.style.color = "#FF4444";
                item.closest("tr").querySelector('.btnDisable').innerHTML = "Enable";
                item.closest("tr").querySelector('.btnDisable').style.backgroundColor = "#00C851";
            } else if(item.textContent === "true"){
                item.innerHTML = `<strong>yes</strong>`;
                item.style.color = "#00A542";
                item.closest("tr").querySelector('.btnDisable').innerHTML = "Disable";
                item.closest("tr").querySelector('.btnDisable').style.backgroundColor = "#FF4444";
            }
        });
    }

    renderNextPage = (page) => {
        this.buttonNext = document.createElement("button");
        this.buttonNext.textContent = page;
        this.buttonNext.classList.add("nextPage-btn");
        this.containerPages.appendChild(this.buttonNext);
    }

    
    countNextPage = (arr, numbersOfpages) => {
        this.loadBanks(arr);
        const lastPage = numbersOfpages / 10;

        if(lastPage > 3){
            lastPage !== parseInt(lastPage) ? lastPage = parseInt(lastPage) + 1 : "";
            for (let i = 1; i < 4; i++) {
                this.renderNextPage([i]);
            }
            const dotts = document.createElement("span");
            dotts.textContent = "...";
            dotts.classList.add("dotts");
            this.containerPages.appendChild(this.dotts);
            this.renderNextPage(lastPage);
        } else {
            for (let i = 0; i <= lastPage; i++) {
                this.renderNextPage([i+1]);
            }
        }
        const buttonsPage = document.querySelectorAll(".nextPage-btn");
        buttonsPage[0].classList.add("highlight");
        buttonsPage.forEach((btn) => {
            btn.addEventListener("click", async (event) => {
                // Loading GIF appear and scroll off
                this.loadingGif.style.display = "flex";
                document.body.classList.add("modal-open");

                const currentEvent = +(event.target.textContent);
                const listNumber = ((currentEvent*10)-10);

                const data = {
                    filter: this.filter,
                    skip: listNumber,
                    limit: 10
                };
                const res = await this.getBanksPartly(data);

                // Loading GIF appear and scroll off
                this.loadingGif.style.display = "none";
                document.body.classList.remove("modal-open");

                this.container = document.getElementById("table-list");
                this.container.innerHTML = "";
                
                this.loadBanks(res.banks);

                if( +(btn.textContent) === lastPage && +(btn.textContent) > 1){
                    btn.closest("div").children[0].textContent = lastPage - 3;
                    btn.closest("div").children[1].textContent = lastPage - 2;
                    btn.closest("div").children[2].textContent = lastPage - 1;

                } else if (+(btn.textContent) !== 1 && +(btn.textContent) > +(btn.closest("div").children[1].innerHTML) && +(btn.textContent) < lastPage-1) {
                    const first =  btn.closest("div").children[0].textContent;
                    const second = btn.closest("div").children[1].textContent;
                    const third = btn.closest("div").children[2].textContent;

                    btn.closest("div").children[0].textContent = Number(first)+ 1;
                    btn.closest("div").children[1].textContent = Number(second) + 1;
                    btn.closest("div").children[2].textContent = Number(third) + 1;

                } else if ( +(btn.textContent) !== 1 && +(btn.textContent) < +(btn.closest("div").children[1].innerHTML) && +(btn.textContent) > 1) {
                    const first =  btn.closest("div").children[0].textContent;
                    const second = btn.closest("div").children[1].textContent;
                    const third = btn.closest("div").children[2].textContent;

                    btn.closest("div").children[0].textContent = Number(first) - 1;
                    btn.closest("div").children[1].textContent = Number(second) - 1;
                    btn.closest("div").children[2].textContent = Number(third) - 1;

                } else if( +(btn.textContent) === 1 ){}

                this.checkClickedPages(currentEvent);
            });
        });
    }


    checkClickedPages = (event) => {
        this.buttonsPage = document.querySelectorAll(".nextPage-btn");
        this.buttonsPage.forEach((btn) => {
            event === +(btn.textContent) ? btn.classList.add("highlight") : btn.classList.remove("highlight");;
        });
    };


    renderAllCountry = () => {
        allCountry.sort().forEach((name) => {
            var container = document.querySelector("#filterCountry");
            var option = document.createElement("option");
            option.value = name;
            option.innerHTML = name;
            container.appendChild(option);
        });
    }

    renderSolution = (name, _id) => {
        const container = document.querySelector("#filterSolution");
        const option = document.createElement("option");
        option.value = _id;
        option.innerHTML = name;
        container.appendChild(option);
    }


    permissionSolution = () => {
        const solution_ID = document.querySelector('.curentUserSolution').textContent.trim();
        this.permissionFilter = {'solution_name': solution_ID};
        Object.assign(this.filter, this.permissionFilter);

        // Remove solution filter
        document.querySelector('.filterSolution-block').remove()
    }


    saveLocalBanks = async () => {
        // Permission access for Solution Manager
        this.currentUserRole = document.querySelector('.curentUserRole').textContent.trim();
        if (this.currentUserRole === 'Solution Manager') {
            this.permissionSolution();
        } 

        // Get USD for Load Banks counting
        var currencyInv = await this.getEURexchange("USD", "EUR")
        this.USD = currencyInv.rates.EUR

        // Get 10 banks
        const data = {
            filter: this.filter,
            skip: 0,
            limit: 10
        }
        const res = await this.getBanksPartly(data)

        // Render bank page
        this.banksNumber = res.count
        this.ArrayLIst = res.banks
        
        this.countNextPage(this.ArrayLIst, this.banksNumber)
        this.renderAllCountry()
        
        // Get Solution Manager and render them in filter
        if (this.currentUserRole !== 'Solution Manager') {
            const solutions = await this.getSolutionUsers({'role': 'Solution Manager'})
            solutions.users.forEach(item => this.renderSolution(item.fullname, item._id))
        }
    }


    getSolutionUsers = async (filter) => {
        return  await fetch("http://18.216.223.81:3000/getUserByFilter", {
            method: "POST",
            body: JSON.stringify({filter}),
            headers:{'Content-Type': 'application/json'}
        })
        
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
    }


    getBanksPartly = async (data) => {
        return  await fetch("http://18.216.223.81:3000/get-banks-partly", {
            method: "POST",
            body: JSON.stringify(data),
            headers:{'Content-Type': 'application/json'}
        })
        
        .then(res => {
            return res.json();
        }) 
        .catch(err => {
            console.log(err);
        });
    }


    getEURexchange = async (base, symbols) => {
        return  await fetch(`https://api.exchangeratesapi.io/latest?base=${base}&symbols=${symbols}`)
         .then(res => {
             return res.json();
         }) 
         .catch(err => {
             console.log(err);
         });
    }


    loadBanks = (array) => {
        this.container = document.getElementById("table-list");
        array.forEach((item) => {
            // Counting Before Limit
            var balance_Req = (item.balance_USD.balance_requested * this.USD) + item.balance_EUR.balance_requested;
            var balance_Sent = (item.balance_USD.balance_sent * this.USD) + item.balance_EUR.balance_sent;
            var balance_Received = (item.balance_USD.balance_received * this.USD) + item.balance_EUR.balance_received;
            var beforeLimit = (balance_Req * 25 / 100) + (balance_Sent * 80 / 100) + balance_Received;
            // 
            this.userList = document.createElement("tr");
            this.userList.innerHTML =  `
                    <td class="column1 edit">${item.name}</td> 

                    <td class="column2 edit">
                        <div class="currency_wrapper">
                            <div class="currency_EUR">EUR</div> 
                            <div class="currency_USD">USD</div> 
                        </div>
                    </td>

                    <td class="column3 edit">
                        <div class="currency_wrapper">
                            <div class="currency_EUR">€${item.balance_EUR.balance_requested}</div> 
                            <div class="currency_USD">$${item.balance_USD.balance_requested}</div> 
                        </div>
                    </td> 

                    <td class="column4 edit">
                        <div class="currency_wrapper">
                            <div class="currency_EUR">€${item.balance_EUR.balance_sent}</div> 
                            <div class="currency_USD">$${item.balance_USD.balance_sent}</div> 
                        </div>
                    </td> 

                    <td class="column5 edit">
                        <div class="currency_wrapper">
                            <div class="currency_EUR">€${item.balance_EUR.balance_received}</div> 
                            <div class="currency_USD">$${item.balance_USD.balance_received}</div> 
                        </div>
                    </td>

                    <td class="column6 edit">${Math.round(beforeLimit)}</td>

                    <td class="column7 edit">${item.stop_limit}</td>

                    <td class="column8 edit">${item.min_wire}</td> 
                    <td class="column9 edit">${item.max_wire}</td> 
                    <td class="column10 enableCheck edit">${item.active}</td> 
                    <td class="column11">
                        <button class="btnDisable">Disable</button>
                    </td>
                    <td class="hide" id='bankID'>${item._id}</td>
            `;
            this.container.appendChild(this.userList);
        });
        this.checkEnable();
        this.disableEnableCheck();
        this.editBank();

        // Loading GIF Off
        this.loadingGif.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    render(){
        this.saveLocalBanks();
        this.buttonSearch.addEventListener("click", this.searchFunction);
        this.buttonExel.addEventListener("click", this.downloadExel);
        this.btnShowFilter.addEventListener("click", this.showFilters);
        this.clearFilter.addEventListener("click", this.clearFilters);
        this.openCreatePageBtn.addEventListener("click", this.openCreatePage);

        this.searchInput.addEventListener("keyup", () => {
            event.preventDefault();
            event.keyCode === 13 ? this.searchFunction() : "";
        }); 
    }
};

const banklist = new BankList();