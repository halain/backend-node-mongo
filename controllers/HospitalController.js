// Cargamos los modelos para usarlos posteriormente
var Hospital = require('../models/Hospital');

// libreria para encriptar contraseñas
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

var hospitalController = {};

// =======================================
// Obtener todos los hospitales
// =======================================
hospitalController.list = (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde)

    Hospital.find({})
        .skip(desde)
        .limit(5)
        // .populate('columna_relacionada','campos a mostrar')
        .populate('usuario','nombre email')
        .exec( (err, hospitales) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                });
            }

            Hospital.estimatedDocumentCount( (err,count) => {

                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: count
                });
            })

        });
};// fin hospitalController.list

// =======================================
// Guardar un hospital
// =======================================
hospitalController.store = function (req, res) {

    var body = req.body;
    var usuario_id = req.usuario._id; //del payload 

    var hospital = new Hospital({
        nombre: body.nombre,
        // img: body.img,
        usuario: usuario_id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospitale',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hopital: hospitalGuardado
        });

    });

};// fin hospitalController.store


// =======================================
// Actualizar un hospital
// =======================================
hospitalController.update = (req, res) => {


    var id = req.params.id;

    var body = req.body;

    var user_login = req.usuario._id;

    // return res.json({payload: req.usuario, logi:user_login});

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: `El hospital con el id ${id} no existe`,
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        // if (user_login!=hospital.usuario) {
        //     return res.status(401).json({
        //         ok: false,
        //         mensaje: 'Ud no creo este hospital',
        //         errors: { message: 'No pued emodificar un hospital que no creo' }
        //     });
        // }

        hospital.nombre = body.nombre;
        hospital.img = body.img ? body.img : hospital.img;
        hospital.usuario = user_login;

        hospital.save((err, hospitalActualizado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                hospital: hospitalActualizado
            });

        });

    });

}; // fin hospitalController.update


// =======================================
// Eliminar un hospital
// =======================================
hospitalController.delete = (req, res) => {

    var id = req.params.id; //id del hospital
    var user_login = req.usuario._id; // usuario logueado, del payload del jwt

    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: `El hospital con el id ${id} no existe`,
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        // if (user_login!=hospitalBorrado.usuario) {
        //     return res.status(401).json({
        //         ok: false,
        //         mensaje: 'Ud no creo este hospital',
        //         errors: { message: 'No puede eliminar un hospital que no creo' }
        //     });
        // }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

}; // fin hospitalController.delete



module.exports = hospitalController;
