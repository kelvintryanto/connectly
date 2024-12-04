const express = require("express");
const roomChatController = require("../controllers/roomChatController");
const middlewareUpload = require("../utils/multer");
const router = express.Router();

router.get(`/`, roomChatController.read);
router.post(`/`, middlewareUpload, roomChatController.create);
router.get(`/total`, roomChatController.readAll);
router.post(`/join/:id`, roomChatController.join);
router.delete(`/leave/:id`, roomChatController.leave);
router.get(`/:id`, roomChatController.detail);
router.put(`/:id`, roomChatController.edit); // next
// router.delete(`/:id`, roomChatController.delete); // next

module.exports = router;
