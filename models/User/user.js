const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    email: { type: String, require: true },
    password: { type: String, require: true },
    fullName: { type: String, require: true },
    userType: { type: String, require: true },
    phoneNumber: { type: String, require: true },
    dayOfBirth: { type: Date, require: true },
    registerDate: { type: Date, default: new Date() },
    numberOfTrips: { type: Number, default: 0 },
    numberOfKm: { type: Number, default: 0 },
    avatar: { type: String },
    rating: { type: Number, default: 0 }
});

const User = mongoose.model("User", UserSchema, "User");

module.exports = { User, UserSchema };
