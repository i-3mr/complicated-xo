import { BigXO } from "./big_xo.js";
import { RoomButton } from "./components/room-btn.js";
import { joinRoom } from "./join-room.js";
import { socket } from "./socket.js";
socket.connect();
socket.emit("get-rooms", (rooms) => {
    console.log(rooms);
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
const game = { currentPlayer: "x", me: "" };
const myArea = new BigXO();
export { game, myArea };
