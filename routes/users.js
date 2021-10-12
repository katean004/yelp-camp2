const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

const usersController = require("../controllers/users");

// get register form route
router.get("/register", usersController.renderRegisterForm);

// post register route to create user
router.post("/register", catchAsync(usersController.registerUser));

// get login form route
router.get("/login", usersController.renderLoginForm);

// log user in route
// passport middleware with local strategy for user authentication
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
  }),
  usersController.login
);

// logout route
router.get("/logout", usersController.logout);

module.exports = router;
