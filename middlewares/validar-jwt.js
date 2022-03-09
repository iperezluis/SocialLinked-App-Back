const jwt = require("jsonwebtoken");

//recuerda que como esto es iun middleware express le enviara aautoimaticamnete estos 3 parametros que si todo sale bien ejecuta next()
const validarJWT = (req, res, next) => {
  try {
    //este header llamado "x-token" lo vamos a enviar desde el fronEnd
    const token = req.header("x-token");
    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: "no hay token en el header",
      });
    }
    //este payload va a retornar el uid del usuario, la fecha creacion y expired
    const payload = jwt.verify(token, process.env.JWT_KEY);
    const { uid } = payload;
    //almacenamos el uid del usuario en la request para mandarselo a nuestro renewToken()
    req.uid = uid;
    next();
  } catch (error) {
    console.log(error);
    // 401 forbidden || no autorizado
    return res.status(401).json({
      ok: false,
      msg: "el token no es valido",
    });
  }
};

module.exports = validarJWT;
