var fileUpload = require('express-fileupload');
var express = require('express');
var router = express.Router();


var UploadController = require('../controllers/UploadController');

// default options for express-fileupload
router.use(fileUpload({
    limits: {
        fileSize: 1000000, //1mb
    },
    abortOnLimit:true
})
);


router.put('/:coleccion/:id', UploadController.imgUpload);// Subida de imagenes por coleccion


module.exports = router;