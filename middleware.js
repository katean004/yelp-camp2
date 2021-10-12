const { campgroundSchema } = require("./joiSchemas");
const { reviewSchema } = require("./joiSchemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");

module.exports.isLoggedIn = (req, res, next) => {
  // req.user from passport gives info from deserialized user
  if (!req.isAuthenticated()) {
    // store url user was previously at before authentication
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

// joi schema serverside campground validation middleware
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

// verify authorization middleware
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "Access denied");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// joi schema serverside review validation middleware
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};
