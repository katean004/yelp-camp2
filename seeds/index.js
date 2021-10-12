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
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 50 + 10);
    const camp = new Campground({
      author: "6164be4e6372c210854ccb16",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
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
