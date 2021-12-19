let button = document.getElementById('createNewUser');
let sendReady = 0;

button.addEventListener('click', event => {
  let firstName = document.getElementById('firstName').value;
  let lastName = document.getElementById('lastName').value;
  let phone = document.getElementById('phone').value;
  let email = document.getElementById('email').value;
  let passWord = document.getElementById('password').value;

  let errMsg = (elementId, msg) => {
    document.getElementById(elementId).innerHTML = msg;
  }

  // required:
  if (firstName == null || firstName == "") {
    errMsg("errorMsgfName", "* field required");
  } else {
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      errMsg("errorMsgfName", "* first name must be valid");
    } else {
      document.getElementById("errorMsgfName").innerHTML = "";
      sendReady++;
    }
  }
  if (lastName == null || lastName == "") {
    errMsg("errorMsglName", "* field required");
  } else {
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      errMsg("errorMsglName", "* last name must be valid");
    } else {
      document.getElementById("errorMsglName").innerHTML = "";
      sendReady++;
    }
  }
  if (phone == null || phone == "") {
    errMsg("errorMsgphone", "* field required");
  } else {
    if (!/^[0-9]{10}$/.test(phone)) {
      errMsg("errorMsgphone", "* phone must be 10 digit integers");
    } else {
      document.getElementById("errorMsgphone").innerHTML = "";
      sendReady++;
    }
  }
  if (email == null || email == "") {
    errMsg("errorMsgEmail", "* field required");
  } else {
    if (!/^\S+@\S+$/.test(email)) {
      errMsg("errorMsgEmail", "* not a valid email address");
    } else {
      document.getElementById("errorMsgEmail").innerHTML = "";
      sendReady++;
    }
  }
  if (passWord == null || passWord == "") {
    errMsg("errorMsgPassword", "* field required");
  } else {
    document.getElementById("errorMsgPassword").innerHTML = "";
    sendReady++;
  }

  // if fields are good, send request
  if (sendReady===5) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

        // login new user
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 202) {
            let landingPage = "/users/" + xhttp.response
            window.location.href = landingPage;
          }
        }
        let data = {};
        data.username = email;
        data.password = passWord;
        let json = JSON.stringify(data);
        xhttp.open("POST", "/users/login", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(json);

      }
      if (this.readyState == 4 && this.status == 400) {
        errMsg("errorMsgEmail", "* email already exists");
      }
    }
    let data = {};
    data.firstName = firstName;
    data.lastName = lastName;
    data.phone = phone;
    data.email = email;
    data.password = passWord;
    let json = JSON.stringify(data);

    xhttp.open("POST", "/users", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(json);
  } else {
    sendReady=0;
  }
});
