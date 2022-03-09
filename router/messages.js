const { Router } = require("express");

const { loadChat } = require("../controllers/messages");
const validarJWT = require("../middlewares/validar-jwt");

const router = Router();

router.get("/:from", validarJWT, loadChat);

module.exports = router;
