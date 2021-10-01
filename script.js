console.log("something");
var origin = "Disneyland";
var destination = "Universal+Studios+Hollywood";
var apiKey = "AIzaSyCJrWz6gA0wql676OZAS1hVKlF7Cc38o_I";
var twoPointsURL = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&destination=" + destination + "&key=" + apiKey;
var hostUrl = 'https://enigmatic-citadel-24557.herokuapp.com/';

console.log(twoPointsURL);

var marker;
var map;
var service;
var infoWindow;
var route;
var directionsService;
var directionsRenderer;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    var atlanta = new google.maps.LatLng(33.7490,-84.3880);
    var mapOptions = {
      zoom:8,
      center: atlanta
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
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

    //This is the route function
    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
        var numberofWaypoints = result.routes[0].overview_path.length;             
        var midPoint=result.routes[0].overview_path[parseInt( numberofWaypoints / 2)];
        let midLat = midPoint.lat();
        let midLng = midPoint.lng();
        console.log(midPoint)
        console.log(midPoint.lat())
        console.log(midPoint.lng())
        marker = new google.maps.Marker({
            map: map,
            position:new google.maps.LatLng(midPoint.lat(),midPoint.lng()),
            title:'Mid Point',
            zIndex: 1
        });
        marker.setMap(map)
        //calcMidPoint(midLat, midLng)
        var config = {
          method: 'get',
          url: hostUrl + 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + midPoint.lat() + '%2C' + midPoint.lng() + '&radius=50000&type=restaurant&keyword=beer&key=' + apiKey,
          header: { }
        }
        

        fetch(config.url)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log(data);
          console.log(data.results);
          console.log(data.results[0]);
          console.log(data.results[0].geometry.location.lng);
          console.log(data.results[0].geometry.location.lat);
          for (var i=0;i<data.results.length; i++) {
          // var lat = data.results[i].geometry.location.lat;
          // var lng = data.results[i].geometry.location.lng;
          var latlng = data.results[i].geometry.location;
          marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: data.results[i].name
          });
          debugger;
          marker.setMap(map);
        }

        })
      }
    });
  }
  


// Script to open and close sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
  }
  
  function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
  }
  
  // Modal Image Gallery
  function onClick(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";
    var captionText = document.getElementById("caption");
    captionText.innerHTML = element.alt;
  }
