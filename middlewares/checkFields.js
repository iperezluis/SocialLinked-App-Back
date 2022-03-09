const { validationResult } = require("express-validator");

//esto 3 argumentos nos los teniamnos pero al nosotros colocarlo en el arreglo de los middlwares de check() automaticmante express se los pasa a nuestra function y por eso la podemos extraer aqui como parametros
const checkFields = (req, res, next) => {
  const checkErrors = validationResult(req);
  if (!checkErrors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: checkErrors.mapped(),
    });
  }

  //vamos a llamar este next() si todo sale bien, este next saltara al siguiente middleware
  next();
};

module.exports = checkFields;
