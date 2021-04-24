// Creating map object
var myMap = L.map("mapid", {
  center: [21.5218, -77.7812],
  zoom: 3
});

// Adding tile layer to map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// Create variable for API query
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Get data using d3
d3.json(url, function (response) {
  // Set the list within the dictionary returned to a variable
  var responseList = response.features

  // Loop through data
  for (var i = 0; i < responseList.length; i++) {

    // Set the geometry property to a variable
    var location = responseList[i].geometry;

    // If geometry property, add new marker to the map
    if (location) {
      // L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
      L.circle([location.coordinates[1], location.coordinates[0]],{
        fillOpacity: 0.75,
        color: "black",
        fillColor: "red",
      radius: [location.coordinates[2]]}).addTo(myMap);
    }
  }
})