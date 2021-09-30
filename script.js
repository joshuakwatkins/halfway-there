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
    var atlanta = new google.maps.LatLng(33.7490,-84.3880);
    var mapOptions = {
      zoom:8,
      center: atlanta
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
        var numberofWaypoints = result.routes[0].overview_path.length;             
        var midPoint=result.routes[0].overview_path[parseInt( numberofWaypoints / 2)];
        console.log(midPoint)
        console.log(midPoint.lat())
        console.log(midPoint.lng())
        var marker = new google.maps.Marker({
            map: map,
            position:new google.maps.LatLng(midPoint.lat(),midPoint.lng()),
            title:'Mid Point'
        });
      }
    });
  }





//   var directionsDisplay;
//         var directionsService = new google.maps.DirectionsService();
//         var map;

//         function initialize() {
//             directionsDisplay = new google.maps.DirectionsRenderer();
//             var chicago = new google.maps.LatLng(41.850033, -87.6500523);
//             var mapOptions = {
//                 zoom: 7,
//                 center: chicago
//             };
//             map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//             directionsDisplay.setMap(map);
//         }

        // function calcRoute() {
        //     var start = document.getElementById('start').value;
        //     var end = document.getElementById('end').value;
        //     var request = {
        //         origin: start,
        //         destination: end,
        //         travelMode: google.maps.TravelMode.DRIVING
        //     };
        //     directionsService.route(request, function (response, status) {
        //         if (status == google.maps.DirectionsStatus.OK) {
        //             directionsDisplay.setDirections(response);
        //             var numberofWaypoints = response.routes[0].overview_path.length;
                    
        //             var midPoint=response.routes[0].overview_path[parseInt( numberofWaypoints / 2)];
        //             var marker = new google.maps.Marker({
        //                 map: map,
        //                 position:new google.maps.LatLng(midPoint.lat(),midPoint.lng()),
        //               title:'Mid Point'
        //             });
                    
                    
        //         }
        //     });
        // }

        // google.maps.event.addDomListener(window, 'load', initialize);

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
