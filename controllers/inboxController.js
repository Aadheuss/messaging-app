const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");

const Inbox = require("../models/inbox");
const InboxParticipant = require("../models/inboxParticipant");
const Message = require("../models/message");

exports.inboxes_get = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    const err = new Error("You are not logged in!");
    err.status = 401;

    return next(err);
  }

  const userParticipationsInboxes = await InboxParticipant.find(
    {
      user: req.session.passport.user,
    },
    "inbox"
  )
    .populate({
      path: "inbox",
      populate: {
        path: "last_message",
        populate: { path: "user", select: "username" },
      },
    })
    .exec();

  const inboxes = await Promise.all(
    userParticipationsInboxes.map(async (data) => {
      const inbox = data.inbox;
      const participants = await InboxParticipant.find({
        inbox: inbox._id,
        user: { $ne: req.session.passport.user },
      })
        .populate("user", "username")
        .exec();

      return { inbox, participants };
    })
  );

  res.json({
    message: "success",
    inboxes,
  });
});

exports.inbox_get = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    const err = new Error("You are not logged in!");
    err.status = 401;

    return next(err);
  }

  if (!req.params.inboxid.match(/^[0-9a-fA-F]{24}$/)) {
    const err = new Error("the given inbox id is not valid");
    err.status = 404;
    return next(err);
  }

  const inboxparticipants = await InboxParticipant.find({
    inbox: req.params.inboxid,
  })
    .populate("inbox")
    .exec();

  const isUserAParticipant = inboxparticipants.find(
    (participant) => participant.user.toString() === req.session.passport.user
  );

  if (!isUserAParticipant) {
    const err = new Error("You are not authorized to access this inbox");
    err.status = 401;

    return next(err);
  }

  const messages = await Message.find({ inbox: req.params.inboxid })
    .populate("user", "username")
    .exec();

  res.json({
    message: "success",
    inbox: messages,
  });
});
