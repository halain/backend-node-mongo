// Cargamos los modelos para usarlos posteriormente
var Medico = require('../models/Medico');
var Hospital = require('../models/Hospital');

// libreria para encriptar contraseñas
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

var medicoController = {}; 

// =======================================
// Obtener todos los medicos
// =======================================
medicoController.list = (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario','nombre email role')
        .populate('hospital')
        .exec( (err, medicos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });
            }

            Medico.estimatedDocumentCount( (err, count) => {
                
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: count
                });
            });

        });
};// fin medicoController.list

// =======================================
// Guardar un medico
// =======================================
medicoController.store = function (req, res)  {

    var body = req.body;
    var user_login_id= req.usuario._id; //del payload
     
    
    Hospital.findById(body.hospital, (err, hospital)=> {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: `El hospital con el id ${body.hospital} no existe`,
                errors: { message: 'No existe un hospital con ese id' }
            });
        }
        
        var hospital_id = hospital._id;

        var medico = new Medico({
            nombre: body.nombre,
            usuario: user_login_id,
            hospital: hospital_id
        });

        medico.save( (err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear medico',
                    errors: err
                });
            }
    
            res.status(201).json({
                ok: true,
                medico: medicoGuardado
            });
    
        });
    });

   

};// fin medicoController.store


// =======================================
// Actualizar un medico
// =======================================
medicoController.update = (req, res) => {
    
   
    var id = req.params.id;
    
    var body = req.body;

    var user_login = req.usuario._id;

    // return res.json({payload: req.usuario, logi:user_login});

    Medico.findById( id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: `El medico con el id ${id} no existe`,
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        // if (user_login!=medico.usuario) {
        //     return res.status(401).json({
        //         ok: false,
        //         mensaje: 'Ud no creo este medico',
        //         errors: { message: 'No pued emodificar un medico que no creo' }
        //     });
        // }

        medico.nombre = body.nombre; 
        medico.usuario = user_login; 
        // medico.img = body.img ? body.img : medico.img; 
        medico.hospital = body.hospital ? body.hospital : medico.hospital; 

        medico.save( (err, medicoActualizado) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoActualizado
            });

        });

    });

}; // fin medicoController.update


// =======================================
// Eliminar un medico
// =======================================
medicoController.delete = (req, res) => {
    
    var id = req.params.id; //id del hospital
    var user_login = req.usuario._id; // usuario logueado, del payload del jwt
        
    Medico.findByIdAndDelete( id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: `El medico con el id ${id} no existe`,
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        // if (user_login!=medicoBorrado.usuario) {
        //     return res.status(401).json({
        //         ok: false,
        //         mensaje: 'Ud no creo este medico',
        //         errors: { message: 'No puede eliminar un medico que no creo' }
        //     });
        // }
        
        res.status(200).json({
                ok: true,
                medico: medicoBorrado
            });

        });

}; // fin medicoController.delete



module.exports = medicoController;
