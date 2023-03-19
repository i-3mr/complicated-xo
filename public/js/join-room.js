import { game, myArea } from "./main.js";
export function joinRoom(res) {
    var _a;
    console.log(res);
    if (res.player === null)
        return console.log("full");
    if (res.status == "ok") {
        (_a = document.querySelector(".rooms")) === null || _a === void 0 ? void 0 : _a.remove();
        game.me = res.player;
        myArea.build();
        const h1 = document.createElement("h1");
        h1.textContent = `You Are ${res.player.toLocaleUpperCase()}, at room ${res.room}`;
        document.querySelector("#app").prepend(h1);
    }
}
