const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const messageRouter = require("./message");
const inboxRouter = require("./inbox");

router.post("/signup", userController.user_signup_post);

router.get("/login", userController.user_login_get);
router.post("/login", userController.user_login_post);
router.get("/logout", userController.user_logout_get);
router.use("/user", inboxRouter);
router.get("/user/:id", userController.user_get);
router.use("/", messageRouter);

module.exports = router;
