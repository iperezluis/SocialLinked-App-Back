const { Router } = require("express");
const { check } = require("express-validator");

const { uploadFile } = require("../controllers/uploads");
const { validarArchivoSubir } = require("../middlewares/validar-archivo");
const validarJWT = require("../middlewares/validar-jwt");

const router = Router();

// router.post("/", validarArchivoSubir);
router.post("/imageuser", validarJWT, uploadFile);

module.exports = router;
