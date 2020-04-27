const jwt = require('jsonwebtoken');

// ======================================
// Verificar Token
// ======================================

let verificaToken = (req, res, next) => {

    let token = req.get('token'); // recibimos el token

    // jwt.verify recibe 3 argumentos 
    // 1: token
    // 2: el SEED
    // 3: callback

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        // dentro del objeto encriptado viene el usuario
        req.usuario = decoded.usuario;
        next();

    });
};

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

module.exports = {
    verificaToken,
    verificaAdmin_Role
};