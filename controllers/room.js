const uuid = require("uuid");
class Room {
  constructor() {
    this.array = [[], [], [], [], [], [], [], [], []];
    this.players = { x: null, o: null };
    this.place = null;
    this.currentPlayer = null;
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
}
class Rooms {
  static rooms = {
    102: new Room(),
    103: new Room(),
    104: new Room(),
    105: new Room(),
    106: new Room(),
  };

  static at(room) {
    const player = this.rooms[room].player("test name");
    return player;
  }
  static play(room, data) {
    this.rooms[room].place = data[1];
    this.rooms[room].array[data[0]][data[1]] = data[2];
    this.rooms[room].currentPlayer = data[2] == "x" ? "o" : "x";
  }
}

module.exports = { Rooms };
