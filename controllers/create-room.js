const uuid = require("uuid");
const rooms = [];

const joinRoom = () => {
  const room = rooms.shift();
  if (room) {
    return { ...room, player: "x" };
  }

  const newRoom = {
    id: uuid.v4().split("-")[0],
  };
  rooms.push(newRoom);
  return { ...newRoom, player: "o" };
};

module.exports = joinRoom;
