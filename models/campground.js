const mongoose = require("mongoose");
const Review = require("./review");
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

// mongoose middleware to delete reviews
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // delete all reviews where id is in the document we just deleted
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
