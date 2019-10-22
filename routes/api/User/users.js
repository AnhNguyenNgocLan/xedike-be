const express = require("express");
const router = express.Router();
const userController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth");
const uploadImage = require("../../../middlewares/uploadImage");

router.get("/my-trips", authenticate, userController.getUserTrips);
router.post("/register", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/login", userController.login);
router.put("/:id", userController.updateUser);
router.put("/password/:id", userController.updatePassword);
router.delete(
    "/:id",
    authenticate,
    authorize(["driver"]),
    userController.deleteUserById
);
router.post("/upload-avatar/:id", uploadImage("avatar"), userController.uploadAvatar)

module.exports = router;
