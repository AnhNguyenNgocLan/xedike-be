const express = require("express");
const router = express.Router();
const vehicleController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth");
const uploadImage = require("../../../middlewares/uploadImage");

router.post(
    "/add-vehicle",
    authenticate,
    authorize(["driver"]),
    vehicleController.createVehicle
);
router.post(
    "upload-vehicle-img/:id",
    uploadImage("avatar", vehicleController.uploadVehicleImage)
);

module.exports = router;
