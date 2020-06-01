//Leaflet Homework Step 1 - Randy Dettmer 2020/05/28

// Store our API endpoint inside queryUrl - used to collect weekly earthquake data from USGS
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  //console.log(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // magnitude - 100000 is too large
  function radiusSize(magnitude) {
    return magnitude * 20000;
  }

  // Circle color for magnitude intensity - darker are higher magnitude
  function circleColor(magnitude) {
    if (magnitude < 1) {
      return "#F7DC6F"
    } 
    else if (magnitude < 2) {
      return "#F39C12"
    } 
    else if (magnitude < 3) {
      return "#CA6F1E"
    } 
    else if (magnitude < 4) {
      return "#B03A2E"
    } 
    else if (magnitude < 5) {
      return "#581845"
    } 
    else {
      return "#000000" // black
    }
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latling) {
      return L.circle(latling, {
        radius: radiusSize(earthquakeData.properties.mag),
        color: circleColor(earthquakeData.properties.mag),
        fillOpacity: 0.5
      });
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define outdoors map
  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      38.6270, -90.1994
    ],
    zoom: 5,
    layers: [outdoorsmap, earthquakes]
  });

  // color function for the earthquake magitude for the legend
  function getColor(d) {
    return d > 5 ? "#000000" :
           d > 4 ? "#581845" :
           d > 3 ? "#B03A2E" :
           d > 2 ? "#CA6F1E" :
           d > 1 ? "#F39C12" :
                    "#F7DC6F";
  }; 
 
  // create legend
  var legend = L.control({position: "bottomright"});

  // layer control added, insert div with class legend
  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];  // not used can I delete?????

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
           '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
           grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div; 
  };

  // add legend to map
  legend.addTo(myMap);

  }
//end of file
