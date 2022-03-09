const { comprobarJWT } = require("../helpers/jwt");

const { subirArchivo } = require("../helpers/subirArchivo");
const { response } = require("express");
const Usuario = require("../models/user");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  api_secret: "efadsVCcIjvuCGRpMNO6tfBeY2A",
  api_key: "784527415311958",
  cloud_name: "servidor-depruebas-backend",
});

const cargarArchivo = async (req, res = response) => {
  try {
    // txt, md
    // const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' );
    const nombre = await subirArchivo(req.files, undefined, "imgs");

    // await modelo.save();
    res.json({
      ok: true,
      msg: "respuesta correcta",
      nombre,
      // usuario,
      // tempFilePath: tempFilePath,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: error,
    });
  }
};

const loadIMageUser = async (req, res = response) => {
  try {
    const uid = req.uid;
    console.log(uid);
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    // const { tempFilePath } = req.files.archivo;
    // console.log("este es el nuevo", newFile);
    // const cloud = await cloudinary.uploader.upload(tempFilePath, {});-->TO DO
    // //   upload_preset: "react-chat",
    // // });
    // console.log("cloudinary response", cloud);
    const usuario = await Usuario.findById(uid);
    // usuario.image = secure_url;
    // await usuario.save();
    console.log(usuario);
    res.json({
      ok: true,
      usuario,
      nombre,
      // cloud,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "hubo un error en el servidor",
    });
  }
};

module.exports = { cargarArchivo, loadIMageUser };
