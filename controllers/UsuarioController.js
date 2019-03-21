// Cargamos los modelos para usarlos posteriormente
var Usuario = require('../models/Usuario');

// libreria para encriptar contraseñas
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

var usuarioController = {}; 

// =======================================
// Obtener todos los usuarios
// =======================================
usuarioController.list = (req, res) => {

    // req.query.desde =>parametro opcional
    var desde = req.query.desde || 0;
    desde = Number(desde); // para forzar que desde sea un numero


    // return res.status(500).json({
    //     desde: desde
    // });

    // Usuario.find({},'campos a mostrar').exec(ejecutar la consulta)
    Usuario.find({}, 'nombre email img role')
        .skip(desde) // omitir los primeros desde registros
        .limit(5)
        .exec( (err, usuarios) => {

            // error en el servidor
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }

            //COnteo de Documentos
            Usuario.estimatedDocumentCount( (err, count) =>{
                
                // consulta satisfactoria de todos los usuarios
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: count
                });
            })

        });
};// fin usuarioController.list

// =======================================
// Guardar un usuario
// =======================================
usuarioController.store = function (req, res)  {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, salt), // contraseña encriptada
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando usuarios',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });

};// fin usuarioController.store


// =======================================
// Actualizar un usuario
// =======================================
usuarioController.update = (req, res) => {
    
    // obtener parametros de la url
    var id = req.params.id;
    
    // obtener data del usuario
    var body = req.body;

    Usuario.findById( id, (err, usuario) => {

        // error en el servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        // no existe el usuario
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id ${id} no existe`,
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        usuario.nombre = body.nombre; 
        usuario.email = body.email; 
        usuario.role = body.role; 

        usuario.save( (err, usuarioActualizado) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioActualizado.password = ';(';

            res.status(200).json({
                ok: true,
                usuario: usuarioActualizado
            });

        });

    });

}; // fin usuarioController.update


// =======================================
// Eliminar un usuario
// =======================================
usuarioController.delete = (req, res) => {
    
    // obtener parametros de la url
    var id = req.params.id;
        
    Usuario.findByIdAndDelete( id, (err, usuarioBorrado) => {

        // error en el servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar usuario',
                errors: err
            });
        }

        // no existe el usuario
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id ${id} no existe`,
                errors: { message: 'No existe un usuario con ese id' }
            });
        }
        
        res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            });

        });

}; // fin usuarioController.delete



module.exports = usuarioController;
