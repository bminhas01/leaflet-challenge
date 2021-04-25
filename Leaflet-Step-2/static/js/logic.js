// Function to detemine marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 10000
}

function setColor(depth) {
  return depth > 90 ? '#FF3333' :
    depth > 70 ? '#FF9933' :
      depth > 50 ? '#FFB266' :
        depth > 30 ? '#E7E33E' :
          depth > 10 ? '#B2FF66' :
            '#66FF66';
}

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
    center: [35.1495, -90.0490],
    zoom: 4,
    layers: [
      grayscalemap,
      earthquakes
    ]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
      depths = [-10, 10, 30, 50, 70, 90];
    // labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {

      div.innerHTML +=
        '<i style="background-color:' + setColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? ' &ndash; ' + depths[i + 1] + '<br>' : '+')
    }
    return div;

  }
  legend.addTo(myMap)
}

function createMarkers(response) {
  // Set the list within the dictionary returned to a variable
  var responseList = response.features

  var earthquakeMarkers = []
  // Loop through data
  for (var i = 0; i < responseList.length; i++) {

    var earthquakeRecords = L.circle([responseList[i].geometry.coordinates[1], responseList[i].geometry.coordinates[0]], {
      stroke: true,
      weight: 0.5,
      fillOpacity: 0.75,
      color: "black",
      fillColor: setColor(responseList[i].geometry.coordinates[2]),
      radius: markerSize(responseList[i].properties.mag)
    }).bindPopup("<h3>" + responseList[i].properties.title + "<h3><h3>Time: " + new Date(responseList[i].properties.time) + "</h3>");

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
  // d3.json(techtonicURL, createMarkersTech);