//here going to define the routes for the authentication jwt
//you should relocated in middlewares

const { Router } = require("express");
const { check } = require("express-validator");
//controllers
const { createUser, loginUser, renewToken } = require("../controllers/auth");
//middlewares
const checkFields = require("../middlewares/checkFields");
const validarJWT = require("../middlewares/validar-jwt");

const router = Router();

// router.get("/", (req, res) => {
//   res.json({
//     ok: true,
//     msg: "load intrface",
//   });
// });
//create new user
router.post(
  "/register",
  [
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("email", "el email es obligatorio").isEmail(),
    check("password", "el password es obligatorio").not().isEmpty(),
    checkFields,
  ],
  createUser
);
//login user existing
//aqui usamos check es un middleware de express-validator para verificar que los campos en el body existan y pones el error en el otro lado
router.post(
  "/",
  [
    check("email", "el email es obligatorio").isEmail(),
    check("password", "el password es obligatorio").not().isEmpty(),
    checkFields,
  ],
  loginUser
);
//renew jwt
router.get("/renew", validarJWT, renewToken);

module.exports = router;
