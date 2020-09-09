const Campground = require("../models/campground");
const Comment = require("../models/comment");


const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        req.flash("error", "Campground not found.");
        res.redirect("back");
      } else {
        // We use .equals() method from mongoose because foundCampground.author.id is an object and req.user._id is a string, so we can't use ===.
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("back");
        }
      }
    });

  } else {
    req.flash("error", "Oops! Please log in first.");
    res.redirect("back"); // takes them to previous page they were on.
  }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("back");
        }
      }
    });

  } else {
    req.flash("error", "Oops! Please log in first.");
    res.redirect("back"); // takes them to previous page they were on.
  }
}

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Oops! Please log in first.");
  res.redirect("/login");
}

module.exports = middlewareObj;