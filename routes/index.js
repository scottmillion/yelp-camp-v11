const
  express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require("../models/user");

// ROOT ROUTE
router.get("/", (req, res) => {
  res.render("landing");
});

// =====================
// AUTH ROUTES
// =====================

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// =====================
// LOGIN LOGOUT ROUTES
// =====================

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), (req, res) => {


});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You have logged out successfully.");
  res.redirect("/campgrounds");
})

module.exports = router;