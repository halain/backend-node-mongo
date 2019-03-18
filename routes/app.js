var express = require('express');
var app = express.Router();

app.get('/', (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición correcta'
    });

});

module.exports = app;