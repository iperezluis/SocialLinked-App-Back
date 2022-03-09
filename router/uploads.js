const { Router } = require("express");
const { check } = require("express-validator");

const { cargarArchivo, loadIMageUser } = require("../controllers/uploads");
const { validarArchivoSubir } = require("../middlewares/validar-archivo");
const validarJWT = require("../middlewares/validar-jwt");

const router = Router();

router.post("/", validarArchivoSubir, cargarArchivo);
router.post("/imageuser", validarArchivoSubir, validarJWT, loadIMageUser);

module.exports = router;
