module.exports.isLoggedIn = (req, res, next) => {
  // req.user from passport gives info from deserialized user
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};
