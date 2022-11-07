const Usuario = require("../models/user");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { isValidObjectId } = require("mongoose");

const createUser = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    //buscamos si el email existe en la database
    const checkEmailExist = await Usuario.findOne({ email: email });
    if (checkEmailExist) {
      return res.status(500).json({
        ok: false,
        msg: "este email ya existe",
      });
    }

    //vamos a guardar usuario en la database, vamos a guardar todo lo que esta en el body que tiene que ser igual que el modelado que creaste de UsuarioSchema
    const usuario = new Usuario(req.body);
    //ahora encriptamos la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();
    //generar ahoira el JWT
    const token = await generarJWT(usuario.id);
    //esta shit eran los cors en el header que me estaba pidiendo

    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    // res.setHeader(
    //   "Access-Control-Allow-Headers",
    //   "Content-Type, Authorization"
    // );
    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "talk with the administrator about this issue",
    });
  }
};
const loginUser = async (req, res) => {
  //ahora usamos el req.body para que lo que mande el usuario el body antes de hacer el post salga en la respuesta del json, ahora vamos aobligalo tambiewn a que tenga que mandar los datos del body, para esto agregamos en el servers this.app.use( express.json()) y ya.
  try {
    const { email, password } = req.body;

    //verify if the email exists
    const checkUserExists = await Usuario.findOne({ email: email });
    if (!checkUserExists) {
      return res.status(404).json({
        ok: false,
        msg: "el usuario no existe",
      });
    }
    //verify if the password is matching
    const verifyPassword = bcrypt.compareSync(
      password,
      checkUserExists.password
    );
    if (!verifyPassword) {
      return res.status(400).json({
        ok: false,
        msg: "el password es incorrecto",
      });
    }
    //generar jwt
    const token = await generarJWT(checkUserExists.id);

    res.json({
      ok: true,
      usuario: checkUserExists,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador",
    });
  }
};
//revalidar el jwt cuando el usuario haga reload de la pagina
const renewToken = async (req, res) => {
  //extraemos el uid que almacenamos en el middleware validarJWT, identificamos a que usuario pertenece, retornarlo sus datos y crear un nuevo token
  try {
    const uid = req.uid;
    const token = await generarJWT(uid);
    //buscamos el uid en la base de datos y devolvemos todos sus datos
    const usuario = await Usuario.findById(uid);

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

const loadUser = async (req, res) => {
  const uid = req.headers["uid"];

  console.log("este del body", uid);
  if (!isValidObjectId(uid)) {
    return res.status(500).json({
      ok: false,
      msg: "No es un mongo ID valido",
    });
  }
  console.log("esto es lo que esta en el body:", uid);
  try {
    const user = await Usuario.findById(uid);
    console.log("user desde la base de datos", user);
    //verify if the email exists
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "el usuario no existe",
      });
    }
    res.status(200).json({
      ok: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { createUser, loginUser, renewToken, loadUser };
