import { game, myArea } from "./main.js";

export function joinRoom(res: {
  status: string;
  player: string;
  room: string;
}) {
  console.log(res);
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
}
