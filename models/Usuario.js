var mongoose = require('mongoose');
var mongooseHidden = require('mongoose-hidden')();
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValido ={
  values: ['ADMIN_ROLE','USER_ROLE'],
  message: '{VALUE} no es un role permitido'
};

// Crear el esquema. Contiene las propiedades del documento
var usuarioSchema = new Schema({
    nombre:  { type:String, required: [true, 'El nombre es necesario'] },
    email : { type:String, unique: true, required: [true, 'El correo es necesario'] },
    password : { type:String, required: [true, 'La contraseña es necesaria'] },
    img : { type:String, required: false },
    role : { type:String, required: [true, 'El role es necesario'], default:'USER_ROLE', enum:rolesValido },
    google : { type:Boolean, default:false },
    
  });
  
  usuarioSchema.plugin(mongooseHidden, {hidden: { _id: false , password: true } });
  usuarioSchema.plugin( uniqueValidator, { message: 'El campo {PATH} debe ser unico'});

  // Exportar el modelo Usuario asociado al esquema usuarioEsquema
  module.exports = mongoose.model('Usuario', usuarioSchema);

  