const _ = require("lodash");
const validator = require("validator");
const { User } = require("../../../models/User/user");


const validatePutInput = async( data, id) => {
    // data {email, dayOfBirth, phoneNumber, fullName. }
    let errors = {};

    data.email = _.get(data, "email", "");
    data.dayOfBirth = _.get(data, "dayOfBirth", "");
    data.phoneNumber = _.get(data, "phoneNumber", "");
    data.fullName = _.get(data, "fullName", "");

    // email
    if (validator.isEmpty(data.email)) {
        errors.email = "Nhập email.";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Email không hợp lệ.";
    } else {
        const user = await User.findOne({
            _id: { $ne: id },
            email: data.email
        });
        if (user) errors.email = "Email  tồn tại";
    }

    // date of birth
    if (validator.isEmpty(data.dayOfBirth)) {
        errors.dayOfBirth = "Nhập ngày sinh";
    }

    // full name
    if (validator.isEmpty(data.fullName)) {
        errors.fullName = "Nhập họ tên";
    }

    //phone
    if (validator.isEmpty(data.phoneNumber)) {
        errors.phoneNumber = "Nhập Số điện thoại";
    } else if (!validator.isLength(data.phoneNumber, { min: 1, max: 10})) {
        errors.phoneNumber = "Số điện thoại có ít nhất 1 ký tự.";
    } else {
        const user = await User.findOne({
            _id: { $ne: id },
            phoneNumber: data.phoneNumber
        });
        if (user) errors.phoneNumber = "Số điện thoại tồn tại"
    }

    return {
        isValid: _.isEmpty(errors), // true (pass het tat ca validate), false (ko pass it nhat 1 field)
        errors // {email: email da ton tai, password: phai it nhat 8 ky tu}
    };
};

module.exports = 
    validatePutInput
;
