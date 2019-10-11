const { Province } = require("../../../models/Province/province");

//Get Province

module.exports.getProvinces = (req, res, next) => {
    Province.find()
        .then(provinces => {
            res.status(200).json(provinces);
            //console.log(provinces);
        })
        .catch(err => res.json(err));
};
