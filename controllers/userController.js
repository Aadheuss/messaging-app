const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const User = require("../models/user");

// Create user
exports.user_signup = [
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
        });
      });
    }
  }),
];
