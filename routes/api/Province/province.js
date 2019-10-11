const express = require("express");
const router = express.Router();
const ProvinceController = require("./controller");

// GET    {host}/api/Provinces (PUBLIC)
router.get('/', ProvinceController.getProvinces)

module.exports = router;
