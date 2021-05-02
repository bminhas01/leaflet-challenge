// Create new layer groups for the tectonic plates and earthquake data
var tplates = new L.LayerGroup()
var earthquakes = new L.LayerGroup()

// Function to detemine marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 4
}

// Function to determine circle color based on depth value
function setColor(depth) {
  return depth > 90 ? '#FF3333' :
    depth > 70 ? '#FF9933' :
      depth > 50 ? '#FFB266' :
        depth > 30 ? '#E7E33E' :
          depth > 10 ? '#B2FF66' :
            '#66FF66';
}

// Create layers to be background of the map
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

// Create a map with default layers to display
var myMap = L.map("mapid", {
  center: [44.0682, -118.7420],
  zoom: 4,
  layers: [
    satellitemap,
    earthquakes
  ]
});
// Add satellitemap as the default map displayed when page is loaded
satellitemap.addTo(myMap)

// Define baseMaps object to hold base layers
var baseMaps = {
  "Satellite": satellitemap,
  "Grayscale": grayscalemap,
  "Outdoors": outdoormap
}

// Create overlay object to hold overlay layer
var overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tplates
}

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Pull earthquake data using a d3.json call
// Loop through data to create circles for each data value
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";
d3.json(earthquakeURL, function (data) {
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: setColor(feature.geometry.coordinates[2]),
        color: "#000000",
        stroke: true,
        weight: 0.5,
        opacity: 1,
        fillOpacity: 1
      });
    },
    // Create a popup for each point in scatter plot
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place
        + "<br>Time: " + new Date(feature.properties.time));
    }
    // Add data to earthquakes layergroup
  }).addTo(earthquakes);

  // Add earthquakes layer group to the map
  earthquakes.addTo(myMap)

  // Create legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
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

  // Create variable for API query - tectonic plates
  var tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

  // Get data using d3
  d3.json(tectonicURL, function (tdata) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(tdata, {
      color: "brown"
    // Add data to tplates layergroup
    }).addTo(tplates);
    // Add tplates layergroup to map
    tplates.addTo(myMap)
  });
})
