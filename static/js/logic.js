// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
    center: [35, -100],
    zoom: 4
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting our GeoJSON data
d3.json(link).then(function(data) {
    
    let features = data.features;

    let colorBins = [2.5, 5, 10, 50, 90];
    let redScales = [255, 204, 153, 102, 51, 0];
    let colorLabels = [`< ${colorBins[0]}`,
        `${colorBins[0]} - ${colorBins[1]}`,
        `${colorBins[1]} - ${colorBins[2]}`,
        `${colorBins[2]} - ${colorBins[3]}`,
        `${colorBins[3]} - ${colorBins[4]}`,
        `> ${colorBins[4]}`
        ]
    let colorScales = [];

    for (i=0; i<redScales.length; i++){
        colorScales.push('rgb(' + redScales[i] + ', 0, 0)')
    }

    function getCircleColor(eDepth){
        let redScale;
        if(eDepth < colorBins[0]){
            redScale = redScales[0];
        }else if(eDepth >= colorBins[0] && eDepth < colorBins[1]){
            redScale = redScales[1];
        }else if(eDepth >= colorBins[1] && eDepth < colorBins[2]){
            redScale = redScales[2];
        }else if(eDepth >= colorBins[2] && eDepth < colorBins[3]){
            redScale = redScales[3];
        }else if(eDepth >= colorBins[3] && eDepth < colorBins[4]){
            redScale = redScales[4];  
        }else{
            redScale = redScales[5]; 
        }
        return redScale; 
    }

    // Loop through each feature
    features.forEach(function(feature) {

        // Get Magnitude date and place of each earthquake
        let place = feature.properties.place;
        let time = Date(feature.properties.time);
        let mag = feature.properties.mag;
        
        // Retrieve the "coordinates" array within the geometry object
        let geometry = feature.geometry;
        let latitude = geometry.coordinates[1];
        let longitude = geometry.coordinates[0];
        let depth = geometry.coordinates[2];

        let red = getCircleColor(depth);

        L.circle([latitude, longitude], {
            color: 'rgb(' + red + ', 0, 0)',
            fillColor: 'rgb(' + red + ', 0, 0)',
            fillOpacity: 0.5,
            radius: mag * 12000,
            weight: 1
        }).bindPopup(`<h2>${place}</h2> <hr> <h3>Date: ${time}</h3> <hr> <h3>Magnitude: ${mag}, Depth: ${depth}</h3>`).addTo(myMap);

    });

    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend'),
        grades = colorLabels,
        colors = colorScales,
        labels = [];

    // Add title to the legend
    div.innerHTML = '<h1>Earthquake Depth</h1>'
    
    // Loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        // Add rectangle filled with respective color
        div.innerHTML +=
            '<span style="background-color:' + colors[i] + ';width:35px;height:25px;display:inline-block;margin-right:5px;"></span>' +
            grades[i] + '<br>';
    }
    div.style.backgroundColor = "white";
    div.style.borderRadius = "10px";
    return div;
    };
    
    // Adding the legend to the map
    legend.addTo(myMap);
  
});

  