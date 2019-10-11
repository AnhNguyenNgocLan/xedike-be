const _ = require("lodash");
const validator = require("validator");
const { User } = require("../../../models/User/user");

const validatePostInput = async data => {
    // data {email, password, dayOfBirth, userType,... }
    let errors = {};
    console.log("loi", data);
    

    data.password = _.get(data, "password", "");
    data.newPassword = _.get(data, "newPassword", "");
    data.confirmNewPassword = _.get(data, "confirmNewPassword", "");

    // password
    if (validator.isEmpty(data.password)) {
        errors.password = "Nhập mật khẩu";
    } else if (!validator.isLength(data.password, { min: 1 })) {
        errors.password = "Mật khẩu có ít nhất 1 ký tự.";
    }
console.log(errors);

    // newPassword
    if (validator.isEmpty(data.newPassword)) {
        errors.newPassword = "Nhập mật khẩu mới.";
    } else if (!validator.isLength(data.newPassword, { min: 1 })) {
        errors.newPassword = "Mật khẩu mới có ít nhất 1 ký tự.";
    }

    // new password & confirmNewPassword
    if (validator.isEmpty(data.confirmNewPassword)) {
        errors.confirmNewPassword = "Nhập lại mật khẩu mới.";
    } else if (!validator.equals(data.newPassword, data.confirmNewPassword)) {
        errors.confirmNewPassword = "Xác minh mật khẩu mới không đúng.";
    }
console.log(errors);

    return {
        isValid: _.isEmpty(errors), // true (pass het tat ca validate), false (ko pass it nhat 1 field)
        errors // {email: email da ton tai, password: phai it nhat 8 ky tu}
    };
};

module.exports = validatePostInput;
