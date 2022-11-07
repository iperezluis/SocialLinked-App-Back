const { comprobarJWT } = require("../helpers/jwt");
const formidable = require("formidable");
const { subirArchivo } = require("../helpers/subirArchivo");
const { response } = require("express");
const Usuario = require("../models/user");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL || "");

// cloudinary.config({
//   api_secret: "efadsVCcIjvuCGRpMNO6tfBeY2A",
//   api_key: "784527415311958",
//   cloud_name: "servidor-depruebas-backend",
// });

// const cargarArchivo = async (req, res = response) => {
//   try {
//     // txt, md
//     // const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' );
//     const nombre = await subirArchivo(req.files, undefined, "imgs");

//     // await modelo.save();
//     res.json({
//       ok: true,
//       msg: "respuesta correcta",
//       nombre,
//       // usuario,
//       // tempFilePath: tempFilePath,
//     });
//   } catch (error) {
//     res.status(400).json({
//       ok: false,
//       msg: error,
//     });
//   }
// };
const saveFile = async (file) => {
  console.log("estamos en el saveFile");
  //en este punto ya existe la carpeta fisica en el fileSystem
  // const data = fs.readFileSync(file.filepath);
  // // ahora hagamos la escritura y movimiento de ese archivo a una carpeta fisica
  // fs.writeFileSync(`./public/${file.originalFilename}`, data);
  // //ahora eliminamos para que no acumule archivos basura
  // fs.unlinkSync(file.filepath);
  // return;
  //subimos la imagen que esta en nuesra carpeta temporal
  // const { secure_url } = await cloudinary.uploader.upload(file.filepath);
  const { secure_url } = await cloudinary.uploader.upload(file.tempFilePath);
  return secure_url;
};
//el formidable qiue instalamos lo usamos aqui abajo para parsear los files antes de subir a cloudinary o almacenar en fileSYstem(no recomendado por next);
const parseFiles = (req) => {
  console.log("estamos ahora en el parseFiles");
  return new Promise(async (resolve, reject) => {
    const form = new formidable.IncomingForm();
    console.log("datos del formidable:", form);
    console.log(
      "Esta es l oque estamos metiendo en el saveFile:",
      req.files.file
    );
    try {
      const filePath = await saveFile(req.files.file);
      resolve(filePath);
    } catch (error) {
      console.log(error);
      return reject(error);
    }

    // form.parse(req, async (err, fields, files) => {
    //   console.log(err, fields, files);
    //   console.log("en el form.parse:".fields, files);

    //   if (err) {
    //     console.log(err);
    //     return reject(err);
    //   }
    //aqui ya tenemos el secure_url que retornamos
    // const filePath = await saveFile(files.file);
    //   console.log({ filePath });
    //   // resolve(filePath);
    // });
  });
};

const uploadFile = async (req, res) => {
  console.log("Finlamente em el uploadFile", req);
  const imageUrl = await parseFiles(req);
  console.log("URL subido a cloudinary:", imageUrl);
  return res.status(200).json({
    message: imageUrl,
  });
};

// const loadIMageUser = async (req, res = response) => {
//   try {
//     const uid = req.uid;
//     console.log(uid);
//     const nombre = await subirArchivo(req.files, undefined, "imgs");
//     // const { tempFilePath } = req.files.archivo;
//     // console.log("este es el nuevo", newFile);
//     // const cloud = await cloudinary.uploader.upload(tempFilePath, {});-->TO DO
//     // //   upload_preset: "react-chat",
//     // // });
//     // console.log("cloudinary response", cloud);
//     const usuario = await Usuario.findById(uid);
//     // usuario.image = secure_url;
//     // await usuario.save();
//     console.log(usuario);
//     res.json({
//       ok: true,
//       usuario,
//       nombre,
//       // cloud,
//     });
//   } catch (error) {
//     res.status(400).json({
//       ok: false,
//       msg: "hubo un error en el servidor",
//     });
//   }
// };

module.exports = { uploadFile };
