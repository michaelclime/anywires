
$(document).ready(function(){
    $('.popup-btn').on('click', function(event){
      event.preventDefault();
      $('.popup').fadeIn();
      $('.loginWindow').fadeOut();
    });
    $('.popup-close').on('click', function(event){
      event.preventDefault();
      $('.popup').fadeOut();
      $('.loginWindow').fadeIn();
    });
});

$(document).ready(function(){
  $('.forgotBtn').on('click', function(event){
    event.preventDefault();
    $('.forgotPassword').fadeIn();
    $('.loginWindow').fadeOut();
  });
  $('.forgotPassword-close').on('click', function(event){
    event.preventDefault();
    $('.forgotPassword').fadeOut();
    $('.loginWindow').fadeIn();
  });
});

// Alert modal window
const alertWindow = document.querySelector('.alert');
if (alertWindow) {
  alertWindow.addEventListener("click", (event) => {
      event.target === alertWindow ? alertWindow.style.display = "none" : "";
  });
}
