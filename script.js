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

  var c = moment().format();
  var geoArray = [-22, 14];  //use geoArray.push() to add to lat and long to this
  var movieCoord = geoArray.toString().replace(',',';');
  var cinArray = [];
  var moviesAndTimes = ['.cinema1','.cinema2','.cinema3'];
  var joshNeeds = []; //array containing 3 subarrays of lat,long
  

console.log(movieCoord);
 var settings = {
    "url": "https://api-gate2.movieglu.com/cinemasNearby/?n=3",
    "method": "GET",
    "timeout": 0,
    "headers": {
    "api-version": "v200",
    "Authorization": "Basic Q09ESV85X1hYOnYwWVJHZzRtMVdZMw==",  //change when official
    "client": "CODI_9",
    "x-api-key": "mF0IdpuMdd7g01GUbV0ozdb9cK5wJmmRZCT7Wph0",  //change when official
    "device-datetime": c,   //use moment.js
    "territory": "XX",      //should be US when official
    "geolocation": movieCoord
    },
    };

    $.ajax(settings).done(function (response) {
    console.log(response);
    for (i=0; i < 3; i++) {
      var cinTarget = $(moviesAndTimes[i]);  // placeholder; MUST CHANGE TO SEE INFO ON PAGE!

    var cinAID = response.cinemas[i].cinema_id;

    var cinemaName = document.createElement("h3");
    cinemaName.textContent = response.cinemas[i].cinema_name;

    var cinemaAddress = document.createElement("p");
    cinemaAddress.textContent ="Address: " + response.cinemas[i].address;

    var cinFilm = document.createElement("h5");
      cinFilm.textContent ="Popular Movies: ";

    var navEl = [];
    navEl.push(response.cinemas[i].lat);
    navEl.push(response.cinemas[i].lng);

     cinTarget.append(cinemaName, cinemaAddress, cinFilm);

     cinArray.push(cinAID);
     joshNeeds.push(navEl);
    }
    acquireShowTimes();
    });

    function acquireShowTimes() {

      var needDate = moment().format("YYYY-MM-DD");
      for (let i = 0; i < cinArray.length; i++) {
        var settings = {
          url:
            "https://api-gate2.movieglu.com/cinemaShowTimes/?&cinema_id=" +
            cinArray[i] +
            "&date=" +
            needDate +
            "&sort=popularity",
          method: "GET",
          timeout: 0,
          headers: {
            "api-version": "v200",
            Authorization: "Basic Q09ESV85X1hYOnYwWVJHZzRtMVdZMw==", //change when official
            client: "CODI_9",
            "x-api-key": "mF0IdpuMdd7g01GUbV0ozdb9cK5wJmmRZCT7Wph0", //change when official
            "device-datetime": c, //use moment.js
            territory: "XX", //should be US when official
            geolocation: movieCoord,
          },
        };

        $.ajax(settings).done(function (response) {
          var cinTarget = $(moviesAndTimes[i]);
         
          for (let j = 0; j < 4; j++) {
              var sTime = [];
     

            for (
              let b = 0;
              b < 3;
              b++
            ) {

              sTime.push(response.films[j].showings.Standard.times[b].start_time);
            }
            var cinTime = document.createElement("li");
            cinTime.textContent = response.films[j].film_name + " -\n Start Times: " + sTime;
            cinTarget.append(cinTime);
            
          }

        });
      }
     
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
