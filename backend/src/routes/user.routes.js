const express = require('express');
const router = express.Router();
const multer = require('multer');
const { register, login, ViewAll, ViewProfile } = require('../controllers/user.controller');
const path = require('path');

module.exports = server => {

    const storage = multer.diskStorage({
        destination: function (request, file, callback) {
            callback(null, 'uploads/user');
        },
        filename: function (request, file, callback) {
            callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
        }
    })

    const upload = multer({ storage: storage });

    router.post('/register', upload.single('image'), register);
    router.post('/login', upload.none(), login);
    router.post('/view-all',upload.none(),ViewAll);
    router.post('/view-profile',upload.none(),ViewProfile);


   
    server.use('/api/website/user', router);
}



