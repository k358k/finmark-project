document
.getElementById("login-form")
.addEventListener("submit", function(event){

    event.preventDefault();

    document.getElementById("login-message").innerHTML =
    "✓ Login request sent successfully";

});