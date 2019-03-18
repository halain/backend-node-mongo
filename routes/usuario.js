var express = require('express');
var router = express.Router();

var UsuarioController = require('../controllers/UsuarioController');

var jwt = require('jsonwebtoken');

var { verificaToken } = require ('../middlewares/autenticacion');

// middleware para todas las rutas del usuario
// router.use(function timeLog(req, res, next) {
//     console.log('Rutas del usuario');
//     next();
//   });



router.get('/', UsuarioController.list);
router.post('/' , verificaToken, UsuarioController.store);
router.put('/:id', verificaToken, UsuarioController.update);
router.delete('/:id', verificaToken, UsuarioController.delete);


// usuarios
router.get('/2',(req, res) => {
    
    res.status(200).json({
        ok: true,
        mensaje: 'Get de  usuarios'
    });

});

// define the about route
router.get('/about', function(req, res) {
    res.send('About us');
  });

module.exports = router;