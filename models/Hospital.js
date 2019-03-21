var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' } //qué usuario creó	el registro. => id
}, { collection: 'hospitales' }); // para que la coleccion se llame hostilaes y no hospitals que seria como se generaria a partir del modelo Hospital
module.exports = mongoose.model('Hospital', hospitalSchema);