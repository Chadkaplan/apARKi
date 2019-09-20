var map, infoWindow;
let userLongitude;
let userLatitude;
// Function to initilize the map to the screen
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        // Initial starting location is University of Central Florida
        center: { lat: 28.589475, lng: -81.199879 },
        zoom: 13
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude

            };
            userLatitude = pos.lat
            userLongitude = pos.lng
            console.log(userLatitude)
            console.log(userLongitude)

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}
initMap();

let lat;
let lng;
let address;
let parking = [];
var map;
$('#submitButton').keypress(function (e) {
  if (e.which == 13) {
    console.log(e.which);
    let val = $('#submitButton').val();
    console.log("Form Value: ", val);
    $('#submitButton').text("");
  }
});

function initParkingMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: lat, lng: lng },
        zoom: 15
    });

    var infoWindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < parking.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(parking[i][1], parking[i][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infoWindow.setContent(parking[i][0]);
          infoWindow.open(map, marker);
        }
      })(marker, i));
    }
}

$("#submitButton").on("click", function (event) {
    event.preventDefault();
    address = $("#address").val().trim();
    console.log(address);

    var queryPlacesURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=AIzaSyAl_dAteSxbSnf4wX8cFpQYhpP9dZN35TE&input=" + address + "&inputtype=textquery&fields=name,geometry,formatted_address,icon";

    $.ajax({
        url: queryPlacesURL,
        method: "GET"
    }).then(function (response) {
        let data = response.candidates[0];
        console.log(data.geometry.location);
        console.log(data.geometry.location.lat);
        console.log(data.geometry.location.lng);
        lat = data.geometry.location.lat;
        lng = data.geometry.location.lng;

        var queryParkingURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng + "&key=AIzaSyAl_dAteSxbSnf4wX8cFpQYhpP9dZN35TE&radius=1000&types=parking";

        $.ajax({
            url: queryParkingURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

        let results = response.results;

        for (let i = 0; i < results.length; i++) {
            //console.log(results[i].name, results[i].geometry.location.lat, results[i].geometry.location.lng);

            let parkingPush = [results[i].name, results[i].geometry.location.lat, results[i].geometry.location.lng];

            parking.push(parkingPush);

        }

        console.log(parking);
        initParkingMap();
    })
    //inside the 1st then

    var queryDirectionsURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=AIzaSyAl_dAteSxbSnf4wX8cFpQYhpP9dZN35TE"

    $.ajax ({
        url: queryDirectionsURL,
        method: "GET"
    }).then(function(response) {
        //logging directions to the console
        console.log(response);
    })
    //1st then ending
      
    });

    $("#address").val("");
})

            // Set the lat and long into variables
            // take that information and do another ajax call
            // Take that info and plug in into another ajax call for api/maps