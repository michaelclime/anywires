// class resetPassword {
//     constructor(){
//         this.butnShow = document.querySelector(".button-reset");
//         this.showBtn = document.querySelector("#showPass");
//         this.checkerInput = document.querySelector("#checkerInput");
//         this.render();
//     };

//     locationPage(){
        
//     }

//     toogleCheckBox(){
//             this.checkBox = document.querySelector("#showPassInput");
//             this.checkBox.checked === false ? this.checkBox.checked = true : this.checkBox.checked = false;
//     };

//     showPassword(){
//         this.checkBox = document.querySelector("#showPassInput");
//         this.pwd = document.getElementById("input_oldPassword");
//         this.confirm = document.getElementById("input_newPassword");
//         if (this.pwd.type === "password") {                  
//             this.pwd.type = "text";              
//             this.confirm.type = "text";  
//             setTimeout(() =>{
//                 this.pwd.type = "password";         
//                 this.confirm.type = "password"; 
//                 this.checkBox.checked = false;
//             }, 2000);             
//         } else {                               
//             this.pwd.type = "password";         
//             this.confirm.type = "password";    
                     
//         }
        
//     };

//     hideBlock(){
//         jQuery(function($){
//             $(document).mouseup(function (e){ // событие клика по веб-документу
//                 var div = $(".modal-reset"); // тут указываем ID элемента
//                 if (!div.is(e.target) // если клик был не по нашему блоку
//                     && div.has(e.target).length === 0) { // и не по его дочерним элементам
//                     div.hide(); // скрываем его
//                     $("#wrapper").removeClass("shadow");
//                     $( "#input_oldPassword" ).val("");
//                     $( "#input_newPassword" ).val("");
//                 }
//             });
//         });
//     };

//     showBlock(){
//         this.modalWindow = document.querySelector(".modal-reset");
//         this.modalWindow.style.display = "flex";
//         this.modalWindow.classList.add("slide-top");
//         this.wrapper = document.querySelector("#wrapper");
//         this.wrapper.classList.add("shadow");
//     };

//     render(){
//         this.checkerInput.addEventListener("click",this.toogleCheckBox);
//         this.showBtn.addEventListener("click", this.showPassword);
//         this.butnShow.addEventListener("click", this.showBlock);
//         this.hideBlock();
//     };
// };

// const btn = new resetPassword();

// // Action on inputs inside "Reset password" button
// const buttonLogIn = document.querySelector(".change-password-btn");
// var password = "admin";

// function finalModal(){
//     let modalWindow = document.querySelector(".modal-reset");
//     modalWindow.style.display = "none";
//         function createFinalModal(){
//             const container = document.querySelector("#container");
//             const wrapper = document.querySelector("#wrapper");
//             container.style.display = "flex";
//             container.classList.add("slide-top");
//             setTimeout(() => {
//                 container.style.display = "none";
//                 wrapper.classList.remove("shadow");
//             }, 2500)
//         }
//         createFinalModal();
// };

// buttonLogIn.addEventListener("click", () => {
//     const inputOld = document.querySelector("#input_oldPassword").value;
//     const inputNew = document.querySelector("#input_newPassword").value;
//     if (inputOld === password) {
//         finalModal();
//         password = inputNew;
//         console.log(password);
//     } else {
//         alert("Wrong Password");
//     }
// });

// Alert modal window
const alertWindow = document.querySelector('.alert');
if (alertWindow) {
  alertWindow.addEventListener("click", (event) => {
      event.target === alertWindow ? alertWindow.style.display = "none" : "";
  });
}
