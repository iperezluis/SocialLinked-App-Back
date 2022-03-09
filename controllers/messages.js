const Message = require("../models/message");

const loadChat = async (req, res) => {
  try {
    //este uid lo estamos extrtayendo del request cuando lo almacenados en validarJWT que sera tambien el middleware de este loadChat
    const myId = req.uid;
    //este req.params.de el .de es el parametro que pusimos en nuestra ruta ahi va a ir el id, /api/messages/:de
    const messagesFrom = req.params.from;

    const last30Messages = await Message.find({
      //pongo el from y el to porque asi lo modelé en la MessageSchema
      $or: [
        { from: myId, to: messagesFrom },
        { from: messagesFrom, to: myId },
      ],
    })
      .sort({ createdAt: "asc" })
      .limit(30);

    res.json({
      ok: true,
      msg: last30Messages,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "error del servidor",
    });
  }
};

module.exports = {
  loadChat,
};
