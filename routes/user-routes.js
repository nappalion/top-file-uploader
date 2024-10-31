const express = require("express");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.get("/", userController.signupGet);
router.get("/signup", userController.signupGet);
router.post("/signup", userController.signupPost);
router.get("/login", userController.loginGet);
router.post("/login", userController.loginPost);
router.get("/login-failed", userController.loginFailedGet);
router.post("/logout", userController.logoutPost);

router.get("/home", userController.homeGet);

module.exports = router;
