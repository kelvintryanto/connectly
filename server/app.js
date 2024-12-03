if (process.env.MODE_ENV != `production`) {
  require("dotenv").config();
}
// require("dotenv").config();
const cors = require("cors");
const express = require("express");
// const app = express();
const port = process.env.PORT || 3000;
const router = require("./routers");

const { server, app } = require(`./socket`);

// io.on("connection", (socket) => {
//   io.emit(`ragagantenk`, `masuk event`);
//   // console.log(socket.id);
//   socket.on(`userData`, async (event) => {
//     // console.log(event, `hehe`);
//     // console.log(socket.id, event);
//     // console.log(`aaaaaaaaaaaaaaaaaaaaaa`);
//     // console.log(event);

//     await setSocketId(socket.id, event);

//     // if (event) {
//     //   console.log(`masuk`);
//     // }
//   });
// });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
//hidup matikan karena tidak dipindahkan
module.exports = app;

// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// Socket.IO Events
// io.on("connection", (socket) => {
//   console.log(`New connection: ${socket.id}`);
//   let payload;

//   if (socket.handshake.auth.token) {
//     payload = verifyToken(socket.handshake.auth.token);
//   }

//   // console.log(payload);

//   // Event untuk menerima data user
//   socket.on("userData", async (event) => {
//     console.log("User data received:", event);
//     await setSocketId(socket.id, event); // Panggil helper
//   });
//   socket.on("create", function (room) {
//     socket.join(room);
//     console.log(`udah masuk room ${room}`);
//   });
//   // Bergabung ke room
//   socket.on("join_room", (room) => {
//     console.log(`User ${socket.id} joined room: ${room}`);
//     socket.join(room);
//   });

//   // Event saat user disconnect
//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

// // Middleware
// app.use(cors());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// // Routes
// app.use(router);

// server.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
// //hidup matikan karena tidak dipindahkan
// module.exports = app;
