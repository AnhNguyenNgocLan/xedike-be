const mongoose = require("mongoose");

const VehicleSchema = mongoose.Schema({
    vehicleBrand: String,
    numOfSeats: Number,
    vehicleName: String,    
    vehicleLisence: String,
    vehicleImage: String,
    driverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Vehicle = mongoose.model("Vehicle", VehicleSchema, "Vehicle");

module.exports = { Vehicle, VehicleSchema };
