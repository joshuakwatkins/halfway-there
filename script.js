var apiKey = 'AIzaSyCJrWz6gA0wql676OZAS1hVKlF7Cc38o_I';
var hostUrl = 'https://cors-anywhere.herokuapp.com/';

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
  if (markerSet.length !== 0) {
    for (var i=0; i<markerSet.length; i++) {
      markerSet[i].setMap(null);
    }
    markerSet = [];
    resultContent.html("");
  }
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
            icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
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
          url: hostUrl + 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + midPoint.lat() + '%2C' + midPoint.lng() + '&opennow=true&rankby=distance&keyword=' + userKeyword + '&key=' + apiKey,
          header: {  }
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
