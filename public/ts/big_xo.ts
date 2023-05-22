import { ConnectionState } from "./components/connection_state.js";
import { game, myArea, settings, start } from "./main.js";
import { socket } from "./socket.js";
import { Time } from "./time.js";
import { xo, XO } from "./xo.js";
import { XOArea } from "./xo_area.js";

export class BigXO extends XO {
  array: string[];
  areas: XOArea[];
  finished: boolean;
  oTime: Time | null = null;
  xTime: Time | null = null;
  constructor({ minutes }: { minutes: number }) {
    super();
    this.areas = [];
    this.array = [];
    this.finished = false;
    if (game.timeMode) {
      this.xTime = new Time({ minutes });
      this.oTime = new Time({ minutes });
    }
  }
  add({ value, index }: { value: xo; index: number }) {
    if (this.array[index] === undefined) {
      this.array[index] = value;
    }
    if (this.isWon(index)) {
      // game is done
      this.areas.forEach((el) => el.changeState(false));
      const a = this.getWinLine(index);
      this.areas.forEach((el, i) => {
        if (a.indexes.indexOf(i) !== -1) {
          this.areas[i].element.classList.add("won");
        }
      });
      this.finished = true;
      showWinner(value);
      this.xTime?.reset();
      this.oTime?.reset();
    }
  }
  changePlace(placeIndex: number) {
    if (game.timeMode) {
      if (game.currentPlayer == "x") {
        this.xTime?.stopDecrement();
        this.oTime?.startDecrement().catch(() => {
          showWinner("x");
          document.body.id = "x";
        });
      } else {
        this.oTime?.stopDecrement();
        this.xTime?.startDecrement().catch(() => {
          showWinner("o");
          document.body.id = "o";
        });
      }
    }

    game.currentPlayer = game.currentPlayer == "x" ? "o" : "x";
    if (this.finished) return;
    document.body.className = game.currentPlayer;
    if (this.areas[placeIndex]?.done) {
      this.areas.forEach((el) => el.changeState(true));
    } else {
      this.areas.forEach((el, i) => {
        if (placeIndex == i) el?.changeState(true);
        else el?.changeState(false);
      });
    }

    if (!settings.online) {
      document.body.className = game.currentPlayer;
      document.body.id = game.currentPlayer;
    }

    if (this.areas.every((el) => el.done)) {
      this.finished = true;
      showWinner("draw");
    }
  }

  build() {
    const cont = document.createElement("div");
    cont.className = "big_xo";
    for (let i = 0; i < 9; i++) {
      const ox = new XOArea({ active: true, id: i });
      this.areas.push(ox);
      cont.append(ox.element);
    }
    document.body.className = game.currentPlayer;
    document.body.id = game.me;
    document.querySelector("#app")?.append(cont);

    game.other = new ConnectionState({ state: 0 });

    // online
    if (settings.online) {
      socket.on("play", (data: number[]) => {
        if (game.currentPlayer == game.me) return;
        const [area, i] = data;
        this.areas[area].playAt(i, true);
        socket.emit("played");
      });
    }

    if (game.timeMode) {
      const wrapper = document.createElement("div");
      wrapper.className = "time-wrapper";

      const x = this.xTime!.element;
      x.id = "x-time";
      const o = this.oTime!.element;
      o.id = "o-time";
      wrapper.append(x, o);
      cont.before(wrapper);
    }
  }

  stopTime() {
    this.xTime?.stopDecrement();
    this.oTime?.stopDecrement();
  }

  resetTime() {
    this.xTime?.reset();
    this.oTime?.reset();
  }

  continueTime() {
    if (game.currentPlayer == "x") {
      this.xTime?.startDecrement().catch(() => {
        showWinner("x");
        document.body.id = "x";
      });
    } else {
      this.oTime?.startDecrement().catch(() => {
        showWinner("o");
        document.body.id = "o";
      });
    }
  }


  rebuild() {
    this.areas.forEach((el) => el.element.remove());
    this.areas = [];
    this.array = [];
    this.finished = false;
    this.build();
  }
}

// a function that will show a pop up says the winner and ask if he want to play again
function showWinner(winner: xo | "draw") {
  myArea.stopTime();

  const popup = document.createElement("div");
  popup.className = "popup " + winner;

  // create a content wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";

  const h1 = document.createElement("h1");
  h1.textContent = winner !== "draw" ? `${winner} won!` : "draw";
  const btn = document.createElement("button");
  btn.textContent = "play again";
  btn.addEventListener("click", () => {
    document.querySelector(".big_xo")?.remove();
    popup.remove();
    myArea.rebuild();
  });

  // home button
  const homeBtn = document.createElement("button");
  homeBtn.textContent = "home";
  homeBtn.className = "home-btn";
  homeBtn.addEventListener("click", () => {
    location.reload();
  });

  wrapper.append(h1, btn, homeBtn);
  popup.append(wrapper);
  document.body.append(popup);
}
