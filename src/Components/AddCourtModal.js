import { RedirectUrl } from "./Router.js";
import {getUserSessionData} from "../utils/session.js";


let addCourtPage = `
<div class="modal" id="add" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add a playground</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="addform">
        <div class="form-group">
            <input
              class="form-control"
              type="text"
              name="title"
              id="title"
              placeholder="Title (ex: Fit-Five Brussels)"
              required
            />
        </div>
        <div class="form-group">
            <input
              class="form-control"
              type="text"
              name="adress"
              id="adress"
              placeholder="Adress (ex: Rue Tielemans 2)"
              required
            />
        </div>
        <div class="form-group">
            <input
              class="form-control"
              type="text"
              name="city"
              id="city"
              placeholder="City (ex: Brussels 1020)"
              required
            />
        </div>
        <div class="btn-group btn-block btn-group-toggle" data-toggle="buttons">
          <label class="btn btn-success">
            <input 
              class="form-control"
              type="radio" 
              name="optionsSynthetic" 
              id="option1Synthetic" checked> 
              Synthetic
          </label>
          <label class="btn btn-success">
            <input 
              class="form-control"
              type="radio" 
              name="optionsSynthetic" 
              id="option2Synthetic"> 
              Grass
          </label>
        </div>
        <div class="btn-group btn-block btn-group-toggle" data-toggle="buttons">
          <label class="btn btn-success">
            <input 
              class="form-control"
              type="radio" 
              name="optionsLight" 
              id="option1Light" checked> 
              Light
          </label>
          <label class="btn btn-success">
            <input 
              class="form-control"
              type="radio" 
              name="optionsLight" 
              id="option2Light"> 
              No light
          </label>
        </div>
        <div class="btn-group btn-block btn-group-toggle" data-toggle="buttons">
          <label class="btn btn-success">
            <input 
              class="form-control"
              type="radio" 
              name="optionsCover" 
              id="option1Cover" checked> 
              Covered
          </label>
          <label class="btn btn-success">
            <input 
              class="form-control"
              type="radio" 
              name="optionsCover" 
              id="option2Cover"> 
              Not covered
          </label>
        </div>
        <center><div class="form-group">
          <label>
            <input type="file" 
              id="image"
              style="display: none;">
              <!--<br/>
            <p id="uploadlink" class="text-success">Upload Photo link</p>-->
          </label>
       </div></center>
        <button class="btn btn-lg btn-block btn-success" id="btnadd" type="submit">Add a Playground</button>
        <!-- Create an alert component with bootstrap that is not displayed by default-->
        <div class="alert alert-danger mt-2 d-none" id="messageBoardAddFail"></div><span id="errorMessage"></span>
        <div class="alert alert-success mt-2 d-none" id="messageBoardAddSucces"></div><span id="errorMessage"></span>
        </form>
        <div class="modal-footer">
        <p></p>
      </div>
    </div>
  </div>
</div>`;

const AddCourtModal = () => {
  let addModal = document.querySelector("#modaladd");
  addModal.innerHTML = addCourtPage;
  let addForm = document.querySelector("#addform");
  addForm.addEventListener("submit", onAddCourt);
};

const onAddCourt = (e) => {
  e.preventDefault();
  let syntheticForm;
  if(document.getElementById("option1Synthetic").checked)
    syntheticForm = "synthetic";
  else syntheticForm = "grass";
  let lightForm;
  if(document.getElementById("option1Light").checked)
    lightForm = "light";
  else lightForm = "no light";
  let coverForm;
  if(document.getElementById("option1Cover").checked)
    coverForm = "covered";
  else coverForm = "not covered";
  let image = document.getElementById("image").files[0];
  let court;
  if(image!==undefined){
  court = {
    title: document.getElementById("title").value,
    adress: document.getElementById("adress").value,
    city: document.getElementById("city").value,
    surface: syntheticForm,
    light : lightForm,
    cover : coverForm,
    image: document.getElementById("image").files[0].name,
  }}
  else{
  court = {
    title: document.getElementById("title").value,
    adress: document.getElementById("adress").value,
    city: document.getElementById("city").value,
    surface: syntheticForm,
    light : lightForm,
    cover : coverForm,
    image: null,
  }};

  const user = getUserSessionData();
  if(!user) notif();

  fetch("/api/courts/", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    body: JSON.stringify(court), // body data type must match "Content-Type" header
    headers: {
      "Content-Type": "application/json",
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
    .then((data) => onCourtAdded(data))
    .catch((err) => onError(err));
};

const onCourtAdded = (data) => {
  let messageBoard = document.querySelector("#messageBoardAddSucces");
  messageBoard.classList.remove("d-blocks");
  console.log(data);
  // re-render the navbar for the authenticated user  
  RedirectUrl("/");
  messageBoard.innerHTML = "Adding succeeded !";
  messageBoard.classList.add("d-block");  
};

const notif = () => {
  let messageBoard = document.querySelector("#messageBoardAddFail");
  messageBoard.classList.remove("d-blocks");
  RedirectUrl("/");
  messageBoard.innerHTML = `You must first <a class="text-success" href="#" data-toggle="modal" data-dismiss="modal" data-target="#login">login</a>`;
  messageBoard.classList.add("d-block");  
}

const onError = (err) => {
  let errorMessage = err.message;
  RedirectUrl("/error", errorMessage);
};

export default AddCourtModal;