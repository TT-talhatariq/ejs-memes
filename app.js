var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var memesRouter = require("./routes/memes");
const memeRouter = require("./routes/meme");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const fs = require("fs");
const flash = require("connect-flash");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));

// Middleware for our session
app.use(
  session({
    secret: "asgdyuasdjhgajsfdyi",
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware for our passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// read data from file
const users = JSON.parse(fs.readFileSync("./users.json", "utf8")).users;

// Configure passport-local to use username and password to authenticate users
passport.use(
  new LocalStrategy(function (username, password, done) {
    // Find the user with the given username
    const user = users.find((user) => {
      return user.username === username;
    });

    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }

    // Compare given password with the password in the database
    console.log(user.password, password);
    if (user.password !== password) {
      return done(null, false, { message: "Incorrect password." });
    }

    // Success
    return done(null, user);
  })
);

// Serialize user into the sessions
passport.serializeUser(function (user, done) {
  done(null, user.username);
});

// Deserialize user from the sessions
passport.deserializeUser(function (username, done) {
  // Find the user with the given username
  const user = users.find((user) => {
    return user.username === username;
  });

  done(null, user);
});

app.use("/", indexRouter);
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/overview",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.use("/", memesRouter);
app.use("/", memeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
