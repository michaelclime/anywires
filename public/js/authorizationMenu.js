const authorizationMenu = document.querySelector('.authorizationMenu'),
        profileButton = document.querySelector('.profile'),
        merchantButton = document.querySelector('.merchant'),
        logOutButton = document.querySelector('.logOut');

// profileButton.onclick = function() {
//     document.location.href='dashBoardMainPage.html';
// };

merchantButton.onclick = function() {
    document.location.href='merchants.html';
};

logOutButton.onclick = function() {
    document.location.href='http://localhost:3000/logout';
};

authorizationMenu.onmouseenter = function() {
    document.querySelector('.dropMenu').style.display = 'flex';
};

authorizationMenu.onmouseleave = function() {
    document.querySelector('.dropMenu').style.display = 'none';
};