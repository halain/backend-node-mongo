var express = require('express');
var router = express.Router();

var LoginController = require('../controllers/LoginController');


router.post('/', LoginController.postLogin); //login normal
router.post('/google', LoginController.google); //login google

module.exports = router;