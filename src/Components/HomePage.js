import { setLayout } from "../utils/render";
import { RedirectUrl } from "./Router.js";
import { getUserSessionData } from "../utils/session.js";
import courtPicture from "../images/terrain-foot.jpg";
import grass from "../images/grass.png";
import lightbulb from "../images/light-bulb.png";
import roof from "../images/roof.png";
import icon from "../images/icon.png";

let page = document.querySelector("#page");
var address = [];

const HomePage = async (search) => {
  page.innerHTML = 
  `<div class="row">
    <h3 id="pageTitle"></h3>
    <div id="courtlist" class="col position-absolute w-50 shadow-sm"></div>
    <div id="map" class="col position-fixed w-50" style="margin-left: 50%; height: 93vh;"></div>
  </div>
  `;
  if(search===undefined){
    setLayout("Home");

    fetch("/api/courts", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(
            "Error code : " + response.status + " : " + response.statusText
          );
        return response.json();
      })
      .then((data) => onCourtList(data))
      .then(() => initMap())
      .catch((err) => onError(err));
  }else{
    setLayout(`Searching for ${search} ...`);
    let pageTitle = document.querySelector("#pageTitle");
    pageTitle.innerHTML = `Searching for "${search}" ...`;
    fetch("/api/courts/" + search, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(
            "Error code : " + response.status + " : " + response.statusText
          );
        return response.json();
      })
      .then((data) => onCourtList(data))
      .then(() => initMap())
      .catch((err) => onError(err));
  }
};
/******************************************************
 *                COURTS LIST
 *****************************************************/

const onCourtList = (data) => {
  let courtList = document.querySelector("#courtlist");
  if (!data) return;
  let table = `
            <ul class="list-group list-group-flush">`;
  data.forEach((element) => {
    table += `<li id="${element.adress}" class="list-group-item" data-toggle="collapse" href="#collapse${element.id}" role="button" aria-expanded="false" aria-controls="collapse${element.id}">
                <div class="row">
                  <div class="col">
                    <img src="${courtPicture}" class="rounded" style="width: 100%;"/>
                  </div>
                  <div class="col">
                      <ul style="list-style: none;">
                        <li class="text-muted">${element.city}</li>
                        <li><h3>${element.title}</h3></li>
                        <br/>
                        <div class="dropdown-divider"></div>
                        <br/>
                        <li class="text-muted">${element.surface}</li>
                        <li class="text-muted">${element.cover}</li>
                        <li class="text-muted">${element.light}</li>
                      </ul>
                  </div>
                </div>
                <div class="collapse" id="collapse${element.id}">
                  <div class="row">
                    <br/>
                    <div class="col">
                      <br/>
                      <h5 class="col">${element.adress}</h5>
                      <br/>
                      <center><button id="viewmap" class="btn btn-success rounded">View on map</button></center>
                    </div>
                    <div class="col">
                      <span class="col"></span>
                      <span class="row col">`;
                    if(element.surface==='grass')
                      table += `<span class="col"><img src="${grass}" width="50" height="50"/></span>`
                    if(element.cover==="covered")
                      table += `<span class="col"><img src="${roof}" width="50" height="50"/></span>`
                    if(element.light==="light")  
                      table += `<span class="col"><img src="${lightbulb}" width="50" height="50"/></span>`
          table += `  </span>
                    </div>
                  </div>
                </div>
              </li>`;
  address.push(element.adress);
  });

  table += `</ul>`;
  courtList.innerHTML = table;

  const viewBtns = document.querySelectorAll("#viewmap");
  viewBtns.forEach((viewbtn) => {
    viewbtn.addEventListener("click", onClick);
  })
  const saveBtns = document.querySelectorAll(".save");
  const deleteBtns = document.querySelectorAll(".delete");
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", onDelete);
  });

  saveBtns.forEach((saveBtn) => {
    saveBtn.addEventListener("click", onSave);
  });
};

const onSave = (e) => {
  // the id is given in the current table row under data-id attribute
  const courtId = e.target.parentElement.parentElement.dataset.id;
  let court = {};
  const tr = e.target.parentElement.parentElement;
  const cells = tr.querySelectorAll("td");
  court.title = cells[0].innerText;
  court.adress = cells[1].innerText;
  court.city = cells[2].innerText;
  court.surface = cells[3].innerText;
  court.light = cells[4].innerText;
  court.cover = cells[5].innerText;
  console.log("Court:", court);
  const user = getUserSessionData();

  fetch("/api/courts/" + courtId, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
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
    .then((data) => HomePage())
    .catch((err) => onError(err));
};

const onDelete = (e) => {
  // the id is given in the current table row under data-id attribute
  const courtId = e.target.parentElement.parentElement.dataset.id;
  const user = getUserSessionData();
  fetch("/api/courts/" + courtId, {
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
    .then((data) => HomePage())
    .catch((err) => onError(err));
};

const onClick = (e) => {
  console.log("onClick");
  const adress = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;
  geocoder.geocode({'address': adress}, function(results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);
    } else {
      console.log('Geocode was not successful for the following reason: ' + status);
    }
  })
};

const onError = (err) => {
  console.error("UserListPage::onError:", err);
  let errorMessage = "Error";
  if (err.message) {
    errorMessage = err.message;
  }
  RedirectUrl("/error", errorMessage);
};

/********************************************
 *                    MAP
*********************************************/

/*
function initMap(){
  //Map option
  var option = {
      zoom : 12,
      center : {lat:50.8503396,lng:4.3517103},
      mapTypeControl: false,
  }
  //New map
  var map = new google.maps.Map(document.querySelector("#map"),option);
  
  //Array of markers
  var markers = [
    {
    coords:{lat:50.8512205, lng:4.3451959},
    content:'DANSAERT'
    },
    {
    coords:{lat:50.840057373046875, lng:4.39126443862915},
    content:'CINQUENTENAIRE'
    }
  ];
 //Loop trought markers
 for(var i=0; i<markers.length; i++){
   addMarker(markers[i]);
 }
  //function add marker
  function addMarker(props){
      var marker = new google.maps.Marker({
          position : props.coords,
          map : map,
          content : props.content
      });
  }
  
}
*/
//-------------------------------------------------------------------------------------------------

var geocoder;
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom : 15,
      center : {lat:50.8503396,lng:4.3517103},
      mapTypeControl: false,
      icon: icon,
  });
  geocoder = new google.maps.Geocoder();
  codeAddress(geocoder, map,address);
}


function codeAddress(geocoder, map, address) {
  for(let i=0; i<address.length; i++){

    geocoder.geocode({'address': address[i]}, function(results, status) {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          zoom: 15,
          map: map,
          position: results[0].geometry.location,
          icon: icon
        });

        var infoWindowOptions = {
          content: `<h3>${address[i]}</h3>`
              + '<p>Courts</p>'
        };

        var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        
        google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(map, marker);
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);
        });
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}

export default HomePage;