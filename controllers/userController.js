const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/user");

// Create user
exports.user_signup_post = [
  body("username", "Username must not be empty")
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 50 })
    .withMessage("Username must be less than 50 characters")
    .isAlphanumeric()
    .withMessage("username name must only contain letters and numbers")
    .escape()
    .custom(async (value, { req }) => {
      const usernameExist = await User.findOne({ username: value });

      if (usernameExist) {
        throw new Error("Username is already taken");
      }
    }),
  body("password", "Password must contain at least 8 characters")
    .trim()
    .isLength({ min: 8 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error("Failed to create user");
      err.status = 422;
      err.details = errors.errors.map((object) => {
        return { msg: object.msg, path: object.path };
      });

      next(err);
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });

        await user.save();
        res.json({
          message: "Successfully created the user",
          user: {
            username: req.body.username,
          },
        });
      });
    }
  }),
];

exports.user_login_get = (req, res, next) => {
  // Get rid of duplicate messages
  const messages = Array.from(new Set(req.session.messages));

  if (!req.isAuthenticated()) {
    const err = new Error("Failed to log in");
    err.status = 401;
    err.details = { msg: messages };

    return next(err);
  }

  res.json({
    message: "Successfully logged in",
    user: { _id: req.user._id },
  });
};

exports.user_login_post = [
  (req, res, next) => {
    if (req.user) {
      return res.json({
        message: "You are already logged in",
        user: {
          _id: req.user._id,
        },
      });
    }

    next();
  },
  // Validate and sanitize fields.
  body("username", "Please enter your username")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Please enter your password")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error("Please enter correct username and password!");
      err.status = 401;
      err.details = errors.errors.map((object) => {
        return { msg: object.msg, path: object.path };
      });

      next(err);
    } else {
      next();
    }
  }),
  passport.authenticate("local", {
    successRedirect: "login",
    failureRedirect: "login",
    failureMessage: true,
  }),
];
