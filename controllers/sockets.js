const Usuario = require("../models/user");
const Mensaje = require("../models/message");
const { connect, disconnect } = require("../database/config");

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

const loadUser = async (uid) => {
  const user = await User.findById(uid);
  return user;
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
const getNewMessage = async (userId) => {
  // await connect();
  try {
    const user = await Usuario.findById(userId);
    if (!user) {
      return;
    }
    // await disconnect();
    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadUser,
  userConnected,
  userDisconnected,
  getUsuarios,
  recordMessage,
  getNewMessage,
};
