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
