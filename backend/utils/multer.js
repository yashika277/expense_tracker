const multer = require("multer");

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads");
    },
    filename: (req, file, callback) => {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1E9);
        callback(null, `${timestamp}-${randomSuffix}-${file.originalname}`);
    }
});

const fileUpload = multer({ storage: fileStorage });

module.exports = fileUpload;
