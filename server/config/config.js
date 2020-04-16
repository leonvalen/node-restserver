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
// Base de datos
// =====================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://restadmin:4zgFb9FW800pZfT0@cluster-rest-server-ne0om.mongodb.net/cafe?retryWrites=true&w=majority';
}
process.env.URLDB = urlDB;