const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

//
const options = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    // store array of review objectIds in campground model
    // references objectid from review model
    // one to many relationship
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
    ]
  },
  options
);

// virtual property for mapbox cluster map info
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<a href='/campgrounds/${this._id}'>${this.title}</a>`;
});

// mongoose middleware to delete reviews
// only runs if findByIdAndDelete() method is ran
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
