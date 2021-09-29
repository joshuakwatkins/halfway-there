console.log("something");
var origin = "Disneyland";
var destination = "Universal+Studios+Hollywood";
var apiKey = "AIzaSyCJrWz6gA0wql676OZAS1hVKlF7Cc38o_I";
var twoPointsURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&destination=" + destination + "&key=" + apiKey;
var hostUrl = 'https://enigmatic-citadel-24557.herokuapp.com/';

console.log(twoPointsURL);

fetch(hostUrl + twoPointsURL, {
    method: 'GET',
    credentials: 'same-origin'
})
    .then(function(response){
        return response.json;
    })
    .then(function(data){ 
        console.log(data)
    })

var map;
var service;
var infoWindow;
var route;
var directionsService;
var directionsRenderer;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
      zoom:7,
      center: chicago
    }
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsRenderer.setMap(map);
  }
  
  function calcRoute() {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    var request = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    };
    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
      }
    });
  }


