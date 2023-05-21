import { BigXO } from "./big_xo.js";
import { ConnectionState } from "./components/connection_state";
import { RoomButton } from "./components/room-btn.js";
import { joinRoom } from "./join-room.js";
import { socket } from "./socket.js";
import { xo } from "./xo.js";
const settings = { online: false };
const game: {
  currentPlayer: xo;
  me: xo;
  connected: boolean;
  other: ConnectionState | null;
} = { currentPlayer: "x" as xo, me: "" as xo, connected: false, other: null };

const myArea = new BigXO();

const onlineBtn = document.createElement("button");
onlineBtn.className = "online-btn";
onlineBtn.textContent = "online";
onlineBtn.addEventListener("click", () => {
  settings.online = true;
  start();
});

const offlineBtn = document.createElement("button");
offlineBtn.className = "offline-btn";
offlineBtn.textContent = "offline";
offlineBtn.addEventListener("click", () => {
  settings.online = false;
  start();
});

document.querySelector("#app")!.append(onlineBtn, offlineBtn);

function start() {
  document.querySelector(".online-btn")?.remove();
  document.querySelector(".offline-btn")?.remove();

  // offline
  if (!settings.online) {
    game.me = "x";
    myArea.build();
    return;
  }

  // online
  socket.connect();
  socket.on("disconnect", () => {
    game.other?.changeState(3);
    game.connected = false;
  });
  socket.on("reconnect", () => {
    game.other?.changeState(1);
    game.connected = true;
  });
  socket.emit(
    "get-rooms",
    (rooms: {
      id: {
        x: string;
        o: string;
      };
    }) => {
      const cont = document.createElement("div");
      cont.className = "rooms";
      for (const i of Object.keys(rooms))
        cont.append(new RoomButton({ id: i }).el);

      const createRoom = document.createElement("button");
      createRoom.className = "room-btn create";
      createRoom.textContent = "create a room";
      cont.append(createRoom);
      createRoom.addEventListener("click", () => {
        socket.emit("create-room", joinRoom);
      });
      document.querySelector("#app")!.append(cont);
    }
  );
}
export { game, myArea, settings };
