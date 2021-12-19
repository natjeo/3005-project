let addButton = document.getElementById("createBook");

// handle add to cart
if (addButton) {
  addButton.addEventListener('click', event => {
    var isbn = document.getElementById("isbn").value;
    var title = document.getElementById("title").value;
    var year = document.getElementById("year").value;
    var price = document.getElementById("price").value;
    var price = document.getElementById("royalties").value;
    var numPages = document.getElementById("numPages").value;
    var stockQty = document.getElementById("stockQty").value;

    var a_fname = document.getElementById("a_firstname").value;
    var a_lname = document.getElementById("a_lastName").value;

    var compname = document.getElementById("compname").value;
    var p_phone = document.getElementById("p_phone").value;
    var p_email = document.getElementById("p_email").value;
    var bankaccount = document.getElementById("p_bankAccount").value;

    var genre = document.getElementById("genre").value;
    // error message for fields
    let errMsg = (elementId, msg) => {
      document.getElementById(elementId).innerHTML = msg;
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 202) {
        window.location.href = "/books/"+xhttp.response;
      }
      if (this.readyState == 4 && this.status == 404) {
        errMsg("errorMsgISBN", "* isbn already in database");
      }
    }

    let data = {};
    // book info
    data.isbn = isbn;
    data.title = title;
    data.year = year;
    data.price = price;
    data.numPages = numPages;
    data.stockQty = stockQty;
    // author info
    data.a_fname = a_fname;
    data.a_lname = a_lname;
    // publisher info
    data.compname = compname;
    data.p_phone = p_phone;
    data.p_email = p_email;
    data.bankaccount = bankaccount;

    // genre info
    data.genre = genre;

    let json = JSON.stringify(data);

    xhttp.open("POST", "/books/new", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(json);
  })
}
