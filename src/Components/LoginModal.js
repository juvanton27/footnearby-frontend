/* In a template literal, the ` (backtick), \ (backslash), and $ (dollar sign) characters should be 
escaped using the escape character \ if they are to be included in their template value. 
By default, all escape sequences in a template literal are ignored.*/
import {getUserSessionData, setUserSessionData} from "../utils/session.js";
import { RedirectUrl } from "./Router.js";
import Navbar from "./Navbar.js";


let loginPage = `
<div class="modal" id="login" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Login</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <form id="loginform">
        <div class="form-group">
          <label for="username">Username</label>
          <input class="form-control" id="usernamelogin" type="text" name="username" placeholder="Enter your username" required="" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input class="form-control" id="passwordlogin" type="password" name="password" placeholder="Enter your password" required="" pattern=".*[A-Z]+.*" />
        </div>
        <button class="btn btn-lg btn-block btn-success" id="btnlogin" type="submit">Login</button>
        <!-- Create an alert component with bootstrap that is not displayed by default-->
        <div class="alert alert-danger mt-2 d-none" id="messageBoardLogin"></div>
        <div class="alert alert-success mt-2 d-none" id="messageBoardLoginSucces"></div>
      </form>
      <div class="modal-footer">
        <p>Don't have an account ? <a class="text-success" href="#" data-toggle="modal" data-dismiss="modal" data-target="#register">Register</a></p>
      </div>
    </div>
  </div>
</div>`;

const LoginPage = () => {
  
  let modallogin = document.querySelector("#modallogin");
  modallogin.innerHTML = loginPage;
  let loginForm = document.querySelector("#loginform");
  const user = getUserSessionData();
  if (user) {
    // re-render the navbar for the authenticated user
    Navbar();
    RedirectUrl("/");
  } else
    loginForm.addEventListener("submit", onLogin);
};

const onLogin = (e) => {
  e.preventDefault();
  let username = document.getElementById("usernamelogin");
  let password = document.getElementById("passwordlogin");

  let user = {
    username: document.getElementById("usernamelogin").value,
    password: document.getElementById("passwordlogin").value,
  };

  fetch("/api/users/login", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    body: JSON.stringify(user), // body data type must match "Content-Type" header
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(
          "Error code : " + response.status + " : " + response.statusText
        );
      return response.json();
    })
    .then((data) => onUserLogin(data))
    .catch((err) => onError(err));
};

const onUserLogin = (userData) => {
  let messageBoard = document.querySelector("#messageBoardLoginSucces");
  messageBoard.classList.remove("d-blocks");
  console.log("onUserLogin:", userData);
  const user = { ...userData, isAutenticated: true };
  setUserSessionData(user);
  // re-render the navbar for the authenticated user
  Navbar();
  RedirectUrl("/");
  messageBoard.innerHTML = "Login succeeded !";
  messageBoard.classList.add("d-block");  
};

const onError = (err) => {
  let messageBoard = document.querySelector("#messageBoardLogin");
  messageBoard.classList.remove("d-blocks");
  let errorMessage = "";
  if (err.message.includes("401")) errorMessage = "Wrong username or password.";
  else errorMessage = err.message;
  messageBoard.innerText = errorMessage;
  // show the messageBoard div (add relevant Bootstrap class)
  messageBoard.classList.add("d-block");
};



export default LoginPage;
