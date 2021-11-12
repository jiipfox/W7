if (document.readyState !== "loading") {
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    initializeCode();
  });
}

/*router.get('/private', validateToken, (req, res, next) => {
  console.log("accessing private");
  return res.status(200);
});
*/

function initializeCode() {
  document.getElementById("login-form").addEventListener("submit", onSubmit);
  //document.getElementById("logout").addEventListener("click", logout);
}

function onSubmit(event) {
  console.log("Form submitted.");
  event.preventDefault();
  const formData = new FormData(event.target);

  fetch("/login", {
      method: "POST",
      body: formData
  })
      .then((response) => response.json())
      .then((data) => {
        console.log("In client side, token:");
        console.log(data.token);
        storeToken(data.token);
        window.location.href="/";
      })
}


function storeToken(token) {
  localStorage.setItem("auth_token", token);
}


function retrieveToken() {
  return localStorage.getItem("auth_token");
}


function logout(){
  localStorage.removeItem("auth_token");
  window.location.href = "/";
}


 