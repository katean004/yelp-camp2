const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateCampground, isLoggedIn, isAuthor } = require("../middleware");
// multer setup
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });

// campgrounds controllers
const campgroundsController = require("../controllers/campgrounds");

router
  .route("/")
  // all campgrounds route
  .get(catchAsync(campgroundsController.index))
  // post new campground to all campgrounds route
  .post(
    isLoggedIn,
    // multer parses multipart form data
    upload.array("image"),
    validateCampground,
    catchAsync(campgroundsController.createCamp)
  );

// multer-storage-cloudinary helps upload files multer is parsing to cloudinary

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
    upload.array("image"),
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
