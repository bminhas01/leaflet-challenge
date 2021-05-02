// Function to detemine marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 10000
}

// Function to set circle color based on depth value
function setColor(depth) {
  return depth > 90 ? '#FF3333' :
    depth > 70 ? '#FF9933' :
      depth > 50 ? '#FFB266' :
        depth > 30 ? '#E7E33E' :
          depth > 10 ? '#B2FF66' :
            '#66FF66';
}

// Function to create the map graph
function createMap(earthquakes) {
  // Create tile layer to be background of map
  var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  // Create a map with default layers to display
  var myMap = L.map("mapid", {
    center: [40.7608, -111.8910],
    zoom: 5,
    layers: [
      grayscalemap,
      earthquakes
    ]
  });

  // Create legend to display on the page
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend');
    depths = [-10, 10, 30, 50, 70, 90];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {

      div.innerHTML +=
        '<i style="background-color:' + setColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? ' &ndash; ' + depths[i + 1] + '<br>' : '+')
    }
    return div;

  }
  // add  legend to map
  legend.addTo(myMap)
}

// Function to create scatter plot
function createMarkers(response) {
  // Set the list within the dictionary returned to a variable
  var responseList = response.features

  var earthquakeMarkers = []

  // Loop through data to create circles
  for (var i = 0; i < responseList.length; i++) {

    var earthquakeRecords = L.circle([responseList[i].geometry.coordinates[1], responseList[i].geometry.coordinates[0]], {
      stroke: true,
      weight: 0.5,
      fillOpacity: 0.75,
      color: "black",
      fillColor: setColor(responseList[i].geometry.coordinates[2]),
      radius: markerSize(responseList[i].properties.mag)
    }).bindPopup("Magnitude: " + responseList[i].properties.mag + "<br>Location: " + responseList[i].properties.place
      + "<br>Time: " + new Date(responseList[i].properties.time));

    earthquakeMarkers.push(earthquakeRecords)
  }

  // Create a separate layer group for the earthquakes
  createMap(L.layerGroup(earthquakeMarkers))
}

// Create variable for API query
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";
var techtonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// Get data using d3
d3.json(earthquakeURL, createMarkers);


