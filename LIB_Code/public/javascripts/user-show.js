// xml request
let sendUserUpdate = (data) => {
  let json = JSON.stringify(data);
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 202) {
      location.reload();
    }
  }
  xhttp.open("PUT", "/users", true);
  xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhttp.send(json);
};
