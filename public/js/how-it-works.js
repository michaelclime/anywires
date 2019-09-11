
const elemBtn = document.querySelector(".faqButtons"); 
var selectedA;
elemBtn.onclick = function(event) {
    var target = event.target; // где был клик?
   
    if (target.tagName != 'A') return; // не на TD? тогда не интересует
   
    highlight(target); // подсветить TD
   };
   
   function highlight(node) {
    if (selectedA) {
        selectedA.classList.remove('activeBtn');
    }
    selectedA = node;
    selectedA.classList.add('activeBtn');
   }
document.getElementById("1").onclick = function () {
    document.getElementsByClassName("statusContent")[0].style.display = 'block';
    document.getElementsByClassName("documentContent")[0].style.display = 'none';
    document.getElementsByClassName("ibanContent")[0].style.display = 'none';
    document.getElementsByClassName("sepaContent")[0].style.display = 'none';
}
document.getElementById("2").onclick = function () {
    document.getElementsByClassName("statusContent")[0].style.display = 'none';
    document.getElementsByClassName("documentContent")[0].style.display = 'block';
    document.getElementsByClassName("ibanContent")[0].style.display = 'none';
    document.getElementsByClassName("sepaContent")[0].style.display = 'none';
}
document.getElementById("3").onclick = function () {
    document.getElementsByClassName("statusContent")[0].style.display = 'none';
    document.getElementsByClassName("documentContent")[0].style.display = 'none';
    document.getElementsByClassName("ibanContent")[0].style.display = 'block';
    document.getElementsByClassName("sepaContent")[0].style.display = 'none';
}
document.getElementById("4").onclick = function () {
    document.getElementsByClassName("statusContent")[0].style.display = 'none';
    document.getElementsByClassName("documentContent")[0].style.display = 'none';
    document.getElementsByClassName("ibanContent")[0].style.display = 'none';
    document.getElementsByClassName("sepaContent")[0].style.display = 'block';
}