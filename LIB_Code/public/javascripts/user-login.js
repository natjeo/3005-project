let button = document.getElementById('loginUser');
let sendUser = false;
let sendPassword = false;

button.addEventListener('click', event => {
  let userName = document.getElementById('username').value;
  let passWord = document.getElementById('password').value;

  // error message for fields
  let errMsg = (elementId, msg) => {
    document.getElementById(elementId).innerHTML = msg;
  }
  // required:
  if (userName === "") {
    errMsg("errorMsgName", "* field required");
  } else {
    document.getElementById("errorMsgName").innerHTML = "";
    sendUser = true;
  }
  if (passWord === "") {
    errMsg("errorMsgPassword", "* field required");
  } else {
    document.getElementById("errorMsgPassword").innerHTML = "";
    sendPassword = true;
  }

  if (sendUser && sendPassword) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 202) {
        let landingPage = "/users/" + xhttp.response
        window.location.href = landingPage;
      }
      if (this.readyState == 4 && this.status == 400) {
        if (xhttp.response === "User does not exist") {
          errMsg("errorMsgName", "* username does not exist");
          sendUser = false;
        } else if (xhttp.response === "Password does not match") {
          errMsg("errorMsgPassword", "* incorrect password");
          sendPassword = false;
        }
      }
    }
    let data = {};
    data.username = userName;
    data.password = passWord;
    let json = JSON.stringify(data);

    xhttp.open("POST", "/users/login", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(json);
  }
});
