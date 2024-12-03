const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const middlewareUpload = upload.single("image");

module.exports = middlewareUpload;
