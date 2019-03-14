/**
 * Requires
 */
var express = require('express');
var mongoose = require('mongoose');



/**
 * Inicializar variables
 */
var app = express();



/**
 * Conexion a la base de datos
 */

// Version 1
// mongoose.connect('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true })
//         .then( () => {
//             console.log("Base de datos: \x1b[32m%s\x1b[0m", " online")
//             })
//         .catch( () => {
//             console.error(err);
//         });

// Por la documentacion
     mongoose.connect('mongodb://localhost:27017/hospitalDB',{useNewUrlParser: true });
    
     var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        // Conectado
        console.log("Base de datos: \x1b[32m%s\x1b[0m", " online")
    });




/**
 * Rutas
 */
app.get('/', (req, res)=>{

    res.status(200).json({
        ok: true,
        mensaje: 'Petición correcta'
    });

});



// Escuchar peticiones
app.listen(3000, ( ) => {
    console.log("Servidor Node-Express puerto 3000: \x1b[32m%s\x1b[0m", " online");
});