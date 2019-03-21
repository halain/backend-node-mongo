var jwt = require('jsonwebtoken');
const { KEY_SECRET } = require('../config/config');

//  middleware para verificar token
exports.verificaToken = function (req, res, next) {

    //obtener el token por la url ?token=...
    // var token = req.query.token

    // por el header 
    // var token = req.headers.authorization.replace('Bearer ', ''); 
    
    var token = req.headers.authorization;

     if (!token) {
         return res.status(401).json({
             ok: false,
             mensaje: 'Falta Token de autorizacion',
         });
     }
 
     token = token.replace('Bearer ', '');



    // decode contiene payload del usuario que genero el token
    jwt.verify( token, KEY_SECRET ,(err, decoded) => {
      if (err) {
        return res.status(401).json({
          ok: false,
          mensaje: 'Token incorrecto',
          errors: err
        });
      }

      // ahora el payload (la info del usuario que genero el token ) estara disponible en el request
       req.usuario = decoded.usuario;

      next();

    });
    
    
  

};

