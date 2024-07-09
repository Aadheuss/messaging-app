const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// Set up environment variables
require("dotenv").config();

// Import database configuration
require("./config/mongoConfig");

//passport-local authentication components
const passport = require("passport");
require("./config/passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set up session
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: "sessions",
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.session());
app.use(cors({ credentials: true, origin: process.env.ORIGIN }));

app.use("/", indexRouter);
app.use("/", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send error message
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status,
      message:
        req.app.get("env") === "development"
          ? err.message
          : err.status < 500
          ? err.message
          : "server error",
      details: err.details,
    },
  });
});

module.exports = app;
