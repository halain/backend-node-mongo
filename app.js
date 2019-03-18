/**
 * Requires
 */
var express = require('express'); // framework para nodejs
var mongoose = require('mongoose'); //framework OM  para mongodb
var bodyParser = require('body-parser'); // parsear los parametros enviados en el body 



/**
 * Inicializar variables
 */

var app = express();


/**
 * Body Parser Config
 */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



/**
 * Importar rutas
 */
var appRoutes = require ('./routes/app');
var usuarioRoute = require ('./routes/usuario');
var loginRoute = require ('./routes/login');



/**
 * Conexion a la base de datos
 */

// Por la documentacion
//  mongoose.connect('mongodb://localhost:27017/hospitalDB',{useNewUrlParser: true });

//  var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     // Conectado
//     console.log("Base de datos: \x1b[32m%s\x1b[0m", " online")
// });
// Otra forma
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true })
    .then(() => {
        console.log("Base de datos: \x1b[32m%s\x1b[0m", " online");
    })
    .catch((err) => {
        console.error(err);
    });




/**
 * Rutas
 */
//middleware
app.use('/usuario',usuarioRoute);
app.use('/login',loginRoute);
app.use('/',appRoutes);







/**
 * Escuchar peticiones en el servidor
 */

app.listen(3000, () => {
    console.log("Servidor Node-Express puerto 3000: \x1b[32m%s\x1b[0m", " online");
});