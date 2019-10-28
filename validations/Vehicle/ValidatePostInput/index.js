const _ = require("lodash");
const validator = require("validator");
const { Vehicle } = require("../../../models/Vehicle/vehicle");

const validatePostInput = async data => {
    
    let errors = {};
    data.vehicleBrand = _.get(data, "vehicleBrand", "");
    data.numOfSeats = _.get(data, "numOfSeats", "");
    data.vehicleName = _.get(data, "vehicleName", "");
    data.vehicleLisence = _.get(data, "vehicleLisence", "");
    data.vehicleImage = _.get(data, "vehicleImage", "");    

    // vehicleBrand
    if (validator.isEmpty(data.vehicleBrand)) {
        errors.vehicleBrand = "Nhập hiệu xe.";        
    } 

    // numOfSeats
    if (validator.isEmpty(data.numOfSeats)) {
        errors.numOfSeats = "Nhập số chỗ ngồi.";        
    } 

    // vehicleName
    if (validator.isEmpty(data.vehicleName)) {
        errors.vehicleName = "Nhập tên xe.";        
    } 

    // vehicleLisence
    if (validator.isEmpty(data.vehicleLisence)) {
        errors.vehicleLisence = "Nhập biển số xe.";        
    }   
    else {
        const vehicle = await Vehicle.findOne({ vehicleLisence: data.vehicleLisence });
        if (vehicle) errors.vehicleLisence = "Xe đã tồn tại";
    } 

    return {
        isValid: _.isEmpty(errors), // true (pass het tat ca validate), false (ko pass it nhat 1 field)
        errors // {email: email da ton tai, password: phai it nhat 8 ky tu}
    };
};

module.exports = validatePostInput;
