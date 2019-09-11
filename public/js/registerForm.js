const creatUserBtn = document.querySelector('.creatUserBtn');

creatUserBtn.addEventListener('click', (e) => { 
    document.querySelector(".main-form").innerHTML = `
        <h3 class="congrtTitile">User successfully created!</h3>
        <a href='/'> Back to the main page</a>
    `;
});