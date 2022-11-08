const {
  userConnected,
  userDisconnected,
  getUsuarios,
  recordMessage,
  getNewMessage,
} = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/jwt");

class Sockets {
  constructor(io) {
    this.io = io;
    this.socketsEvents();
  }

  //aqui creamos todos los eventos que necesitamos en los sopckets
  socketsEvents() {
    // configuracion del socket server
    this.io.on("connection", async (client) => {
      //extraermos el token del cliente que mandmaos como parametro desde el query en el frontend
      // console.log(client.handshake.query["x-token"]);
      const [valido, uid] = comprobarJWT(client.handshake.query["x-token"]);
      if (!valido) {
        console.log("socket no identificado");
        //si no es valido lo desconectamos para ahorrar memoria en este intento de conexion
        return client.disconnect();
      }
      //si pasa la validacion  mandamos console.log
      console.log("cliente conectado", uid);
      const { nombre } = await userConnected(uid);
      //unir al usuario a una sala(este uid es el del auth) o sea el mio
      client.join(uid);

      // this.io.to('sala-gamer').emit(''); --> example cuando quieras emitir un mensaje a todos los ususarios que esten conectados en esa sala
      // console.log("usuario conectado", nombre);
      //ahora le mandamos a todosl os usuarios la lista de usuarios conectados
      this.io.emit("lista-usuarios", await getUsuarios());
      client.on("enviar-mensaje", async (message) => {
        const mensaje = await recordMessage(message);
        console.log("enviando message a ", message.to);
        const newMessageFrom = await getNewMessage(message.from);
        //ahora ese mensaje se lo mandamos a la sala que tiene por nombre el uid
        // this.io.to(message.to).emit("enviar-mensaje", mensaje);
        this.io.to(message.to).emit("new-notification", newMessageFrom);
        // this.io.to(message.from).emit("new-notification-from", newMessageFrom);
        // console.log("numero mensajes:", getNewMessage);
        this.io.to(message.from).emit("enviar-mensaje", mensaje);
        // console.log(message);
        // client.emit('obtener-mensaje', )
      });

      //Receiving videoCall
      client.on("iniciando-videollamada", async (message) => {
        console.log("recibiendo videollamada de", message.from);
        const newMessageFrom = await getNewMessage(message.from);
        this.io.to(message.to).emit("recibiendo-videollamada", newMessageFrom);
        const toVideoCall = await getNewMessage(message.to);
        this.io.to(message.from).emit("llamada-saliente", toVideoCall);
        this.io.to(message.to).emit("new-notification", message.from);
      });
      client.on("llamada-contestada", async (callback) => {
        console.log(" videollamada contestada", callback);
        const getUserFrom = await getNewMessage(callback.from);
        const getUserTo = await getNewMessage(callback.to);
        this.io.to(callback.to).emit("en-vivo-con", getUserFrom);
        this.io.to(callback.from).emit("en-vivo", getUserTo);
        // this.io.to(message.to).emit("new-notification", newMessageFrom);
      });
      client.on("llamada-cancelada", async (callback) => {
        console.log(" videollamada cancelada", callback);
        const getUserFrom = await getNewMessage(callback.from);
        const getUserTo = await getNewMessage(callback.to);
        this.io.to(callback.to).emit("llamada-cancelada-from", getUserFrom);
        this.io.to(callback.from).emit("llamada-cancelada-to", getUserTo);
        // this.io.to(message.to).emit("llamada-rechazada", status);
        // this.io.to(message.to).emit("new-notification", newMessageFrom);
      });
      client.on("finalizar-llamada", async (callback) => {
        console.log(" llamada finalizada", callback);
        const getUserFrom = await getNewMessage(callback.from);
        const getUserTo = await getNewMessage(callback.to);
        this.io.to(callback.to).emit("llamada-finalizada-from", getUserFrom);
        this.io.to(callback.from).emit("llamada-finalizada", getUserTo);
        // const openCamera = await openCamera();
        // this.io.to(message.to).emit("new-notification", newMessageFrom);
      });
      client.on("disconnect", async () => {
        await userDisconnected(uid);
        this.io.emit("lista-usuarios", await getUsuarios());
        console.log("cliente desconectado", nombre);
        /* … */
      });
    });
  }
}

module.exports = Sockets;
