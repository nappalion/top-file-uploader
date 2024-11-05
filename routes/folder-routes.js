const express = require("express");
const folderController = require("../controllers/folder-controller");

const router = express.Router();

router.get("/", folderController.homeGet);
router.post("/create", folderController.createPost);
router.post("/delete", folderController.deletePost);
router.post("/update", folderController.updatePost);
router.post("/share", folderController.sharePost);
router.get("/share/getShareUrl/:folderId", folderController.shareUrlGet);
router.get("/share/:shareId", folderController.shareGet);
router.get("/*", folderController.foldersGet);

module.exports = router;
