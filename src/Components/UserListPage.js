import { RedirectUrl } from "./Router.js";
import { getUserSessionData } from "../utils/session.js";
import { setLayout } from "../utils/render.js";

let page = document.querySelector("#page");

const UserListPage = () => {
  setLayout("List of users");
  const user = getUserSessionData();
  if (!user.user.admin) RedirectUrl("/error", "Resource not authorized. Please login.");
  
  
  fetch("/api/users", {
    method: "GET",
    headers: {
      Authorization: user.token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        let fullErrorMessage =
          " Error code : " +
          response.status +
          " : " +
          response.statusText +
          "/nMessage : ";
        return response.text().then((errorMessage) => {
          fullErrorMessage += errorMessage;
          return fullErrorMessage;
        });
      }
      return response.json();
    })
    .then((data) => {
      if (typeof data === "string") onError(data);
      else {
        onUserList(data);
        document.querySelectorAll(".deletebtn").forEach(e => e.addEventListener("click", onDelete));
       
      }
    })
    .catch((err) => onError(err));

    
    
};



const onUserList = (data) => {
  
  let userListPage = `<div class="user">
  <h5>List of Users</h5>
<ul class="list-group list-group-flush">`;
  let userList = document.querySelector("ul");
  
  // Neat way to loop through all data in the array, create a new array of string elements (HTML li tags)
  // with map(), and create one string from the resulting array with join(''). '' means that the separator is a void string.
  userListPage += data
    .map((user) => `<li class="userText">${user.username} <td><button class="deletebtn" id="${user.username}" type="submit" >delete</button></td> </li>`)
    .join("");
  
  userListPage += "</ul></div>";
  
  
  
  return (page.innerHTML = userListPage);
  
};

const onDelete = (e) => {
  // the id is given in the current table row under data-id attribute
  
   const userId = e.target.id;
   
  const user = getUserSessionData();
  fetch("/api/users/" + userId, {
    method: "DELETE",
    headers: {
      Authorization: user.token,
    },
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(
          "Error code : " + response.status + " : " + response.statusText
        );
      return response.json();
    })
    .then((data) => UserListPage())
    .catch((err) => onError(err));
};

const onError = (err) => {
  console.error("UserListPage::onError:", err);
  let errorMessage;
  if (err.message) {
    errorMessage = err.message;
  } else errorMessage = err;
  if (errorMessage.includes("jwt expired")) errorMessage += "<br> Please logout first, then login.";
  RedirectUrl("/error", errorMessage);
};



export default UserListPage;
