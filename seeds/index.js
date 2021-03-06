const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelper");
const Campground = require("../models/campground");

// mongoose connection setup
mongoose.connect("mongodb://localhost:27017/camps");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Mongo Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 50 + 10);
    const camp = new Campground({
      author: "6164be4e6372c210854ccb16",
      geometry: {
        type: "Point",
        coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      },
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/db8f5rrc6/image/upload/v1634098198/YelpCamp2/n0tnjfkjgwnty4c3bykh.jpg",
          filename: "YelpCamp2/n0tnjfkjgwnty4c3bykh"
        }
      ],
      description:
        "Wilderness Lakes Resort is a flat, 80-acre RV Resort in California with fishing canals that weave throughout the park. As a centrally-located RV camp, it is close to shopping, hospitals and freeways in California's Los Angeles region. The surrounding area has been changing quite dramatically with housing projects on two sides and dairy farms on the other.",
      price
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
