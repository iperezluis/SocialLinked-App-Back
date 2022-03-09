const { Schema, model } = require("mongoose");
//asi lo vamos a filtrar en la base de datos este modelo
const MessageSchema = Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "Usuario", //que va  ahacer una referencia a la coleccion de 'Usuarios'
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "Usuario", //que va  ahacer una referencia a la coleccion de 'Usuarios'
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String
    },
  },
  { timestamps: true } //le agregamos esto para que mongo le asigne la fecha de creacion y de ultima modificacion
);

MessageSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});
//aqui vamos aexportarlo a mongoDB usando el model que extraimos de mongoosey  y le vamos a mandar 'Message' como nombre de la coleccion y depsues MessageShcema que seria el modelo de la data
module.exports = model("Message", MessageSchema);
