import { BigXO } from "./big_xo.js";
import { RoomButton } from "./components/room-btn.js";
import { joinRoom } from "./join-room.js";
import { socket } from "./socket.js";
const settings = { online: false };
const game = { currentPlayer: "x", me: "", connected: false, other: null };
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
    socket.on("delete-room", (id) => {
        var _a;
        (_a = document.querySelector(`#i${id}`)) === null || _a === void 0 ? void 0 : _a.remove();
    });
    socket.on("new-room-created", (data) => {
        const cont = document.querySelector(".rooms");
        const room = new RoomButton({ id: Object.keys(data)[0] });
        cont === null || cont === void 0 ? void 0 : cont.prepend(room.el);
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
export { game, myArea, settings, start };
function bot() {
    const spans = [
        ...document.querySelectorAll(".xo_area:not(.disabled) span:not([class='o'] , [class='x'])"),
    ];
    if (!spans.length)
        return;
    const span = spans[Math.floor(Math.random() * spans.length)];
    span === null || span === void 0 ? void 0 : span.click();
}
