const express = require("express");
const chatController = require("../controllers/chatController");
const router = express.Router();

router.post(`/:id`, chatController.add);
// router.get(`/:id`, chatController.add);

module.exports = router;
