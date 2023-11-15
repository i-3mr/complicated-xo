const uuid = require("uuid");
class Room {
  constructor(time) {
    this.array = [[], [], [], [], [], [], [], [], []];
    this.players = { x: null, o: null };
    this.time = time;
  }

  player(name) {
    if (this.players.x === null) {
      this.players.x = name;
      return "x";
    }
    if (this.players.o === null) {
      this.players.o = name;
      return "o";
    }
    return null;
  }

  isFull() {
    return this.players.x !== null && this.players.o !== null;
  }
}
class Rooms {
  static rooms = {};

  static getRooms() {
    // get rooms that are not full
    const keys = Object.keys(this.rooms).filter(
      (room) => !this.rooms[room].isFull()
    );
    const rooms = {};
    for (const key of keys) rooms[key] = this.rooms[key];

    return rooms;
  }
  static at(room) {
    const player = this.rooms[room]?.player("test name");
    // if (player === "o") delete this.rooms[room];
    return player;
  }
  static play(room, data) {
    this.rooms[room].place = data[1];
    this.rooms[room].array[data[0]][data[1]] = data[2];
    this.rooms[room].currentPlayer = data[2] == "x" ? "o" : "x";
  }
}

module.exports = { Rooms, Room };
