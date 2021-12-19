let addButton = document.getElementById("addtocart");
let removeButton = document.getElementById("removeBook");

let data = {};
let pathArray = window.location.pathname.split('/');
data.isbn = pathArray[2];
let json = JSON.stringify(data);

// handle add to cart
if (addButton) {
  addButton.addEventListener('click', event => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 202) {
        alert("Item added to cart.")
      }
      if (this.readyState == 4 && this.status == 404) {
        alert("Sorry, not enough stock. Item can't be added to cart.")
      }

    }

    xhttp.open("PUT", "/books", true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(json);
  })
}

if (removeButton){
  removeButton.addEventListener('click', event => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 202) {
        alert("Book Deleted.")
        window.location.href = "/books";
      }
    }

    xhttp.open("POST", "/books", true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(json);
  })
}
