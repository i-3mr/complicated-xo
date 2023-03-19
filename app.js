const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { Rooms, Room } = require("./controllers/room");
const uuid = require("uuid");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});
const cors = require("cors");

cors("*");
io.on("connection", (socket) => {
  socket.on("get-rooms", (callback) => {
    callback(Rooms.rooms);
  });
  // ...
  socket.on("create-room", (callback) => {
    const newRoom = new Room();
    const room = uuid.v4().split("-")[0];
    Rooms.rooms[room] = newRoom;
    socket.join(room);
    callback({
      status: "ok",
      player: Rooms.at(room), // it returns x , o , or watcher if the room is full
      room: room,
    });
    socket.on("play", (data) => {
      io.to(room).emit("play", data);
    });
  });
  socket.on("join-room", (room, callback) => {
    socket.join(room);
    callback({
      status: "ok",
      player: Rooms.at(room), // it returns x , o , or watcher if the room is full
      room: room,
    });
    socket.on("play", (data) => {
      io.to(room).emit("play", data);
    });
  });
});

app.use(express.static("./public"));
httpServer.listen(
  process.env.PORT || 3000,
  console.log("listening on port ", process.env.PORT || 3000)
);
