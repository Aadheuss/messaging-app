const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");

router.post("/user/:id/message", messageController.message_post);

module.exports = router;
