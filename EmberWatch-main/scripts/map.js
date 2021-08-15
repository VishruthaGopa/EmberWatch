var map;

$(document).ready(function () {

})

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

document.addEventListener("DOMContentLoaded", function () {
  var text = ""
  var x = ""


  let apiKey = '1be9a6884abd4c3ea143b59ca317c6b2';
  $.getJSON('https://ipgeolocation.abstractapi.com/v1/?api_key=' + apiKey, function (data) {
    text = JSON.stringify(data, null, 2);
    const myObj = JSON.parse(text);
    x = myObj["city"];
    document.getElementById("test").innerHTML = "<h1>" + x + " is the closest approximation of your location" + "</h1>";
  });

  mapboxgl.accessToken = 'pk.eyJ1IjoiZGVycGNoZWVzZTY5IiwiYSI6ImNrc2F4ZWlzdTAxYmYycHAzejVpeXFyNTEifQ.-_xZXfN2jAGYcOKfxTOOGA';
  map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-75.6, 45.4],
    zoom: 5
  })

  $.ajax({
    type: "GET",
    url: "/data/fires_short.csv",
    success: function (data) {
      arrays = csvToArray(data);
      arrays = filterData(1985, 1985, arrays);
      features = arrayToFeatures(arrays);
      drawMarkers(features);
    }
  });

  function drawMarkers(features) {
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

}, false)