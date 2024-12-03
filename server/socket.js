const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const setSocketId = require("./helpers/userHelper");
const { verifyToken } = require("./helpers/jwt");
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: `http://localhost:5173`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on(`userData`, async (event) => {
    await setSocketId(socket.id, event);
  });

  console.log(`New connection: ${socket.id}`);
  let payload;

  if (socket.handshake.auth.token) {
    payload = verifyToken(socket.handshake.auth.token);
  }

  // console.log(payload);

  // Event untuk menerima data user
  socket.on("userData", async (event) => {
    console.log("User data received:", event);
    await setSocketId(socket.id, event); // Panggil helper
  });
  socket.on("create", function (room) {
    // socket.join(room);
    console.log(`udah masuk room ${room}`);
  });
  // Bergabung ke room
  socket.on("join_room", (room) => {
    console.log(`User ${socket.id} joined room: ${room}`);
    socket.join(room);
  });

  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
  });
  // Event saat user disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

module.exports = { io, app, server };
