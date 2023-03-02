var apiKey = "AIzaSyCJrWz6gA0wql676OZAS1hVKlF7Cc38o_I";
var hostUrl = "https://corsproxy.io/?";

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
var callData = [];
var locales = [];

function isitworking() {
  event.preventDefault();
  addy1 = $("#addy1").val();
  addy2 = $("#addy2").val();
  console.log(addy1);
  console.log(addy2);
  clearMarkers();
  calcRoute();
}

function clearMarkers() {
  if (markerSet.length !== 0) {
    for (var i = 0; i < markerSet.length; i++) {
      markerSet[i].setMap(null);
    }
    markerSet = [];
    resultContent.html("");
  }
}

function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  var atlanta = new google.maps.LatLng(33.749, -84.388);
  var mapOptions = {
    zoom: 8,
    center: atlanta,
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  directionsRenderer.setMap(map);
}

function calcRoute() {
  start = $("#addy1").val();
  end = $("#addy2").val();
  console.log(start);
  console.log(end);
  // var start = document.getElementById('start').value;
  // var end = document.getElementById('end').value;
  var request = {
    origin: start,
    destination: end,
    travelMode: "DRIVING",
  };

  //This is the route function
  directionsService.route(request, function (result, status) {
    if (status == "OK") {
      directionsRenderer.setDirections(result);
      var numberofWaypoints = result.routes[0].overview_path.length;
      var midPoint =
        result.routes[0].overview_path[parseInt(numberofWaypoints / 2)];
      let midLat = midPoint.lat();
      let midLng = midPoint.lng();
      console.log(midPoint);
      console.log(midPoint.lat());
      console.log(midPoint.lng());
      marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(midPoint.lat(), midPoint.lng()),
        title: "Mid Point",
        icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
        zIndex: 1,
      });
      markerSet.push(marker);
      marker.setMap(map);
      //calcMidPoint(midLat, midLng)
      var radius = 5000;
      var userType = $('input[name="userType"]:checked').val();
      var userKeyword = $("#userKeyword").val();
      console.log(userType);
      var config = {
        method: "get",
        url:
          hostUrl +
          "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
          midPoint.lat() +
          "%2C" +
          midPoint.lng() +
          "&opennow=true&rankby=distance&keyword=" +
          userKeyword +
          "&key=" +
          apiKey,
        header: {},
      };

      const makeCalls = async () => {
        const data = await fetch(config.url)
          .then((response) => response.json())
          .then((data) => data);
        console.log(data.results);
        for (let i = 0; i < data.results.length; i++) {
          marker = new google.maps.Marker({
            position: data.results[i].geometry.location,
            map: map,
            title: data.results[i].name,
          });
          markerSet.push(marker);
          marker.setMap(map);

          var placeCard = $("<div>").attr({
            class: "w3-border w3-card right-content",
            style: "position: relative; background-color: white; color: black;",
          });
          var placeTitle = $("<h4>")
            .attr({
              class: "col-1",
            })
            .text(data.results[i].name);
          var rating = $("<h6>")
            .attr({
              class: "col-1",
            })
            .text(
              data.results[i].rating +
                " out of 5 stars with " +
                data.results[i].user_ratings_total +
                " total ratings!"
            );
          var placePhoto = $("<div>").attr({
            style:
              "position: relative; background-image: url('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
              data.results[i].photos[0].photo_reference +
              "&key=" +
              apiKey +
              "'); background-repeat: no repeat; background-size: cover; height: 150px; width: 100%;",
            id: "card-" + i,
          });
          var placeLink = $("<a>");
          var spanLink = $("<span>");
          var phoneNum = $("<p>");
          var addy = $("<p>");
          placeCard.append(placeTitle);
          placeCard.append(placePhoto);
          placeCard.append(rating);

          var config2 = {
            method: "get",
            url:
              hostUrl +
              "https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
              data.results[i].place_id +
              "&fields=name%2Cformatted_address%2Cformatted_phone_number%2Curl%2Cwebsite&key=" +
              apiKey,
            header: {},
          };
          console.log(config2.url);
          const data2 = await fetch(config2.url)
            .then((response) => response.json())
            .then((data2) => data2);
          console.log(data2.result);
          placeLink
            .attr({
              style: "position: relative",
              target:"_blank",
              href: data2.result.url,
            })
            .text("Details & Directions");
          phoneNum.text(data2.result.formatted_phone_number);
          addy.text(data2.result.formatted_address);
          placeCard.append(placeLink);
          placeCard.append(phoneNum);
          placeCard.append(addy);

          resultContent.append(placeCard);
        }
      }

      makeCalls();

      // fetch(config.url)
      //   .then(function (response) {
      //     return response.json();
      //   })
      //   .then(function (data) {
      //     callData = data.results;
      //     console.log(data);
      //     console.log(data.results);
      //     callData = data.results;
      //     console.log(callData);
      //     console.log(data.results[0]);
      //     console.log(data.results[0].geometry.location.lng);
      //     console.log(data.results[0].geometry.location.lat);
      //     for (var i = 0; i < data.results.length; i++) {
      //       var latlng = data.results[i].geometry.location;
      //       marker = new google.maps.Marker({
      //         position: latlng,
      //         map: map,
      //         title: data.results[i].name,
      //       });
      //       markerSet.push(marker);
      //       marker.setMap(map);
      //       var placeCard = $("<div>").attr({
      //         class: "w3-border w3-card right-content",
      //         style:
      //           "position: relative; background-color: white; color: black;",
      //       });
      //       var placeTitle = $("<h4>")
      //         .attr({
      //           class: "col-1",
      //         })
      //         .text(data.results[i].name);
      //       var rating = $("<h6>")
      //         .attr({
      //           class: "col-1",
      //         })
      //         .text(
      //           data.results[i].rating +
      //             " out of 5 stars with " +
      //             data.results[i].user_ratings_total +
      //             " total ratings!"
      //         );
      //       var placePhoto = $("<div>").attr({
      //         style:
      //           "position: relative; background-image: url('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
      //           data.results[i].photos[0].photo_reference +
      //           "&key=" +
      //           apiKey +
      //           "'); background-repeat: no repeat; background-size: cover; height: 150px; width: 100%;",
      //         id: "card-" + i,
      //       });
      //       var placeLink = $("<a>");
      //       var spanLink = $("<span>");
      //       var phoneNum = $("<p>");
      //       var addy = $("<p>");
      //       placeCard.append(placeTitle);
      //       placeCard.append(placePhoto);
      //       placeCard.append(rating);
      //       resultContent.append(placeCard);

      //       var config2 = {
      //         method: "get",
      //         url:
      //           hostUrl +
      //           "https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
      //           data.results[i].place_id +
      //           "&fields=name%2Cformatted_address%2Cformatted_phone_number%2Curl%2Cwebsite&key=" +
      //           apiKey,
      //         header: {},
      //       };
      //       fetch(config2.url)
      //         .then(function (response) {
      //           return response.json();
      //         })
      //         .then(async function (data2) {
      //           console.log(data2.result);
      //           placeLink
      //             .attr({
      //               style: "position: relative",
      //               href: data2.result.url,
      //             })
      //             .text("Details & Directions");
      //           phoneNum.text(data2.result.formatted_phone_number);
      //           addy.text(data2.result.formatted_address);
      //           placeCard.append(placeLink);
      //           placeCard.append(phoneNum);
      //           placeCard.append(addy);
      //         });
      //     }
      //   });
    }
  });
}
console.log(markerSet);