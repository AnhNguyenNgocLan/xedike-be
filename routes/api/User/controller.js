const { User } = require("../../../models/User/user");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validatePostInput = require("../../../validations/User/ValidatePostInput");
const validatePassword = require("../../../validations/User/ValidateMyPassword");
const validateUpdateInfoInput = require("../../../validations/User/ValidateMyInfo");

// Add a new user
module.exports.createUser = async (req, res, next) => {
    const {
        email,
        password,
        fullName,
        userType,
        phoneNumber,
        dayOfBirth
    } = req.body;

    const { errors, isValid } = await validatePostInput(req.body);
    console.log(errors);
    if (!isValid) return res.status(400).json(errors);

    const newUser = new User({
        email,
        password,
        fullName,
        userType,
        phoneNumber,
        dayOfBirth
    });

    bcryptjs.genSalt(10, (err, salt) => {
        if (err) return res.json(err);
        bcryptjs.hash(password, salt, (err, hash) => {
            if (err) return res.json(err);
            newUser.password = hash;

            newUser
                .save()
                .then(user => {
                    res.status(200).json(user);
                })
                .catch(err => res.json(err));
        });
    });
};

// Get list of users
module.exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.json(err));
};

// Get user by id
module.exports.getUserById = (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
        .select("-__v -password")
        .then(user => {
            if (!user)
                return Promise.reject({
                    status: 404,
                    message: "User not found"
                });

            res.status(200).json(user);
        })
        .catch(err => {
            res.status(err.status).json({ message: err.message });
        });
};

// Update User
module.exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { errors, isValid } = await validateUpdateInfoInput(req.body, id);
    if (!isValid) return res.status(400).json(errors);

    User.findById(id)
        .select("-password -__v")
        .then(user => {
            Object.keys(req.body).forEach(field => {
                user[field] = req.body[field];
            });
            user.save()
                .then(user => {
                    res.status(200).json(user);
                })
                .catch(err => res.json(err));
        })
        .catch(err => {
            if (!err.status) return res.json(err);
            res.status(err.status).json(err.message);
        });
};

//Update Password
module.exports.updatePassword = async (req, res, next) => {
    const { id } = req.params;
    const { errors, isValid } = await validatePassword(req.body);
    const { password, newPassword } = req.body;

    console.log(errors);

    // if (!isValid) return res.status(400).json(errors);
    User.findById(id)
        .select("-__v")
        .then(user => {
            if (!isValid)
                return Promise.reject({
                    status: 400,
                    message: errors
                });
            bcryptjs.compare(password, user.password, (err, isMatch) => {
                if (!isMatch)
                    return res
                        .status(400)
                        .json({ password: "Password is incorrect!" });

                bcryptjs.genSalt(10, (err, salt) => {
                    if (err) return res.json(err);
                    bcryptjs.hash(newPassword, salt, (err, hash) => {
                        if (err) return res.json(err);
                        user.password = hash;

                        user.save()
                            .then(user => {
                                res.status(200).json(user);
                            })
                            .catch(err => res.json(err));
                    });
                });
            });
        })
        .catch(err => {
            if (!err.status) return res.json(err);

            res.status(err.status).json(err.message);
        });
};

// User Login
module.exports.login = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user)
                return Promise.reject({
                    status: 400,
                    message: "Wrong email or password."
                });

            bcryptjs.compare(password, user.password, (err, isMatch) => {
                if (!isMatch)
                    return res.status(400).json("Wrong email or password");

                const payload = {
                    id: user._id,
                    email: user.email,
                    userType: user.userType,
                    fullName: user.fullName
                };

                

                jwt.sign(
                    payload,
                    process.env.SECRET_KEY,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if (err) res.json(err);
                        res.status(200).json({
                            success: true,
                            token
                        });
                    }
                );
            });
        })
        .catch(err => {
            if (!err.status) return res.json(err);
            console.log(err);

            res.status(err.status).json(err.message);
        });
};

// Delete user
module.exports.deleteUserById = (req, res, next) => {
    const { id } = req.params;
    User.deleteOne({ _id: id })
        .then(result => res.status(200).json(result))
        .catch(err => res.json(err));
};
