// mapbox map
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/outdoors-v11", // style URL
  center: campground.geometry.coordinates, // [lng, lat]
  zoom: 9 // starting zoom
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(new mapboxgl.Popup().setHTML(`<h3>${campground.title}</h3>`))
  .addTo(map);
