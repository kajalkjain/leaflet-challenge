// Define the URL to the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Create a function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 3;
}

// Create a function to determine marker color based on earthquake depth
function markerColor(depth) {
    if (depth > 90) return "#d73027";
    else if (depth > 70) return "#fc8d59";
    else if (depth > 50) return "#fee08b";
    else if (depth > 30) return "#d9ef8b";
    else if (depth > 10) return "#91cf60";
    else return "#1a9850";
}

// Fetch the earthquake data
d3.json(url).then(data => {
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    let earthquakes = L.geoJSON(data.features, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p><p>${new Date(feature.properties.time)}</p>`);
        }
    });

    // Create the base layer
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the map
    let myMap = L.map("map", {
        center: [20, 0],
        zoom: 2,
        layers: [streetmap, earthquakes]
    });

    // Create a legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "legend"),
            depths = [-10, 10, 30, 50, 70, 90],
            colors = ["#1a9850", "#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"];

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);
});
