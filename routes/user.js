const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const { authenticate } = require("../middlewares/auth");

router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.get("/details", authenticate, UserController.getDetails);

module.exports = router;
