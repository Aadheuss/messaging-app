const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");

router.post("/user/inbox/new/message", messageController.message_new_post);
router.post("/user/inbox/:inboxid/message", messageController.message_post);

module.exports = router;
