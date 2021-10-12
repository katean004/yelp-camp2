const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");

// user controllers
const usersController = require("../controllers/users");

router
  .route("/register")
  // get register form route
  .get(usersController.renderRegisterForm)
  // post register route to create user
  .post(catchAsync(usersController.registerUser));

router
  .route("/login")
  // get login form route
  .get(usersController.renderLoginForm)
  // user login route
  // passport middleware with local strategy for user authentication
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login"
    }),
    usersController.login
  );

// logout route
router.get("/logout", usersController.logout);

module.exports = router;
