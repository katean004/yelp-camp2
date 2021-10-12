const express = require("express");
// express router has separate params so need to merge
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

// review controllers
const reviewsController = require("../controllers/reviews");

// post new review to specific campground route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewsController.createReview)
);

// delete specific review route
// remove review reference in campground and the review itself
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewsController.deleteReview)
);

module.exports = router;
