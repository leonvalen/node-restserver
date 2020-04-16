const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido' 
};

let Schema = mongoose.Schema; // crear el cascaron para crear esquemas

// definir equema de usuario
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});



// la contraseña jamas la vamos a regresar por ello vamos a modificar el método .toJSON
// ya que el método .toJSON en un esquema siempre se llama cada vez que se intenta imprimir 
usuarioSchema.methods.toJSON = function(params) { // se tiene que usar function para poder usar el this 
    let user = this; // a lo que sea que tenga en ese momento
    let userObject = user.toObject(); // tomar el objeto de usuario y tenemos todas las propiedades y métodos
    delete userObject.password; // borramos la propiedad que queremos

    return userObject;
}
// también se pueden agregar métodos al esquema que sería algo muy similar cuando hacemos modificaciones a los 
// proptotipos de los objetos en javascript



usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único.'})

module.exports = mongoose.model('Usuario', usuarioSchema);