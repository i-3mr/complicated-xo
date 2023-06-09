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
onlineBtn.className = "online-btn btn";
onlineBtn.textContent = "online";
onlineBtn.addEventListener("click", () => {
  settings.online = true;
  start();
});

const offlineBtn = document.createElement("button");
offlineBtn.className = "offline-btn btn";
offlineBtn.textContent = "offline";
offlineBtn.addEventListener("click", () => {
  settings.online = false;
  start();
});

// bot button
const botBtn = document.createElement("button");
botBtn.className = "bot-btn btn";
botBtn.textContent = "bot";
botBtn.addEventListener("click", () => {
  botBtn.remove();
  settings.online = false;
  start();
  setInterval(bot);
});

document.querySelector("#app")!.append(onlineBtn, offlineBtn, botBtn);

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
  socket.on("delete-room", (id: string) => {
    document.querySelector(`#i${id}`)?.remove();
  });
  socket.on(
    "new-room-created",
    (data: {
      [id: string]: {
        x: string;
        o: string;
      };
    }) => {
      const cont = document.querySelector(".rooms")!;
      const room = new RoomButton({ id: Object.keys(data)[0] });
      cont?.prepend(room.el);
    }
  );
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
export { game, myArea, settings, start };

function bot() {
  const spans = [
    ...document.querySelectorAll(
      ".xo_area:not(.disabled) span:not([class='o'] , [class='x'])"
    ),
  ];
  if (!spans.length) return;

  const span = spans[Math.floor(Math.random() * spans.length)] as HTMLElement;
  span?.click();
}
