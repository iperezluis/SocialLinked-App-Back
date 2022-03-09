const { Schema, model } = require("mongoose");
//asi lo vamos a filtrar en la base de datos este modelo
const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
});

UsuarioSchema.method("toJSON", function () {
  // aqui desestructuramos todo lo que esta dentro del objecto UsuarioSchemapara extraer el id y enviar todo lo demas ...object
  const { __v, _id, password, ...object } = this.toObject();

  object.uid = _id;
  return object;
});
//aqui vamos aexportarlo a mongoDB usando el model que extraimos de mongoosey  y le vamos a mandar 'Usuario' como nombre de la coleccion y depsues UsuarioShcema que seria el modelo de la data
module.exports = model("Usuario", UsuarioSchema);
