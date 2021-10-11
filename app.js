const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campgroundSchema } = require("./joiSchemas");
const catchAsync = require("./utils/catchAsync");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const ExpressError = require("./utils/ExpressError");

// mongoose connection setup
mongoose.connect("mongodb://localhost:27017/camps");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Mongo Database connected");
});

// express rest routes
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// parse req.body
app.use(express.urlencoded({ extended: true }));
// method override for put and patch reqs
app.use(methodOverride("_method"));

// joi schema serverside validation middleware
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

app.get("/", (req, res) => {
  res.render("home");
});

// all campgrounds route
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// get new campgrounds form route
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// post new campground to all campgrounds route
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// get specific campground route
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

// get edit campground form route
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

// update campground info route
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    // const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// delete campground post route
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    // const { id } = req.params;
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

// path only runs when no other routes match and didn't respond
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on Port 3000!");
});
