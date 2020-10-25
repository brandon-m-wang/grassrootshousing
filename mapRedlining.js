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

let polygonArray = []

let contentString = "Location: South Park Date: 8/31/2020 Description: Anti-Black assault on multiple local community members. In violation of state (RCW 9A.36.080), and municipal code (SMC 12A.06.115)."

fetch('https://grassrootsforfamiliesserver.azurewebsites.net/get_all_redlinings')
    .then(response => response.json())
    .then(data => drawCircles(data["redlinings"]));
    //.then(data => console.log(data["redlinings"][0]["coordinates"]));
    
function drawCircles(data) {
    polygonArray = []
    for (key in data) {
        polyCoords = []
        description = data[key]["area_description_data"]
        datapoint = data[key]["coordinates"]
        grade = data[key]["holc_grade"]
        for (coord in datapoint) {
            vertex = datapoint[coord]
            latlngobj = {lat: parseFloat(vertex[1]), lng: parseFloat(vertex[0])}
            polyCoords.push(latlngobj)
        }
        console.log(polyCoords)
        switch(grade){
            case "A":
                //Green
                color = "#61bd4f"
                break;
            case "B":
                //Blue
                color = "#0080FF"
                break;
            case "C":
                //Yellow
                color = "#FFEA61"
                break;
            case "D":
                //Red
                color = "#ED2939"
                break;
        }
        //Make new polygon
        console.log(color)
        const polygon = new google.maps.Polygon({
            paths: polyCoords,
            strokeColor: "#white",
            strokeOpacity: 0.5,
            strokeWeight: .5,
            fillColor: color,
            fillOpacity: 0.5,
        });
        polygon.setMap(map)
        let contentString = "<strong>Median Household Income</strong>: " + description["Median Household Income"] + "<br><b>Racial Demographics:</b> " + description["Racial Demographics"]
        polygon.setMap(map)
        let infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        google.maps.event.addListener(polygon, 'click', function (ev) {
            //Finds the center of our polygons
            paths = polygon.getPath()
            meanLon = 0.0
            meanLat = 0.0
            length = paths.length
            for(i in paths.getArray()) {
                meanLon += parseFloat(paths.getArray()[i].lng())
                meanLat += parseFloat(paths.getArray()[i].lat())
            }
            meanLon = meanLon/ length
            meanLat = meanLat/ length
            
            polygonCenter = {lat: meanLat, lng: meanLon}
            infowindow.setPosition(polygonCenter);1
            infowindow.open(map);
        });
    }
}