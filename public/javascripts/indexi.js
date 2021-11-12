
if (document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCode();
    });
  }

  function initializeCode() {
      noLogIn();
  }


function yesLogIn(){
    const diver = document.getElementById("deppista");
    const btn = document.createElement("button");
    btn.innerHTML = "Logout";

    const para = document.createElement("p");
    const node = document.createTextNode("email: ");

    para.appendChild(node);
    diver.appendChild(btn);
    diver.appendChild(para);
}

function noLogIn(){
    const diver = document.getElementById("deppista");

    const a = document.createElement('a');
    const b = document.createElement('a');
    let linkText = document.createTextNode("Register");
    a.appendChild(linkText);
    a.title = "register";
    a.href = "localhost:1234/register.html";
    diver.appendChild(a);

    const para = document.createElement("p");
    diver.appendChild(para);
    
    let linkText2 = document.createTextNode("Login");
    b.appendChild(linkText2);
    b.title = "login";
    b.href = "localhost:1234/login.html";
    diver.appendChild(b);
}


function logout(){
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  }
  
function retrieveToken() {
    return localStorage.getItem("auth_token");
}
  