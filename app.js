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
    socket.room = room;

    callback({
      status: "ok",
      player: Rooms.at(room),
      room: room,
      other: false,
    });

    socket.on("play", (data, callBack) => {
      io.to(room).emit("play", data);
    });
    socket.on("played", () => {
      io.to(room).emit("played");
    });
  });
  socket.on("join-room", (room, callback) => {
    socket.join(room);
    socket.room = room;
    io.to(room).emit("other_state", true);
    callback({
      status: "ok",
      player: Rooms.at(room),
      room: room,
      other: true,
    });
    socket.on("play", (data) => {
      io.to(room).emit("play", data);
    });
    socket.on("played", () => {
      io.to(room).emit("played");
    });
  });
  socket.on("disconnect", (reason, details) => {
    // get room
    console.log(socket.room);
    io.to(socket.room).emit("other_state", false);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(socket.room);
    io.to(socket.room).emit("other_state", true);
  });

});

app.use(express.static("./public"));
httpServer.listen(
  process.env.PORT || 3000,
  console.log("listening on port ", process.env.PORT || 3000)
);
