var Usuario = require('../models/Usuario');

// libreria para encriptar contraseñas
var bcrypt = require('bcryptjs');

//libreria para generar token una vez el login sea correcto JWT
var jwt = require('jsonwebtoken');

var { KEY_SECRET } = require('../config/config');

var loginController = {};

// =======================================
// Verificar login y si es correcto generar el token
// =======================================
loginController.postLogin = (req, res) => {

    var body = req.body;

    // buscar al usaurio por su email
    Usuario.findOne({ email: body.email}, (err,usuarioBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cuenta de usuario',
                errors: err 
            });
        }

        // no existe el correo del usuario en la bbdd
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas -email' ,
                errors: err
            });
        }
        
        // verificar la contraseña
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas -password' ,
                errors: err
            });
            
        }

        //Crear un token!!!  => jwt.sign({ payload }, seed-secret, {expiration});
        var token = jwt.sign({ usuario: usuarioBD }, KEY_SECRET, {expiresIn:14400}); //expiresIn:14400 = 4hrs
        
        usuarioBD.password =  ';('; //quitar la contraseña de la respuesta;

        // respuesta de login correcto y token generado
        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        });

    });


      
};// fin loginController.postLogin


module.exports = loginController;