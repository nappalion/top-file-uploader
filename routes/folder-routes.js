const express = require("express");
const folderController = require("../controllers/folder-controller");

const router = express.Router();

router.get("/", folderController.homeGet);
router.post("/create", folderController.createPost);
router.post("/delete", folderController.deletePost);
router.get("/*", folderController.foldersGet);

module.exports = router;
