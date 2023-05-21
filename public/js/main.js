import { BigXO } from "./big_xo.js";
import { RoomButton } from "./components/room-btn.js";
import { joinRoom } from "./join-room.js";
import { socket } from "./socket.js";
const settings = { online: false };
const game = { currentPlayer: "x", me: "", connected: false, other: null };
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
document.querySelector("#app").append(onlineBtn, offlineBtn);
function start() {
    var _a, _b;
    (_a = document.querySelector(".online-btn")) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = document.querySelector(".offline-btn")) === null || _b === void 0 ? void 0 : _b.remove();
    // offline
    if (!settings.online) {
        game.me = "x";
        myArea.build();
        return;
    }
    // online
    socket.connect();
    socket.on("disconnect", () => {
        var _a;
        (_a = game.other) === null || _a === void 0 ? void 0 : _a.changeState(3);
        game.connected = false;
    });
    socket.on("reconnect", () => {
        var _a;
        (_a = game.other) === null || _a === void 0 ? void 0 : _a.changeState(1);
        game.connected = true;
    });
    socket.emit("get-rooms", (rooms) => {
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
        document.querySelector("#app").append(cont);
    });
}
export { game, myArea, settings };
