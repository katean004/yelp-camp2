const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  // store array of review objectIds in campground model
  // references objectid from review model
  // one to many relationship
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

module.exports = mongoose.model("Campground", CampgroundSchema);
