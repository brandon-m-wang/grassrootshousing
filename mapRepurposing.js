var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 30.2672, lng: -97.7431},
        styles: [
            {elementType: "geometry", stylers: [{color: "#242f3e"}]},
            {elementType: "labels.text.stroke", stylers: [{color: "#242f3e"}]},
            {elementType: "labels.text.fill", stylers: [{color: "#746855"}]},
            {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{color: "#d59563"}],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{color: "#d59563"}],
            },
            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{color: "#263c3f"}],
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{color: "#6b9a76"}],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{color: "#38414e"}],
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{color: "#212a37"}],
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{color: "#9ca5b3"}],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{color: "#746855"}],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{color: "#1f2835"}],
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{color: "#f3d19c"}],
            },
            {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{color: "#2f3948"}],
            },
            {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{color: "#d59563"}],
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{color: "#17263c"}],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{color: "#515c6d"}],
            },
            {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{color: "#17263c"}],
            },
        ],
    });
}

let circleArray = []


fetch('https://grassrootsforfamiliesserver.azurewebsites.net/get_all_office_spaces')
    .then(response => response.json())
    .then(data => drawCircles(data["office_spaces"]));

function drawCircles(data) {
    for (key in data) {
        console.log(data[key])
        latlngobj = {lat: parseFloat(data[key]["latitude"]), lng: parseFloat(data[key]["longitude"])}
        const circle = new google.maps.Circle({
            fillColor: '#C0C0C0',
            fillOpacity: .7,
            strokeColor: 'white',
            strokeWeight: .5,
            clickable: true,
            map,
            center: latlngobj,
            radius:200
        })
        let contentString = "<strong>Name</strong>: " + data[key]["name"]
        circle.setMap(map)
        let infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        google.maps.event.addListener(circle, 'click', function (ev) {
            infowindow.close(map);
            infowindow.setPosition(circle.getCenter());
            infowindow.open(map);
        });
    };
}


$(function () {
    $("#submission").click(function (event) {
        submitUserData()
        event.preventDefault()
    });
});

function submitUserData() {
    raceSelection = $('#race option:selected').text();
    genderSelection = $('#gender option:selected').text();
    sexualitySelection = $('#sexuality option:selected').text();
    religionSelection = $('#religion option:selected').text();

    fetch(`https://us-central1-safeguard-292111.cloudfunctions.net/getLocations?race=${raceSelection}&religion=${genderSelection}&sexuality=${sexualitySelection}&gender=${religionSelection}`)
        .then(response => response.json())
        .then(data => drawCircles(data[0]));
}