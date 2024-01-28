var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { user: req.user });
});

router.get("/login", function (req, res, next) {
  const errorMessages = req.flash("error");
  res.render("login", { user: req.user, messages: errorMessages });
});

router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect("/");
  });
});

module.exports = router;
