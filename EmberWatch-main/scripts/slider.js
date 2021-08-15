const slideVal = document.getElementById("firstVal");
const slideVal2 = document.getElementById("secondVal");
const inputSlider = document.querySelector("input");
const nextSlider = document.getElementById("range2");
text = document.getElementById("slider-text");

map = document.getElementById("map");
currentMarkers = [];
inputSlider.value = 1985;
nextSlider.value = 1985;


inputSlider.oninput = (() => {
    let value = inputSlider.value;

    let max = inputSlider.value > nextSlider.value ? inputSlider.value : nextSlider.value;
    let min = inputSlider.value < nextSlider.value ? inputSlider.value : nextSlider.value;

    slideVal.textContent = value;
    text.innerHTML = "<h1> Range: " + min +"-"+ max + "</h1>"

    slideVal.style.left = (value - 1950) /70 * 100+ "%";
    if (map == null) {
        map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-75.6, 45.4],
            zoom: 5
        })
    }

    $.ajax({
        type: "GET",
        url: "/data/fires_short.csv",
        success: function (data) {
            arrays = csvToArray(data);
            arrays = filterData(min, max, arrays)
            features = arrayToFeatures(arrays);
            removeMarkers(currentMarkers);
            drawMarkers(features);
        }
    });


    function drawMarkers(features) {
        currentMarkers = [];
        features.forEach(function (marker) {

            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'marker';

            // make a marker for each feature and add to the map
            try {

                currentMarkers.push(new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .setPopup(new mapboxgl.Popup({ offset: 30 }) // add popups
                        .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
                    .addTo(map)
                );

            } catch (e) { }
            // console.log(marker.geometry.coordinates)
        });
    }

    function removeMarkers(markers) {
        for (var i = 0; i < currentMarkers.length; i++) {
            currentMarkers[i].remove();
        }
    }
});

nextSlider.oninput = (() => {
    let value = nextSlider.value;

    let max = inputSlider.value > nextSlider.value ? inputSlider.value : nextSlider.value;
    let min = inputSlider.value < nextSlider.value ? inputSlider.value : nextSlider.value;

    slideVal2.textContent = value;

    text.innerHTML = "<h1> Range: " + min +"-"+ max + "</h1>"

    slideVal2.style.left = (value - 1950) /70 * 100 + "%";
    if (map == null) {
        map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-75.6, 45.4],
            zoom: 5
        })
    }

    $.ajax({
        type: "GET",
        url: "/data/fires_short.csv",
        success: function (data) {
            arrays = csvToArray(data);
            arrays = filterData(min, max, arrays)
            features = arrayToFeatures(arrays);
            removeMarkers(currentMarkers);
            drawMarkers(features);
        }
    });


    function drawMarkers(features) {
        currentMarkers = [];
        features.forEach(function (marker) {

            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'marker';

            // make a marker for each feature and add to the map
            try {

                currentMarkers.push(new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .setPopup(new mapboxgl.Popup({ offset: 30 }) // add popups
                        .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
                    .addTo(map)
                );

            } catch (e) { }
            // console.log(marker.geometry.coordinates)
        });
    }

    function removeMarkers(markers) {
        for (var i = 0; i < currentMarkers.length; i++) {
            currentMarkers[i].remove();
        }
    }
});
function filterData(start, end, arrays) {
    result = []
    // console.log(arrays.length)
    for (var i = 0; i < arrays.length; i++) {
        // console.log(arrays[i][6]);
        // console.log(arrays[i][6] >= start && arrays[i][6] <= end)
        if (arrays[i][6] >= start && arrays[i][6] <= end) {
            result.push(arrays[i])
        }
    }
    // console.log(result)
    return result
}


function csvToArray(str, delimiter = ",") {

    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    // Map the rows
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        // console.log(values)
        // const el = headers.reduce(function (object, header, index) {
        //   object[header] = values[index];
        //   return object;
        // }, {});
        return values;
    });

    // return the array
    return arr;
}



function arrayToFeatures(data) {
    var features = [];
    for (let i = 0; i < data.length; i++) {
        var lat = data[i][4]
        var lon = data[i][5]
        var feature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [lon, lat]
            },
            properties: {
                title: data[i][1] + " " + "Year " + data[i][6] + " Month" + data[i][7],
                description: ""
            }


        }
        features.push(feature);
        // console.log(feature)
    }

    return features;
}