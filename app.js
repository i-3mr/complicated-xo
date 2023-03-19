const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { Rooms } = require("./controllers/room");

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
  socket.on("join-room", (room, callback) => {
    socket.join(room);
    callback({
      status: "ok",
      player: Rooms.at(room), // it returns x , o , or watcher if the room is full
      room: room,
      array: Rooms.rooms[room].array,
      currentPlayer: Rooms.rooms[room].currentPlayer,
      place: Rooms.rooms[room].place,
    });
    // console.log(`JOINING ROOM ${room}....`, Rooms.rooms);
    socket.on("disconnect" , ()=>{
      
    })
    socket.on("play", (data) => {
      Rooms.play(room, data);
      io.to(room).emit("play", data);
    });
  });
});

app.use(express.static("./public"));
httpServer.listen(
  process.env.PORT || 3000,
  console.log("listening on port ", process.env.PORT || 3000)
);
