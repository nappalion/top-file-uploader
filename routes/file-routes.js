const express = require("express");
const fileController = require("../controllers/file-controller");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.get("/download/:id", fileController.downloadGet);
router.post("/create", upload.single("file_upload"), fileController.createPost);
router.post("/update", fileController.updatePost);
router.post("/delete", fileController.deletePost);

module.exports = router;
