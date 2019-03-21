var express = require('express');
var router = express.Router();

var HospitalController = require('../controllers/HospitalController');

var { verificaToken } = require ('../middlewares/autenticacion');


router.get('/', HospitalController.list);
router.post('/' , verificaToken, HospitalController.store);
router.put('/:id', verificaToken, HospitalController.update);
router.delete('/:id', verificaToken, HospitalController.delete);


module.exports = router;