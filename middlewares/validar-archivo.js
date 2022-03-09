const { response } = require("express");

const validarArchivoSubir = (req, res = response, next) => {
  //validamos si en el request viene un archivo con una extension no valida o si esta vacio,
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({
      msg: "No hay archivos que subir- validar archivos",
    });
  }

  next();
};

module.exports = {
  validarArchivoSubir,
};
