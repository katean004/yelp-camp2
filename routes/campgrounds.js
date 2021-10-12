const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateCampground, isLoggedIn, isAuthor } = require("../middleware");

// campgrounds controllers
const campgroundsController = require("../controllers/campgrounds");

router
  .route("/")
  // all campgrounds route
  .get(catchAsync(campgroundsController.index))
  // post new campground to all campgrounds route
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campgroundsController.create)
  );

// get new campgrounds form route
router.get("/new", isLoggedIn, campgroundsController.renderNewForm);

router
  .route("/:id")
  // get specific campground route
  .get(catchAsync(campgroundsController.showCamp))
  // update campground info route
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgroundsController.editCamp)
  )
  // delete campground post route
  .delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCamp));

// get edit campground form route
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundsController.renderEditForm)
);

module.exports = router;
