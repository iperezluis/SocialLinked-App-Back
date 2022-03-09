const jwt = require("jsonwebtoken");

//generar jwt

const generarJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.JWT_KEY,
      {
        algorithm: "HS256",
        expiresIn: "2 days",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se puedo generar el JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};
const comprobarJWT = (token = "") => {
  try {
    const { uid } = jwt.verify(token, process.env.JWT_KEY);
    return [true, uid];
  } catch (error) {
    return [false, null];
  }
};

module.exports = { generarJWT, comprobarJWT };
