const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: '4amood-uploads',
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `uploads/${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
});

module.exports = {upload}