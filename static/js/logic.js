// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
    center: [35, -90],
    zoom: 4.0
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting our GeoJSON data
d3.json(link).then(function(data) {
    
    function getColor(earthquakeDepth){
        let redScale = 255 - earthquakeDepth*10;
        return redScale; 
    }

    var features = data.features;

    // Loop through each feature
    features.forEach(function(feature) {
    // Access the "geometry" object of each feature
    let mag = feature.properties.mag;
    let geometry = feature.geometry;
    
    // Retrieve the "coordinates" array within the geometry object
    let latitude = geometry.coordinates[1];
    let longitude = geometry.coordinates[0];
    let depth = geometry.coordinates[2];

    let red = getColor(depth);

    L.circle([latitude, longitude], {
        color: 'rgb(' + red + ', 0, 0)',
        fillColor: 'rgb(' + red + ', 0, 0)',
        fillOpacity: 0.5,
        radius: mag * 10000
      }).bindPopup(`<h1>Magnitude: ${mag}</h1> <hr> <h3>Depth: ${depth}</h3>`).addTo(myMap);

  });    

});

  