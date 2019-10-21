const { Trip } = require("../../../models/Trip/trip");
const _ = require("lodash");
const url = require("url");
const moment = require("moment");
// Create Trip
module.exports.createTrip = (req, res, next) => {
    const driverID = req.user.id;
    const {
        locationFrom,
        locationTo,
        startTime,
        availableSeats,
        fee
    } = req.body;

    const newTrip = new Trip({
        driverID,
        locationFrom,
        locationTo,
        startTime: moment(startTime).valueOf(),
        availableSeats,
        fee
    });

    newTrip
        .save()
        .then(trip => {
            return Trip.findById(trip._id)
                .populate("driverID", "fullName")
                .select("-__v");
        })
        .then(result => {
            res.status(200).json(result);            
        })

        .catch(err => res.json(err));
};

module.exports.getTrips = (req, res, next) => {
    Trip.find()
        .populate("driverID")
        .then(trips => res.status(200).json(trips))
        .catch(err => res.json(err));
};

module.exports.getTripById = (req, res, next) => {
    const { tripId } = req.params;
    Trip.findById(tripId)
        .populate("driverID")
        .then(trip => {
            res.status(200).json(trip);            
        })
        .catch(err => res.json(err));
};

module.exports.deleteTrip = (req, res, next) => {
    const { tripId } = req.params;
    Trip.deleteOne({ _id: tripId })
        .then(result => res.status(200).json(result))
        .catch(err => res.json(err));
};

module.exports.updateTrip = (req, res, next) => {
    const { tripId } = req.params;
    const {
        locationFrom,
        locationTo,
        startTime,
        availableSeats,
        fee
    } = req.body;
    Trip.findById(tripId)
        .then(trip => {
            trip.locationFrom = locationFrom;
            trip.locationTo = locationTo;
            trip.startTime = startTime;
            trip.availableSeats = availableSeats;
            trip.fee = fee;

            return trip.save();
        })
        .then(trip => res.status(200).json(trip))
        .catch(err => res.json(err));
};

module.exports.bookTrip = (req, res, next) => {
    const passengerId = req.user.id;
    const { numberOfBookingSeats } = req.body;
    const { tripId } = req.params;
    
    Trip.findById(tripId)
        .then(trip => {
            if (trip.availableSeats < numberOfBookingSeats)
                return Promise.reject({
                    status: 400,
                    message: "Not enough seats"
                });

            const passenger = {
                passengerId,
                numberOfBookingSeats
            };

            trip.passengers.push(passenger);
            trip.availableSeats = trip.availableSeats - numberOfBookingSeats;

            return trip.save();
        })
        .then(trip => res.status(200).json(trip))
        .catch(err => {
            if (!err.status) return res.json(err);
            res.status(err.status).json({ message: err.message });
        });
};

module.exports.finishTrip = (req, res, next) => {
    const { tripId } = req.params;
    Trip.findById(tripId)
        .then(trip => {
            trip.isFinished = true;
            return trip.save();
        })
        .then(trip => res.status(200).json(trip))
        .catch(err => res.json(err));
};

module.exports.searchTrips = (req, res, next) => {
    let queryString = url.parse(req.url, true).query;

    let aaa = moment(queryString.startTime).valueOf();

    Trip.find()
        .and([
            { locationFrom: queryString.from },
            { locationTo: queryString.to },
            { availableSeats: { $gte: parseInt(queryString.slot) } }
            // { startTime: { $gte: aaa } }
            // { startTime: { $gte: parseInt(aaa) } }
            //])
        ])

        .populate("driverID", "fullName")
        .then(trip => {
            if (_.isEmpty(trip))
                return Promise.reject({ status: 404, message: "Not found!" });

            res.status(200).json(trip);
        })
        .catch(err => {
            if (!err.status) return res.json(err);
            res.status(err.status).json({ message: err.message });
        });
};
