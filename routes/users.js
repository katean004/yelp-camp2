const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

// get register form route
router.get("/register", (req, res) => {
  res.render("users/register");
});

// post register route to create user
router.post(
  "/register",
  catchAsync(async (req, res, next) => {
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
  })
);

// get login form route
router.get("/login", (req, res) => {
  res.render("users/login");
});

// log user in route
// passport middleware with local strategy for user authentication
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
  }),
  (req, res) => {
    req.flash("success", `Welcome back ${req.user.username}!`);
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

// logout route
router.get("/logout", (req, res) => {
  // passport method
  req.logout();
  req.flash("success", "Logged out");
  res.redirect("/campgrounds");
});

module.exports = router;
