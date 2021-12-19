let logout = document.getElementById("logout");

// toggle profile dropdown menu
let profileButton = document.getElementById('profileMenu');
profileButton.addEventListener('click', event => {
    var element = document.getElementById("menuItems");
    element.classList.toggle("active");
    var element = document.getElementById("dropdown");
    element.classList.toggle("active");
});

// handle logout
if (logout) {
    logout.addEventListener('click', event => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                window.location.href = "/";
            }
        }
        xhttp.open("PUT", "/users/login", true);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhttp.send();
    });
}
