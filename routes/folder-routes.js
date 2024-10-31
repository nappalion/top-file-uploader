const express = require("express");
const folderController = require("../controllers/folder-controller");

const router = express.Router();

router.get("/", folderController.foldersGet);
router.post("/create", folderController.createPost);
router.post("/delete", folderController.deletePost);

module.exports = router;
