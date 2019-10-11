const mongoose = require('mongoose');

const ProvinceSchema = new mongoose.Schema({
    
    SolrID: String,
    Title: String,    
    ID: Number    
});

const Province = mongoose.model('Province', ProvinceSchema, 'Provinces');

module.exports = {
    ProvinceSchema,
    Province
};
