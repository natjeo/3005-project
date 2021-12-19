let cartToCheckout_Button = document.getElementById("CheckOutButton");
let checkbox = document.querySelector("input[name=billingShipping]");
let createOrderButton = document.getElementById("createOrderButton");
let bil_and_ship_equal = false;

// handle add to cart
if (cartToCheckout_Button) {
  cartToCheckout_Button.addEventListener('click', event => {
    window.location.href = "/cart/checkout";
  })
}

// handle checkout
if (createOrderButton) {

  // If the checkbox is unchecked, display fields
  checkbox.addEventListener('change', function () {
    if (this.checked) {
      // billing is same as shipping
      document.getElementById("hide").style.display = "none";
      bil_and_ship_equal = true;
    } else {
      // biling and shipping are separate
      document.getElementById("hide").style.display = "block";
      bil_and_ship_equal = false;
    }
  })

  // Order button is pressed
  createOrderButton.addEventListener('click', event => {

    var s_street = document.getElementById("s_street").value;
    var s_city = document.getElementById("s_city").value;
    var s_state = document.getElementById("s_state").value;
    var s_postal = document.getElementById("s_postal").value;
    var s_country = document.getElementById("s_country").value;

    if (bil_and_ship_equal){
      var s_isBilling = true;
      var s_isShipping = true;
    } else {
      // billing != shipping
      var s_isBilling = false;
      var s_isShipping = true;

      var b_street = document.getElementById("b_street").value;
      var b_city = document.getElementById("b_city").value;
      var b_state = document.getElementById("b_state").value;
      var b_postal = document.getElementById("b_postal").value;
      var b_country = document.getElementById("b_country").value;
      var b_isBilling = true;
      var b_isShipping = false;
    }

    // prepare and send request
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 201) {
        let landingpage = "/orders/"+xhttp.response;
        window.location.href = landingpage;
      }
    }
    let data = {};
    data.s_street = s_street;
    data.s_city = s_city;
    data.s_state = s_state;
    data.s_postal = s_postal;
    data.s_country = s_country;
    data.s_isBilling = s_isBilling;
    data.s_isShipping = s_isShipping;

    if (bil_and_ship_equal === false){
      data.b_street = b_street;
      data.b_city = b_city;
      data.b_state = b_state;
      data.b_postal = b_postal;
      data.b_country = b_country;
      data.b_isBilling = b_isBilling;
      data.b_isShipping = b_isShipping;
    }

    let json = JSON.stringify(data);

    xhttp.open("POST", "/orders", true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(json);
  })
}
