let getAnalyticsButton = document.getElementById('getAnalytics');
let table = document.getElementById('displayTable');
let getAnalytics = false;

if (getAnalyticsButton) {
  getAnalyticsButton.addEventListener('click', event => {
    while(table.hasChildNodes())
    {
       table.removeChild(table.firstChild);
    }

    let selectAnalyticsDropdown = document.getElementById('selectAnalytics').value;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          let tableData = JSON.parse(xhttp.response)

          // generate table header rows
          function generateTableHead(table, data) {
            let thead = table.createTHead();
            let row = thead.insertRow();
            for (let key of data) {
              let th = document.createElement("th");
              let text = document.createTextNode(key);
              th.appendChild(text);
              row.appendChild(th);
            }
          }
          // generate table data rows
          function generateTable(table, data) {
            for (let element of data) {
              let row = table.insertRow();
              for (key in element) {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);
                cell.appendChild(text);
              }
            }
          }
          let data = Object.keys(tableData[0]);
          generateTableHead(table, data);
          generateTable(table, tableData);
        }
    }
    let data = {};
    data.selectedAnalytics = selectAnalyticsDropdown;
    let json = JSON.stringify(data);

    xhttp.open("PUT", "/users", true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(json);
  });
}
