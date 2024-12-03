const express = require(`express`);
const authController = require("../controllers/authController");

const roomChat = require(`../routers/roomChat`);
const chat = require(`../routers/chat`);
const { authentication } = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const errorHandler = require("../middleware/errorHandler");

const router = express.Router();

router.post(`/register`, authController.register);
router.post(`/login`, authController.login);
router.post(`/google-login`, authController.googleLogin);

router.use(authentication);
router.get(`/find`, authController.userData);
router.delete(`/clear/:id`, authorization, authController.clear);
router.use(`/roomchat`, roomChat);
router.use(`/chats`, chat);

router.use(errorHandler);
module.exports = router;
