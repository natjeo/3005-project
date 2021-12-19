let findButton = document.getElementById('findBookButton');
let findRes = false;

findButton.addEventListener('click', event => {
  let keyword = document.getElementById('input-text').value;
  let tableSelect = document.getElementById('dropdownTable').value;

  // error message for fields
  let errMsg = (elementId, msg) => {
    document.getElementById(elementId).innerHTML = msg;
  }
  // required:
  if (keyword==='') {
    errMsg("errFind", "Field cannot be blank.");
    findRes = false;
  } else {
    document.getElementById("errFind").innerHTML = "";
    findRes = true;
  }

  if (findRes) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 202) {
        let landingPage = "/searchResult"
        window.location.href = landingPage;
      } else if (this.readyState == 4 && this.status == 500){
        errMsg("errFind", "Sorry, no matches were found.");
        findRes = false;
      }
    }
    let data = {};
    data.keyword = keyword;
    data.tableSelect = tableSelect;
    let json = JSON.stringify(data);

    xhttp.open("PUT", "/books/searchResult", true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(json);
  }
});
