// =================================================================
// Puerto
//  =================================================================

process.env.PORT = process.env.PORT || 3000;




// ===================================== 
// Entorno
// =====================================
// process.env.NODE_ENV es una variable que establece heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // si no existe se supone que estamos en desarrollo

// ===================================== 
// Vencimiento del Token
// =====================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ===================================== 
// Semilla de autenticacion
// =====================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



// ===================================== 
// Base de datos
// =====================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ===================================== 
// Google Client ID
// =====================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '600599548914-e7v3edn7elvumv3rcvvds5171slbicik.apps.googleusercontent.com';