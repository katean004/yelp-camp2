const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateCampground, isLoggedIn, isAuthor } = require("../middleware");

// campgrounds controllers
const campgroundsController = require("../controllers/campgrounds");

// all campgrounds route
router.get("/", catchAsync(campgroundsController.index));

// get new campgrounds form route
router.get("/new", isLoggedIn, campgroundsController.renderNewForm);

// post new campground to all campgrounds route
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgroundsController.create)
);

// get specific campground route
router.get("/:id", catchAsync(campgroundsController.showCamp));

// get edit campground form route
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundsController.renderEditForm)
);

// update campground info route
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgroundsController.editCamp)
);

// delete campground post route
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundsController.deleteCamp)
);

module.exports = router;
