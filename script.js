var apiKey = process.env.google_maps_api_key;
var hostUrl = 'https://majestic-chimera-34ed15.netlify.app/';

var marker;
var map;
var service;
var infoWindow;
var route;
var directionsService;
var directionsRenderer;
var start;
var end;
var addy1;
var addy2;
var markerSet = [];
var resultContent = $("#resultContent");



function isitworking() {
  event.preventDefault();
  addy1 = $("#addy1").val();
  addy2 = $("#addy2").val();
  console.log(addy1);
  console.log(addy2);
  clearMarkers()
  calcRoute();
}

function clearMarkers() {
  for (var i=0; i<markerSet.length; i++) {
    markerSet[i].setMap(null);
  }
  markerSet = [];
  resultContent.html("");
}

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
  start = $('#addy1').val();
  end = $('#addy2').val();
  console.log(start);
  console.log(end);
  // var start = document.getElementById('start').value;
  // var end = document.getElementById('end').value;
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
        var midPoint=result.routes[0].overview_path[parseInt(numberofWaypoints/2)];
        let midLat = midPoint.lat();
        let midLng = midPoint.lng();
        console.log(midPoint)
        console.log(midPoint.lat())
        console.log(midPoint.lng())
        marker = new google.maps.Marker({
            map: map,
            position:new google.maps.LatLng(midPoint.lat(),midPoint.lng()),
            title:'Mid Point',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            zIndex: 1
        });
        markerSet.push(marker)
        marker.setMap(map)
        //calcMidPoint(midLat, midLng)
        var radius = 5000;
        var userType = $('input[name="userType"]:checked').val();
        var userKeyword = $('#userKeyword').val();
        console.log(userType);
        var config = {
          method: 'get',
          url: hostUrl + 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + midPoint.lat() + '%2C' + midPoint.lng() + '&opennow=true&radius=' + radius + '&keyword=' + userKeyword + '&key=' + apiKey,
          header: { }
        }
        // var config = {
        //   method: 'get',
        //   url: hostUrl + 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + midPoint.lat() + '%2C' + midPoint.lng() + '&opennow=true&radius=' + radius + '&type=' + userType + '&key=' + apiKey,
        //   header: { }
        // }
        

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
            debugger;
            var latlng = data.results[i].geometry.location;
            marker = new google.maps.Marker({
              position: latlng,
              map: map,
              title: data.results[i].name
            });
            markerSet.push(marker);
            marker.setMap(map);
            var placeCard = $('<div>').attr({
              class: "w3-border w3-card right-content",
              style: "position: relative; background-color: white; color: black;"
            });
            var placeTitle = $('<h4>').attr({
              class: "col-1"
            }).text(data.results[i].name);
            var rating = $('<h6>').attr({
              class: "col-1"
            }).text(data.results[i].rating + " out of 5 stars with " + data.results[i].user_ratings_total + " total ratings!");
            var placePhoto = $("<div>").attr({
              style: "position: relative; background-image: url('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" + data.results[i].photos[0].photo_reference + "&key=" + apiKey + "'); background-repeat: no repeat; background-size: cover; height: 150px; width: 100%;",
              id: "card-"+i
            });
            var placeLink = $("<a>");
            var spanLink = $("<span>");
            var phoneNum = $("<p>");
            var addy = $("<p>");
            placeCard.append(placeTitle);
            placeCard.append(placePhoto);
            placeCard.append(rating);
            resultContent.append(placeCard);
              fetch(hostUrl + "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + data.results[i].place_id + "&fields=name%2Cformatted_address%2Cformatted_phone_number%2Curl%2Cwebsite&key=" + apiKey)
              .then(function(response){
                return response.json();
              })
              .then(function(data2){
                placeLink.attr({
                  style: "position: relative",
                  href: data2.result.url
                }).text("Details & Directions");
                phoneNum.text(data2.result.formatted_phone_number);
                addy.text(data2.result.formatted_address);
                placeCard.append(placeLink);
                placeCard.append(phoneNum);
                placeCard.append(addy);
              })
            
          }
        });

        }
      })
    };
    console.log(markerSet);
  


  var moviesAndTimes = ['.cinema1','.cinema2','.cinema3'];
  var joshNeeds = []; //array containing 3 subarrays of lat,long
  
function doomsday() {
  event.preventDefault();
  var c = moment().format();
  var geoArray = [-22, 14];  //use geoArray.push() to add to lat and long to this
  var movieCoord = geoArray.toString().replace(',',';');
  var cinArray = [];
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
         var listy = document.createElement('ol');
         cinTarget.append(listy);
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
            listy.append(cinTime);
            
          }

        });
      }
     
      } }





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
