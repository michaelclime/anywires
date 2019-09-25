window.onload = function () {
    this.document.getElementById("reports").onclick = function () {
        var blocks = document.getElementById("allReports");
        if ( blocks.style.display == "block") {
            blocks.style.display = "none";
        } else {
            blocks.style.display = "block";
        }
    }
}