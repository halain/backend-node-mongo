var express = require('express');
var router = express.Router();

var BusquedaController = require('../controllers/BusquedaController');

router.get('/coleccion/:collection/:termino', BusquedaController.searchOnCollection);// Busqueda por coleccion
router.get('/all/:termino', BusquedaController.searchAll);// Busqueda general



module.exports = router;