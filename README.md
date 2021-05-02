# Visualizing Data with Leaflet

The United States Geological Survey (USGS) is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. This project is focused on building a tool that would visualize the earthquake data. The goal is to help USGS share this information with a wider audience, including government organizations responsible for making policy decisions. The visualizations should allow users to interact with the information in a more dynamic way and provide different viewing options that can be tailored based on user preference. 

### Level 1: Basic Visualization

1. **Get your data set** 
The USGS provides earthquake data in a number of formats, each updated every 5 minutes. Visit the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page and pick a data set to visualize. The data set selected for this project is the [USGS Magnitude 1.0+ Earthquakes, Past Week] (https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson), which includes earthquakes within the last week that were of a magnitude greater than 1.0 on the [Richter scale](https://www.usgs.gov/faqs/moment-magnitude-richter-scale-what-are-different-magnitude-scales-and-why-are-there-so-many?qt-news_science_products=0#qt-news_science_products). The URL of this JSON will be used to pull in the data for our visualization.

2. **Import & Visualize the Data**

Use Leaflet to create a map that plots all of the earthquakes from the data set as circles based on their latitude and longitude. 

   * The magnitude of the earthquake should be reflected in the size of the data markers (circles) and the depth of the earthquake in the color. In other words, earthquakes with lower magnitudes should appear lighter in color and smaller in size. 

   * Each data marker should also include a popup that provides additional information when clicked. Information to be included: Magnitude, Location, and Time

   * Create a legend on the bottom right of the page that will provide context

### Level 2: Tectonic Data

This visualization studies the relationship between tectonic plates and seismic activity. The data on [tectonic plates](https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json) can be found at <https://github.com/fraxen/tectonicplates>.

   * Plot the second data set on the existing map
   
   * Add multiple base maps that users can choose between

   * Separate out the earthquake and tectonic data sets into overlays that can be turned on or off independently.
  
   * Add layer controls to the map