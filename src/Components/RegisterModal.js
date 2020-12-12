import { RedirectUrl } from "./Router.js";
import Navbar from "./Navbar.js";
import {setUserSessionData} from "../utils/session.js";

/* In a template literal, the ` (backtick), \ (backslash), and $ (dollar sign) characters should be 
escaped using the escape character \ if they are to be included in their template value. 
By default, all escape sequences in a template literal are ignored.*/
let registerPage = `
<div class="modal" id="register" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Register</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <form id="registerform">
        <div class="form-group">
          <label for="email">Email</label>
          <input class="form-control" id="emailregister" type="text" name="email" placeholder="Enter your email" pattern="^\\w+([.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,4})+\$" />
        </div>
        <div class="form-group">
          <label for="username">Username</label>
          <input class="form-control" id="usernameregister" type="text" name="username" placeholder="Enter your username" required=""/>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input class="form-control" id="passwordregister" type="password" name="password" placeholder="Enter your password" required="" pattern=".*[A-Z]+.*" />
          <small id="passwordHelpInline" class="text-muted">
            Must contain at least one upper case.
          </small>
        </div>
        <button class="btn btn-lg btn-block btn-success" id="btnregister" type="submit">Register</button>
        <!-- Create an alert component with bootstrap that is not displayed by default-->
        <div class="alert alert-danger mt-2 d-none" id="messageBoardRegister"></div><span id="errorMessage"></span>
        <div class="alert alert-success mt-2 d-none" id="messageBoardRegisterSucces"></div><span id="errorMessage"></span>
      </form>
      <div class="modal-footer">
        <p>Already have an account ? <a class="text-success" href="#" data-toggle="modal" data-dismiss="modal" data-target="#login">Login</a></p>
      </div>
    </div>
  </div>
</div>`;

const RegisterPage = () => {
  
  let modalregister = document.querySelector("#modalregister");
  modalregister.innerHTML = registerPage;
  let registerForm = document.querySelector("#registerform");
  registerForm.addEventListener("submit", onRegister);
};

const onRegister = (e) => {
  e.preventDefault();
  let user = {
    email: document.getElementById("emailregister").value,
    username: document.getElementById("usernameregister").value,
    password: document.getElementById("passwordregister").value,
  };

  fetch("/api/users/", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    body: JSON.stringify(user), // body data type must match "Content-Type" header
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error code : " + response.status + " : " + response.statusText);
      return response.json();
    })
    .then((data) => onUserRegistration(data))
    .catch((err) => onError(err));
};

const onUserRegistration = (userData) => {
  let messageBoard = document.querySelector("#messageBoardRegisterSucces");
  messageBoard.classList.remove("d-blocks");
  console.log("onUserRegistration", userData);
  const user = {...userData, isAutenticated:true };
  messageBoard.innerHTML = "Registering succeeded !";
  messageBoard.classList.add("d-block");
  setUserSessionData(user);
  // re-render the navbar for the authenticated user
  Navbar();
  RedirectUrl("/");
};

const onError = (err) => {
  let messageBoard = document.querySelector("#messageBoardRegister");
  messageBoard.classList.remove("d-blocks");
  let errorMessage = "";
  if (err.message.includes("409")) errorMessage = "This user is already registered.";
  else errorMessage = err.message;
  messageBoard.innerText = errorMessage;
  // show the messageBoard div (add relevant Bootstrap class)
  messageBoard.classList.add("d-block");  
}; 

export default RegisterPage;
