import { BigXO } from "./big_xo.js";
import { socket } from "./soket.js";
socket.connect();

const game = { currentPlayer: "x", me: "" };

const myArea = new BigXO();

const startBtn = document.querySelector("#start") as HTMLButtonElement;
startBtn.addEventListener("click", () => {
  socket.emit(
    "start",
    "hi",
    (res: { status: string; player: string; room: string }) => {
      if (res.status == "ok") {
        game.me = res.player;
        myArea.build();
        startBtn.remove();
        const h1 = <HTMLElement>document.createElement("h1");
        h1.textContent = `You Are ${res.player.toLocaleUpperCase()}, at room ${
          res.room
        }`;
        document.body.prepend(h1);
      }
    }
  );
});
export { game as active, myArea };
