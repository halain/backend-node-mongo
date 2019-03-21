var express = require('express');
var router = express.Router();

var ImageController = require('../controllers/ImagenController');

router.get('/show/:collection/:img', ImageController.showImages);// Busqueda por coleccion


module.exports = router;