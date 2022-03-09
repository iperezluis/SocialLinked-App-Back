const {
  userConnected,
  userDisconnected,
  getUsuarios,
  recordMessage,
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
        //ahora ese mensaje se lo mandamos a la sala que tiene por nombre el uid
        this.io.to(message.to).emit("enviar-mensaje", mensaje);
        this.io.to(message.from).emit("enviar-mensaje", mensaje);
        // console.log(message);
        // client.emit('obtener-mensaje', )
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
