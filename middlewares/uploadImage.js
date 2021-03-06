const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
    secretAccessKey: process.env.SECRETACCESSKEY,
    accessKeyId: process.env.ACCESSKEYID,
    region: 'us-east-2',
    signatureVersion: 'v4'
});

const uploadImage = type => {
    const upload = multer({
        storage: multerS3({
            s3: new aws.S3(),
            bucket: 'xedike',
            acl: 'public-read',
            metadata: function(req, file, cb) {
                cb(undefined, { fieldName: 'META_DATA' });
            },
            key: function(req, file, cb) {
                if (file.mimetype === 'application/octet-stream') type = '.jpg';
                cb(null, type + '/' + Date.now() + '-' + file.originalname);
            }
        })
    });
    return upload.single(type);
};

module.exports = uploadImage;
