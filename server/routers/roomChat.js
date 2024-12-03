const express = require("express");
const roomChatController = require("../controllers/roomChatController");
const middlewareUpload = require("../utils/multer");
const router = express.Router();

router.get(`/total`, roomChatController.readAll);
router.get(`/`, roomChatController.read);
router.post(`/join/:id`, roomChatController.join);
router.get(`/:id`, roomChatController.detail);
router.post(`/`, middlewareUpload, roomChatController.create);
router.put(`/:id`, roomChatController.edit); // next
// router.delete(`/:id`, roomChatController.delete);  // next
router.delete(`/leave/:id`, roomChatController.leave);

module.exports = router;
