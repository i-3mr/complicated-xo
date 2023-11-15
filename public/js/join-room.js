import { game, myArea } from "./main.js";
import { socket } from "./socket.js";
import { Time } from "./time.js";
export function joinRoom(res) {
    var _a, _b;
    console.log(res);
    myArea.oTime = new Time({ minutes: res.time });
    myArea.xTime = new Time({ minutes: res.time });
    socket.on("other_state", (connected) => {
        var _a, _b;
        if (!connected)
            (_a = game.other) === null || _a === void 0 ? void 0 : _a.changeState(2);
        else
            (_b = game.other) === null || _b === void 0 ? void 0 : _b.changeState(1);
        game.connected = connected;
    });
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
    if (res.other)
        (_b = game.other) === null || _b === void 0 ? void 0 : _b.changeState(1);
}
