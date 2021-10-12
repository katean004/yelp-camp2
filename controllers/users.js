const User = require("../models/user");
const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      else {
        req.flash("success", "Welcome to Yelp Camp!");
        res.redirect("/campgrounds");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", `Welcome back ${req.user.username}!`);
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  if (redirectUrl.includes("DELETE")) {
    res.redirect(307, redirectUrl);
  } else {
    res.redirect(redirectUrl);
  }
};

module.exports.logout = (req, res) => {
  // passport method
  req.logout();
  req.flash("success", "Logged out");
  res.redirect("/campgrounds");
};
