const express = require("express");
const router = express.Router();

const inboxController = require("../controllers/inboxController");

router.get("/inboxes", inboxController.inboxes_get);
router.get("/inbox/:inboxid", inboxController.inbox_get);

module.exports = router;
