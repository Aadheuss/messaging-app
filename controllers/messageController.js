const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Message = require("../models/message");
const User = require("../models/user");

exports.message_post = [
  body("message", "Message must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("receiver", "Receiver can't be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    if (!req.isAuthenticated()) {
      const err = new Error("You are not logged in");
      err.status = 401;

      return next(err);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error("Failed to send the message");
      err.status = 422;
      err.details = errors.errors.map((object) => {
        return { msg: object.msg, path: object.path };
      });

      next(err);
    } else {
      const user = req.session.passport.user;
      const receiver = await User.findOne(
        { username: req.body.receiver },
        "_id"
      ).exec();

      if (receiver === null) {
        const err = new Error("Receiver does't exist");
        err.status = 404;

        return next(err);
      }

      const message = new Message({
        sender: user,
        receiver: receiver._id,
        message: req.body.message,
      });

      await message.save();
      res.json({
        message: "message successfully sent",
      });
    }
  }),
];
