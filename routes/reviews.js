const express = require("express");
// express router has separate params so need to merge
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");

const { validateReview } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

// post new review to specific campground route
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully created new review");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// delete specific review route
// remove review reference in campground and the review itself
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // pulls review out of array that matches reviewId
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
