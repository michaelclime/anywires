// input hint

const banedCountry = [
    'Abkhazia',
    'Afghanistan',
    'American Samoa',
    'Angola',
    'Anguilla',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Belize',
    'Bermuda',
    'Bolivia',
    'Bouvet Island',
    'Brunei Darussalam',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cape Verde',
    'Cayman Islands',
    'Central African Republic',
    'Chad',
    'Congo Democratic Republic',
    'Cook Islands',
    'Costa Rica',
    "Cote D'ivoire",
    'Crimea',
    'Cuba',
    'Curacao',
    'Democratic Republic of the Congo',
    'Djibouti',
    'Dominica',
    "Donetsk People's Republic",
    'Ecuador',
    'Egypt',
    'Eritrea',
    'Ethiopia',
    'Gambia',
    'Ghana',
    'Grenada',
    'Guam',
    'Guatemala',
    'Guernsey, C.I.',
    'Guinea (Conakry)',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Iran',
    'Iraq',
    'Isle of Man',
    'Jamaica',
    'Jersey, C.I',
    'Jordan',
    'Kenya',
    'Kyrgyzstan',
    'Labuan',
    "Lao People's Democratic Republic",
    'Lebanon',
    'Liberia',
    'Libya',
    'Macao',
    'Macedonia',
    'Maldives',
    'Mali',
    'Marshall Islands',
    'Mauritius',
    'Myanmar (Burma)',
    'Namibia',
    'Nauru',
    'Nepal',
    'New Caledonia',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Niue',
    'North Korea',
    'Olderne',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Republic of Artsakh (Nagorno-Karabakh Republic)',
    'Rwanda',
    'Saint Helena',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Martin',
    'Saint Pierre and Miquelon',
    'Saint Vincent and The Grenadine',
    'Samoa',
    'São Tomé and Príncipe',
    'Senegal',
    'Seychelles',
    'Sierra Leone',
    'Sint Maarten',
    'Somalia',
    'Somaliland',
    'South Ossetia',
    'South Sudan',
    'Sudan',
    'Syrian Arab Republic',
    'Tahiti',
    'Tajikistan',
    'Tanzania',
    'Togo',
    'Tonga',
    'Transnistria (Pridnestrovian Moldavian Republic)',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkmenistan',
    'Turks and Caicos Islands',
    'Uganda',
    'Ukraine',
    'Valley of Andorra',
    'Vanuatu',
    'Venezuela',
    'Virgin Islands (British)',
    'Virgin Islands, U.S.',
    'Yemen',
    'Zanzibar Island (Unguja)',
    'Zimbabwe'
];

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

$( function() {
   
    $( ".countryInput" ).autocomplete({
      source: allCountry.reverse()
    });
  } );

document.querySelector('.countryInput').addEventListener('change', () => {
    const text = document.querySelector('.countryInput').value;
    
    if ( !allCountry.includes(text) ) {
        document.querySelector('.countryInput').value = '';
        Swal.fire('Please, enter correct name of your country!');
    }

    if (banedCountry.includes(text)) {
        document.querySelector('.countryInput').value = '';
        Swal.fire('Sorry, your country isn\'t serviced!');
    }
});

 // Generate merchants list for selected menu

const curentUserRole = document.querySelector('.curentUserRole').textContent;
const curentUserId = document.querySelector('.curentUserId').textContent;
const currentUserMerchant =  document.querySelector('.currentUserMerchant').textContent.split(',');

if (curentUserRole === 'Crm Admin') {
    let fetchPromise  = fetch('http://18.216.223.81:3000/getMerchantsForInv');
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
} else {
    let fetchPromise  = fetch('http://18.216.223.81:3000/getMerchantsById/' + curentUserId);
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
}
// } else if (currentUserMerchant.length === 1) {
//     console.log(currentUserMerchant)
// }
// Generate banks list for selected menu

let fetchPromise2  = fetch('http://18.216.223.81:3000/getActiveBanks');
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
            let bankList = document.querySelector('#bankList');
          
            if (bankList == null) {
                if ( document.querySelector('#merchList').value !== '' &&
                        document.querySelector('.nameInput').value !== '' &&
                        document.querySelector('.addressInput').value !== '' &&
                        document.querySelector('.countryInput').value !== '' &&
                        document.querySelector('.phoneInput').value !== '' &&
                        document.querySelector('.emailInput').value !== '' &&
                        document.querySelector('.currencyInput').value !== ''
                    ) {
                        var win = window.open();
                        win.location = "/invoice-preview?&" + (number + 1);
                        win.opener = null;
                        win.blur();
                        window.focus();
                }
            } else {
                if ( document.querySelector('#merchList').value !== '' &&
                        document.querySelector('#bankList').value !== '' &&
                        document.querySelector('.nameInput').value !== '' &&
                        document.querySelector('.addressInput').value !== '' &&
                        document.querySelector('.countryInput').value !== '' &&
                        document.querySelector('.phoneInput').value !== '' &&
                        document.querySelector('.emailInput').value !== '' &&
                        document.querySelector('.currencyInput').value !== ''
                    ) {
                        var win = window.open();
                        win.location = "/invoice-preview?&" + (number + 1);
                        win.opener = null;
                        win.blur();
                        window.focus();
                }
            }
            
        });
    });

// Email validation 

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  
  function validateE() {
    const $result = $(".emailInput");
    const email = $(".emailInput").val();
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
  
  $(".emailInput").change(validateE);

  // Phone number validation

  function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return re.test(phone);
  }
  
  function validateP() {
    const $result = $(".phoneInput");
    const phone = $(".phoneInput").val();
    $result.text("");
  
    if (validatePhone(phone)) {
      $result.css("border", " 1px solid green");
    } else {
      $result.val('');
      $result.css("border", " 1px solid red");
      Swal.fire('Please, enter correct phone number!');
    }
    return false;
  }
  
  $(".phoneInput").change(validateP);
  