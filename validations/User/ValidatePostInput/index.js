const _ = require("lodash");
const validator = require("validator");
const { User } = require("../../../models/User/user");

const validatePostInput = async data => {
    // data {email, password, dayOfBirth, userType,... }
    let errors = {};
    data.email = _.get(data, "email", "");
    data.password = _.get(data, "password", "");
    data.confirmPassword = _.get(data, "confirmPassword", "");
    data.dayOfBirth = _.get(data, "dayOfBirth", "");
    data.userType = _.get(data, "userType", "");
    data.phoneNumber = _.get(data, "phoneNumber", "");
    data.fullName = _.get(data, "fullName", "");

    // email
    if (validator.isEmpty(data.email)) {
        errors.email = "Nhập email.";
        // } else if (!validator.isEmail(data.email)) {
        //   errors.email = "Email is invalid";
    } else {
        const user = await User.findOne({ email: data.email });
        if (user) errors.email = "Email đã tồn tại";
    }

    // password
    if (validator.isEmpty(data.password)) {
        errors.password = "Nhập mật khẩu";
    } else if (!validator.isLength(data.password, { min: 1 })) {
        errors.password = "Mật khẩu có ít nhất 1 ký tự.";
    }

    if (validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Nhập mật khẩu xác minh.";
    } else if (!validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "Mật khẩu không trùng nhau.";
    }

    // date of birth
    if (validator.isEmpty(data.dayOfBirth)) {
        errors.dayOfBirth = "Nhập ngày sinh.";
    }

    // full name
    if (validator.isEmpty(data.fullName)) {
        errors.fullName = "Nhập họ tên.";
    }

    // user type
    if (validator.isEmpty(data.userType)) {
        errors.userType = "Chọn phân loại người dùng.";
    } else if (
        !validator.equals(data.userType, "driver") &&
        !validator.equals(data.userType, "passenger") &&
        !validator.equals(data.userType, "admin")
    ) {
        errors.userType = "User type invalid";
    }

    //phone
    if (validator.isEmpty(data.phoneNumber)) {
        errors.phoneNumber = "Nhấp số điện thoại.";
    } else if (!validator.isLength(data.phoneNumber, { min: 1, max: 10 })) {
        errors.phoneNumber = "Số điện thoại từ 1 đến 10 ký tự";
    } else if (!validator.isNumeric(data.phoneNumber)) {
        errors.phoneNumber = "Chỉ nhập số.";
    }

    return {
        isValid: _.isEmpty(errors), // true (pass het tat ca validate), false (ko pass it nhat 1 field)
        errors // {email: email da ton tai, password: phai it nhat 8 ky tu}
    };
};

module.exports = validatePostInput;
