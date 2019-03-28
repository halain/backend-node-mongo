var Usuario = require('../models/Usuario');

// libreria para encriptar contraseñas
var bcrypt = require('bcryptjs');

//libreria para generar Token una vez el login sea correcto (JWT)
var jwt = require('jsonwebtoken');
var { KEY_SECRET } = require('../config/config');

// Para Google login, token
var { CLIENT_ID } = require('../config/config'); //id del cleinet de google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);



var loginController = {};

// =======================================
// Login normal y si es correcto generar el token
// =======================================
loginController.postLogin = (req, res) => {

    var body = req.body;

    // buscar al usaurio por su email
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

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
                mensaje: 'Credenciales incorrectas -email',
                errors: err
            });
        }

        // verificar la contraseña
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas -password',
                errors: err
            });

        }

        //Crear un token!!!  => jwt.sign({ payload }, seed-secret, {expiration});
        var token = jwt.sign({ usuario: usuarioBD }, KEY_SECRET, { expiresIn: 14400 }); //expiresIn:14400 = 4hrs

        // usuarioBD.password = ';('; //quitar la contraseña de la respuesta;

        // respuesta de login correcto y token generado
        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        });

    });


}; // fin loginController.postLogin


// =======================================
// Login Google
// =======================================
    async function verify(token) { 
        const ticket = await client.verifyIdToken({ 
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload(); //info del usuario
        // const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        
        return {
            nombre: payload.name,
            first_name: payload.given_name,
            last_name: payload.family_name,
            email: payload.email,
            img: payload.picture,
            google: true,
            payload: payload
        }
      }
loginController.google = async (req, res) => { // agregar async aqui para que funcione el await debajo

    var token = req.body.token;

    try {

        var googleUser = await verify(token); //contiene toda la informacion del usuario que hizo login con Google

    } catch (error) {
        res.status(403).json({
            ok: false,
            mensaje: 'Token no valido',
            errors: { message: 'Token de google inválido' }
        });
        return;
    }

    // verificar si existe el email en la base de datos
    Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
       
        if ( usuarioDB ) { // existe el usuario en la base de datos
            
            if ( usuarioDB.google === false ) { // el usuario ya se habia autenticado en el sistema con este correo 
                return res.status(400).json({ // y no se puede autenticar ahora con google
                    ok: false,
                    mensaje: 'Ya existe una cuenta con este correo, debe utilizar la autenticación normal'
                });
            }else { // es una cuenta de google. Generar un nuevo token y mandar la respuesta
                //Crear un token!!!  => jwt.sign({ payload }, seed-secret, {expiration});
                var token = jwt.sign({ usuario: usuarioDB }, KEY_SECRET, { expiresIn: 14400 }); //expiresIn:14400 = 4hrs
                // respuesta de login correcto y token generado
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            }

        }else { //es un usuario nuevo, hay que crearlo

            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = googleUser.google;
            usuario.password = 'no-passwrod-permit';
            
            usuario.save( (err, usuarioGuardado) =>{
                
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al crear usuario',
                        errors: err
                    });
                }

                if (!usuarioGuardado) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al intentar crear un nuevo usuario',
                        errors: err
                    });
                }
                // generar token de acceso  a recursos en nuestra app
                var token = jwt.sign({ usuario: usuarioGuardado }, KEY_SECRET, { expiresIn: 14400 }); //expiresIn:14400 = 4hrs
                // respuesta de login correcto y token generado
                res.status(200).json({
                    ok: true,
                    usuario: usuarioGuardado,
                    token: token,
                    id: usuarioGuardado._id
                });
            });

        }

    });


    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Login google ok',
    //     googleUser: googleUser
    // });

};




module.exports = loginController;