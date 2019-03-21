


var Hospital = require('../models/Hospital');
var Medico = require('../models/Medico');
var Usuario = require('../models/Usuario');

// libreria para acceder y eliminar archivos en el servidor
var fs = require('fs');



var uploadController = {};

// =======================================
// Subida de imagenes por coleccion
// =======================================
uploadController.imgUpload = (req, res) => {
    
    var tipo = req.params.coleccion;//collecion
    var id = req.params.id;// _id de la coleccion

    //colecciones validas
    var collecValidas = ['hospitales', 'medicos', 'usuarios'];
    if (collecValidas.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Coleccion no valida',
            errors: { message: 'Colecciones validas: ' + collecValidas.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono archivo',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    var archivo = req.files.imagen;
    var fileNameOri = archivo.name.split('.');
    var fileExt = fileNameOri[fileNameOri.length - 1];


    // extenciones aceptadas
    var extValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extValidas.indexOf(fileExt.toLowerCase()) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Extensiones validas: ' + extValidas.join(', ') }
        });
    }

    // personalizar nombre de archivo
    var fileName = `${id}-${new Date().getMilliseconds()}.${fileExt}`;

    //mover archivo
    var path = `./uploads/${tipo}/${fileName}`;
    archivo.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        
        subirPorTipo(tipo, id, fileName, path, res);

    });   


};// fin uploadController.imgUpload

function subirPorTipo(tipo, id, fileName, path, res) {

    // Referencia a nuestros modelos coleccion: Modelo
    var Collection ={
        usuarios: Usuario,
        medicos: Medico,
        hospitales: Hospital
    };

    if (Collection.hasOwnProperty(tipo)) {
        
        Collection[tipo].findById(id, (err, collection)=>{
           
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al subir archivo',
                    errors: err
                });
            }

            if (!collection) {
                fs.unlink(path,(err)=>{ // elimino el archivo temporal
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al eliminar archivo temporal',
                            errors: {message: 'Error al eliminar archivo temporal ', err}
                        });
                    }
                });
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se enconctro la colleccion',
                });
            }

            // var pathViejo = './uploads/hospitales/'+hospital.img;
            var pathViejo = `./uploads/${tipo}/${collection.img}`;

            // si existe el archivo anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo,(err)=>{ // lo elimino
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al eliminar archivo',
                            errors: {message: 'Error al eliminar archivo ', err}
                        });
                    }
                });
            }

            collection.img = fileName;

            // actualizar el campo de img de la colleccion
            collection.save( (err, collectionActualizada)=> {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actulizar la imagen en la coleeccion',
                        errors: {message: 'Error al actulizar la imagen en la coleeccion ',err}
                    });
                }
                
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada',
                    [tipo]: collectionActualizada
                });

            });
        });


    }
    
}


module.exports = uploadController;
