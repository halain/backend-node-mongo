var Hospital = require('../models/Hospital');
var Medico = require('../models/Medico');
var Usuario = require('../models/Usuario');

var busquedaController = {};

// =======================================
// Busqueda por coleccion
// =======================================
busquedaController.searchOnCollection = (req, res) => {
    
        var tabla = req.params.collection;
        var termino = req.params.termino;
        var regex = new RegExp( termino, 'i');
        var promesa;
    
        switch (tabla) {
            case 'usuarios':
                promesa = buscarUsuarios(regex);
                break;
        
            case 'medicos':
                promesa = buscarMedicos(regex);
                break;
        
            case 'hospitales':
                promesa = buscarHospitales(regex);
                break;
        
            default:
                return  res.status(400).json({
                        ok: false,
                        mensaje: 'Valores permitidos usuarios, medicos o hospitales ',
                        error: 'Coleccion no valida'
                });
        }
    
        promesa.then(result=>{
            res.status(200).json({
                ok: true,
                coleccion: tabla,
                [tabla]: result
            });
        });
   
};// fin busquedaController.searchOnCollection

// =======================================
// Busqueda general
// =======================================
busquedaController.searchAll = (req, res) => {
    
    var termino = req.params.termino;
    var regex = new RegExp( termino, 'i');

    Promise.all( [ 
            buscarHospitales( regex ), 
            buscarMedicos( regex ),
            buscarUsuarios( regex )
        ] )              
        .then ( respuestas => {
            var [hospitales, medicos, usuarios] = respuestas;
            res.status(200).json({
                ok: true,
                hospitales: hospitales,
                medicos: medicos,
                usuarios: usuarios
            });
        }).catch( err => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error realizando la busqueda',
                errors: err
            });
        });
};// fin busquedaController.searchAll


function buscarHospitales( regex ){
    return new Promise( (resolve, reject) => {
        Hospital.find({'nombre': regex})
            .populate('usuario','nombre email role')
            .exec( (err, hospitales) => {
            if ( err ){
                reject('Error al buscar hospitales', err);    
            }else {
                resolve (hospitales); // respuesta de la funcion
            }
        });
    });
}

function buscarMedicos( regex ){
    return new Promise( (resolve, reject) => {
        Medico.find({'nombre': regex})
            .populate('usuario','nombre email role')
            .populate('hospital')
            .exec( (err, medicos) => {
            if ( err ){
                reject('Error al buscar medicos', err);   
            }else {
                resolve (medicos);
            }
        });
    });

}

function buscarUsuarios( regex ){
    return new Promise( (resolve, reject) => {
        Usuario.find({},'nombre email role')
                .or( [ {'nombre': regex}, {'email':regex}] )
                .exec((err, usuarios )=>{
                    if ( err ){
                        reject('Error al buscar usuarios', err);   
                    }else {
                        resolve (usuarios); // respuesta d ela funcion
                    }
                })
    });
}





module.exports = busquedaController;
