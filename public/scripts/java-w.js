var pageTimeOut;

function myFunction() {
    pageTimeOut = setTimeout(showPage, 1500);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("name").style.display = "block";
}