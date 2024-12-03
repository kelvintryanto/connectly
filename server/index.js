const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const app = express();
const server = createServer(app);
const setSocketId = require("./helpers/userHelper");

const io = new Server(server, {
  cors: {
    origin: `https://ip-ragaramadhan.vercel.app/`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on(`userData`, async (event) => {
    await setSocketId(socket.id, event);
  });
});

module.exports = { io, app, server };
