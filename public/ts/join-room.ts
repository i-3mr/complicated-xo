import { game, myArea } from "./main.js";
import { socket } from "./socket.js";
import { xo } from "./xo.js";

export function joinRoom(res: {
  status: string;
  player: xo;
  room: string;
  other: boolean;
}) {
  socket.on("other_state", (connected: boolean) => {
    if (!connected) game.other?.changeState(2);
    else game.other?.changeState(1);

    game.connected = connected;
  });

  if (res.player === null) return console.log("full");
  if (res.status == "ok") {
    document.querySelector(".rooms")?.remove();
    game.me = res.player;
    myArea.build();
    const h1 = <HTMLElement>document.createElement("h1");
    h1.textContent = `You Are ${res.player.toLocaleUpperCase()}, at room ${
      res.room
    }`;
    document.querySelector("#app")!.prepend(h1);
  }

  if (res.other) game.other?.changeState(1);
}
