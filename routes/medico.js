var express = require('express');
var router = express.Router();

var MedicoController = require('../controllers/MedicoController');

var { verificaToken } = require ('../middlewares/autenticacion');


router.get('/', MedicoController.list);
router.post('/' , verificaToken, MedicoController.store);
router.put('/:id', verificaToken, MedicoController.update);
router.delete('/:id', verificaToken, MedicoController.delete);


module.exports = router;