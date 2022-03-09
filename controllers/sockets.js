const Usuario = require("../models/user");
const Mensaje = require("../models/message");

//cuando el usuario se conecte y sew desconecte actualizamos y almacenamos en la  base de datos
const userConnected = async (uid) => {
  try {
    // const usuario = await Usuario.findByIdAndUpdate(uid, (online = true));
    const usuario = await Usuario.findById(uid);
    usuario.online = true;
    await usuario.save();
    return usuario;
  } catch (error) {
    console.log(error);
  }
};
const userDisconnected = async (uid) => {
  try {
    const usuario = await Usuario.findById(uid);
    usuario.online = false;
    await usuario.save();

    return usuario;
  } catch (error) {
    console.log(error);
  }
};
const getUsuarios = async () => {
  const users = await Usuario.find().sort("-online");
  return users;
};
//grabar mensaje en la database
const recordMessage = async (payload) => {
  try {
    const message = new Mensaje(payload);
    await message.save();
    console.log(message);
    return message;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  userConnected,
  userDisconnected,
  getUsuarios,
  recordMessage,
};
