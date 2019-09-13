
$(document).ready(function(){
    $('.popup-btn').on('click', function(event){
      event.preventDefault();
      $('.popup').fadeIn();
      $('.loginWindow').fadeOut();
    });
    $('.popup-close').on('click', function(event){
      event.preventDefault();
      $('.popup').fadeOut();
    });
});

$(document).ready(function(){
    $('.loginWindow-btn').on('click', function(event){
      event.preventDefault();
      $('.loginWindow').fadeIn();
    });
    $('.loginWindow-close').on('click', function(event){
      event.preventDefault();
      $('.loginWindow').fadeOut();
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
  });
});

$(document).ready(function(){
  $('.step1').on('click', function(){
    $('.dropdown1').css('display', 'flex');
    $('.dropdown2').css('display', 'none');
    $('.dropdown3').css('display', 'none');
    $('.dropdown4').css('display', 'none');
    $('.dropdown5').css('display', 'none');
    $('.dropdown6').css('display', 'none');
    $('.dropdown7').css('display', 'none');
    $('.stepBtn1').css('background', 'rgb(200, 200, 200)');
    $('.stepBtn2').css('background', '#FFF');
    $('.stepBtn3').css('background', '#FFF');
    $('.stepBtn4').css('background', '#FFF');
    $('.stepBtn5').css('background', '#FFF');
    $('.stepBtn6').css('background', '#FFF');
    $('.stepBtn7').css('background', '#FFF');
  });
});

$(document).ready(function(){
  $('.step2').on('click', function(){
    $('.dropdown1').css('display', 'none');
    $('.dropdown2').css('display', 'flex');
    $('.dropdown3').css('display', 'none');
    $('.dropdown4').css('display', 'none');
    $('.dropdown5').css('display', 'none');
    $('.dropdown6').css('display', 'none');
    $('.dropdown7').css('display', 'none');
    $('.stepBtn1').css('background', '#FFF');
    $('.stepBtn2').css('background', 'rgb(200, 200, 200)');
    $('.stepBtn3').css('background', '#FFF');
    $('.stepBtn4').css('background', '#FFF');
    $('.stepBtn5').css('background', '#FFF');
    $('.stepBtn6').css('background', '#FFF');
    $('.stepBtn7').css('background', '#FFF');
  });
});

$(document).ready(function(){
  $('.step3').on('click', function(){
    $('.dropdown1').css('display', 'none');
    $('.dropdown2').css('display', 'none');
    $('.dropdown3').css('display', 'flex');
    $('.dropdown4').css('display', 'none');
    $('.dropdown5').css('display', 'none');
    $('.dropdown6').css('display', 'none');
    $('.dropdown7').css('display', 'none');
    $('.stepBtn1').css('background', '#FFF');
    $('.stepBtn2').css('background', '#FFF');
    $('.stepBtn3').css('background', 'rgb(200, 200, 200)');
    $('.stepBtn4').css('background', '#FFF');
    $('.stepBtn5').css('background', '#FFF');
    $('.stepBtn6').css('background', '#FFF');
    $('.stepBtn7').css('background', '#FFF');
  });
});

$(document).ready(function(){
  $('.step4').on('click', function(){
    $('.dropdown1').css('display', 'none');
    $('.dropdown2').css('display', 'none');
    $('.dropdown3').css('display', 'none');
    $('.dropdown4').css('display', 'flex');
    $('.dropdown5').css('display', 'none');
    $('.dropdown6').css('display', 'none');
    $('.dropdown7').css('display', 'none');
    $('.stepBtn1').css('background', '#FFF');
    $('.stepBtn2').css('background', '#FFF');
    $('.stepBtn3').css('background', '#FFF');
    $('.stepBtn4').css('background', 'rgb(200, 200, 200)');
    $('.stepBtn5').css('background', '#FFF');
    $('.stepBtn6').css('background', '#FFF');
    $('.stepBtn7').css('background', '#FFF');
  });
});

$(document).ready(function(){
  $('.step5').on('click', function(){
    $('.dropdown1').css('display', 'none');
    $('.dropdown2').css('display', 'none');
    $('.dropdown3').css('display', 'none');
    $('.dropdown4').css('display', 'none');
    $('.dropdown5').css('display', 'flex');
    $('.dropdown6').css('display', 'none');
    $('.dropdown7').css('display', 'none');
    $('.stepBtn1').css('background', '#FFF');
    $('.stepBtn2').css('background', '#FFF');
    $('.stepBtn3').css('background', '#FFF');
    $('.stepBtn4').css('background', '#FFF');
    $('.stepBtn5').css('background', 'rgb(200, 200, 200)');
    $('.stepBtn6').css('background', '#FFF');
    $('.stepBtn7').css('background', '#FFF');
  });
});

$(document).ready(function(){
  $('.step6').on('click', function(){
    $('.dropdown1').css('display', 'none');
    $('.dropdown2').css('display', 'none');
    $('.dropdown3').css('display', 'none');
    $('.dropdown4').css('display', 'none');
    $('.dropdown5').css('display', 'none');
    $('.dropdown6').css('display', 'flex');
    $('.dropdown7').css('display', 'none');
    $('.stepBtn1').css('background', '#FFF');
    $('.stepBtn2').css('background', '#FFF');
    $('.stepBtn3').css('background', '#FFF');
    $('.stepBtn4').css('background', '#FFF');
    $('.stepBtn5').css('background', '#FFF');
    $('.stepBtn6').css('background', 'rgb(200, 200, 200)');
    $('.stepBtn7').css('background', '#FFF');
  });
});

$(document).ready(function(){
  $('.step7').on('click', function(){
    $('.dropdown1').css('display', 'none');
    $('.dropdown2').css('display', 'none');
    $('.dropdown3').css('display', 'none');
    $('.dropdown4').css('display', 'none');
    $('.dropdown5').css('display', 'none');
    $('.dropdown6').css('display', 'none');
    $('.dropdown7').css('display', 'flex');
    $('.stepBtn1').css('background', '#FFF');
    $('.stepBtn2').css('background', '#FFF');
    $('.stepBtn3').css('background', '#FFF');
    $('.stepBtn4').css('background', '#FFF');
    $('.stepBtn5').css('background', '#FFF');
    $('.stepBtn6').css('background', '#FFF');
    $('.stepBtn7').css('background', 'rgb(200, 200, 200)');
  });
});

// Alert modal window
const alertWindow = document.querySelector('.alert');
if (alertWindow) {
  alertWindow.addEventListener("click", (event) => {
      event.target === alertWindow ? alertWindow.style.display = "none" : "";
  });
}
