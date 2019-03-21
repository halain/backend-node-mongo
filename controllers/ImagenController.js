const path = require('path');
const fs = require('fs');

var Hospital = require('../models/Hospital');
var Medico = require('../models/Medico');
var Usuario = require('../models/Usuario');



var imagenController = {};

// =======================================
// Mostrar imagenes por coleccion
// =======================================
imagenController.showImages = (req, res) => {

    var tipo = req.params.collection; //coleccion
    var img = req.params.img; //nombre de la imagen

    // path de la imagen
    var pathImage = path.resolve( __dirname, `../uploads/${ tipo }/${ img }` );
    
    // si existe la imagen
    if (fs.existsSync(pathImage)){
        res.sendFile(pathImage); // la regreso
    }else { // sino envio una imagen por defecto
        var pathNoImage = path.resolve( __dirname, '../assets/no-img.jpg' );
        res.sendFile(pathNoImage);
    } 
      
   
};// fin imagenController.showImg








module.exports = imagenController;
