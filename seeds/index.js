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
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt fuga repellat dolorum illum quia dolor architecto magnam, aspernatur nihil odio error, facilis ratione corrupti adipisci eaque repellendus aliquid accusantium quaerat.",
      price
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
