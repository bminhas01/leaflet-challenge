// Function to detemine marker size based on magnitude
function markerSize(mag){
  return mag * 1000
}

function createMap(earthquakes){
// Create tile layer to be background of map
var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

// Define baseMaps object to hold base layers
var baseMaps = {
  "Satellite": satellitemap,
  "Grayscale": grayscalemap,
  "Outdoors": outdoormap
}

// Create overlay object to hold overlay layer
var overlayMaps = {
  "Earthquakes": earthquakes
}

// Create a map with default layers to display
var myMap = L.map("mapid", {
  center: [21.5218, -77.7812],
  zoom: 3,
  layers: [grayscalemap, earthquakes]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
}

function createMarkers(response) {
// Set the list within the dictionary returned to a variable
var responseList = response.features

var earthquakeMarkers = []
 // Loop through data
 for (var i = 0; i < responseList.length; i++) {
  // var item = responseList[i];
  
  var earthquakeRecords = L.circle([responseList[i].geometry.coordinates[1], responseList[i].geometry.coordinates[0]],{
  stroke: false,
  fillOpacity: 0.75,
  color: "red",
  fillColor: "red",
  radius: markerSize(responseList[i].properties.mag)
}).bindPopup("<h3>" + responseList[i].properties.title + "<h3><h3>Time: " + new Date(responseList[i].properties.time)  + "</h3>");

earthquakeMarkers.push(earthquakeRecords)
}

// Create a separate layer group for the earthquakes
createMap(L.layerGroup(earthquakeMarkers))
}


// Create variable for API query
// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";


// Get data using d3
d3.json(url, createMarkers);



