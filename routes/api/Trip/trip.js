const express = require("express");
const router = express.Router();
const tripController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth");

// POST   {host}/api/trips (PRIVATE - DRIVER)
router.post(
    "/",
    authenticate,
    authorize(['driver']),
    tripController.createTrip
);

//POST {host}/api/search?:queryString
router.post("/search?:querySring", tripController.searchTrips);

// GET    {host}/api/trips (PUBLIC)
router.get("/", tripController.getTrips);

// GET    {host}/api/trips/:id (PUBLIC)
router.get("/:tripId", tripController.getTripById);
/// api/trips/filter
// DELETE {host}/api/trips/:id (PRIVATE)
router.delete(
    "/:tripId",
    authenticate,
    authorize(["driver", "admin"]),
    tripController.deleteTrip
);

// PUT    {host}/api/trips/:id (PRIVATE)
router.put(
    "/:tripId",
    authenticate,
    authorize(["driver"]),
    tripController.updateTrip
);

// PUT    {host}/api/trips/:id (PRIVATE)
router.put(
    "/book-trip/:tripId",
    authenticate,
    // authorize(['passenger']),
    tripController.bookTrip
);

// PUT    {host}/api/trips/:id (PRIVATE)
router.put(
    "/finish-trip/:tripId",
    authenticate,
    authorize(["driver"]),
    tripController.finishTrip
);

module.exports = router;
