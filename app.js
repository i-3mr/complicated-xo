const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const joinRoom = require("./controllers/create-room");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});
const cors = require('cors');

cors("*")
io.on("connection", (socket) => {
  // ...
  socket.on("start", (data, callback) => {
    const room = joinRoom();
    socket.join(room.id);
    callback({
      status: "ok",
      player: room.player,
      room: room.id,
    });

    socket.on("play", (data) => {
      console.log(data);
      socket.broadcast.emit("play" , data);
    });
  });
  console.log("connect");
});

app.use(express.static("./public"));
httpServer.listen(3000, console.log("listening on port 3000"));
