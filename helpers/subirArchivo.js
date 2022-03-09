const path = require("path");
const { v4: uuidv4 } = require("uuid");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  api_secret: "efadsVCcIjvuCGRpMNO6tfBeY2A",
  api_key: "784527415311958",
  cloud_name: "servidor-depruebas-backend",
});

const subirArchivo = (
  files,
  extensionesValidas = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    //este es el nombre que tienes que enviar en el fronEnd "archivo"
    const { archivo } = files;
    const recortarName = archivo.name.split(".");
    //extraemos la extension del archivio
    const extension = recortarName[recortarName.length - 1];
    try {
      // console.log(extension);
      // Validar la extension
      if (!extensionesValidas.includes(extension)) {
        return reject(
          console.log(
            `La extensión ${extension} no es permitida - ${extensionesValidas}`
          )
        );
      }
      //creamos el uid del archivo y le agregamos el punto y despues la extension que validamos
      const nombreTemp = uuidv4() + "." + extension;
      console.log("nombre temp ", nombreTemp);
      //aqui creamos la ruta que vamos a subir en cloudinary agregando nuestro direrctorio actual y el uuid que generamos
      const uploadPath = path.join(
        __dirname,
        "../uploads/",
        carpeta,
        nombreTemp
      );

      console.log("uploap path", uploadPath);
      //  mv is A function to move the file elsewhere on your server
      archivo.mv(uploadPath, (err) => {
        if (err) {
          reject(err);
        }

        resolve(nombreTemp);
      });
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = { subirArchivo };
