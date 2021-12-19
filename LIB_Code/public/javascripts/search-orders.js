let button = document.getElementById('findOrderButton');
let sendReady = false;

button.addEventListener('click', event => {
  let orderLookup = document.getElementById('input-order').value;
  // error message for fields
  let errMsg = (elementId, msg) => {
    document.getElementById(elementId).innerHTML = msg;
  }
  // required:
  if (parseInt(orderLookup)) {
    document.getElementById("errMsgOrderID").innerHTML = "";
    sendReady = true;
  } else if (orderLookup==='') {
    document.getElementById("errMsgOrderID").innerHTML = "";
    sendReady = false;
  } else {
    errMsg("errMsgOrderID", "not a valid order id.");
    sendReady = false;
  }

  if (sendReady) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 201) {
        let landingPage = "/orders/" + xhttp.response
        window.location.href = landingPage;
      } else if (this.readyState == 4 && this.status == 500){
        errMsg("errMsgOrderID", "Order id does not exist in database.");
        sendReady = false;
      }
    }
    let data = {};
    data.orderLookup = orderLookup;
    let json = JSON.stringify(data);

    xhttp.open("PUT", "/orders", true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(json);
  }
});
