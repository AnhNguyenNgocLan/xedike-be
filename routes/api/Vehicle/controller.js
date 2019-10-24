const { Vehicle } = require("../../../models/Vehicle/vehicle");

// Create Vehicle
module.exports.createVehicle = async (req, res, next) => {
    const driverID = req.user.id;

    const {
        vehicleBrand,
        numOfSeats,
        vehicleName,
        vehicleLisence,
        vehicleImage
    } = req.body;

    const newVehicle = new Vehicle({
        vehicleBrand,
        numOfSeats,
        vehicleName,
        vehicleLisence,
        vehicleImage,
        driverID
    });

    console.log(newVehicle);

    newVehicle
        .save()
        .select("-__v")
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => res.json(err));
};

// Get Vehicle
module.exports.getVehicle = (req, res, next) => {
    Vehicle.find()
        .then(vehicles => {
            res.status(200).json(vehicles);
            //console.log(provinces);
        })
        .catch(err => res.json(err));
};

// Update Vehicle
module.exports.updateVehicle = async (req, res, next) => {
    const { id } = req.params;

    Vehicle.findById(id)
        .select("-__v")
        .then(vehicle => {
            Object.keys(req.body).forEach(field => {
                vehicle[field] = req.body[field];
            });
            user.save()
                .then(vehicle => {
                    res.status(200).json(vehicle);
                })
                .catch(err => res.json(err));
        })
        .catch(err => {
            if (!err.status) return res.json(err);
            res.status(err.status).json(err.message);
        });
};

module.exports.uploadVehicleImage = (req, res, next) => {
    const { id } = req.params;

    Vehicle.findById(id)
        .then(vehicle => {
            vehicle.vehicleImage = req.file.location;

            return vehicle.save();
        })
        .then(vehicle => {
            res.status(200).json(vehicle);
        })
        .catch(err => {
            res.status(200).json({ message: err.message });
        });
};
