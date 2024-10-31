const express = require("express");
const fileController = require("../controllers/file-controller");

const router = express.Router();

router.get("/", fileController.filesGet);
router.post("/create", fileController.createPost);
router.post("/delete", fileController.deletePost);

module.exports = router;
