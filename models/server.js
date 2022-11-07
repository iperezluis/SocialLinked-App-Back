// servidor de express
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const Sockets = require("./sockets");
const cors = require("cors");
const { connect } = require("../database/config");
const { route } = require("../router/auth");
const fileUpload = require("express-fileupload");
const { db } = require("./message");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    //connect to mongoDB
    connect();
    // Http server
    this.server = http.createServer(this.app);

    //configuraciuon sockets
    // aqui vamos a mantener a todos los clientes conectados
    this.io = socketio(this.server, {
      cors: {
        origin: process.env.URL_PAGE,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
  }
  //aqui vamos a colocar todos lso middleweares que necesitamos
  middlewares() {
    // desplegar el directorio publico
    this.app.use(express.static(path.resolve(__dirname, "../public")));
    //esto es para parsear lo que el usuario mande en el body
    this.app.use(express.json());

    // habilitamos el cors para que cualquier persona se conecte a nuestra app
    // tambien puedes configurar que dominios son los que se pueden conectar
    //Aqui siempre siempre tienes que colocar los cors antes de asignar las rutas en el backend recuerda que todo va cargando de forma asincrona
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      })
    );
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
    // this.app.use("/api", require("../router/auth"));
    this.app.use("/api/login", require("../router/auth"));
    this.app.use("/api/messages", require("../router/messages"));
    this.app.use("/api", require("../router/uploads"));
  }
  //configurar los sockets por clases para refactorizar el codigo
  settingsSockets() {
    new Sockets(this.io);
  }

  execute() {
    //inicialiozar middlewares
    this.middlewares();

    //inicializar server
    this.server.listen(this.port, () => {
      console.log("corriendo en el puerto", this.port);
    });
    // incilaizat sockets
    this.settingsSockets();
  }
}

module.exports = Server;
