import { active } from "./main.js";
import { socket } from "./soket.js";
import { XO } from "./xo.js";
import { XOArea } from "./xo_area.js";

export class BigXO extends XO {
  array: string[];
  areas: XOArea[];
  finished: boolean;
  constructor() {
    super();
    this.areas = [];
    this.array = [];
    this.finished = false;
  }
  add({ value, index }: { value: string; index: number }) {
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
    }
  }
  changePlace(placeIndex: number) {
    active.currentPlayer = active.currentPlayer == "x" ? "o" : "x";
    if (this.finished) return;
    document.body.className = active.currentPlayer;
    if (this.areas[placeIndex]?.done) {
      this.areas.forEach((el) => el.changeState(true));
    } else {
      this.areas.forEach((el, i) => {
        if (placeIndex == i) el?.changeState(true);
        else el?.changeState(false);
      });
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
    document.body.className = active.currentPlayer;
    document.body.id = active.me;
    document.querySelector("#app")?.append(cont);
    socket.on("play", (data: number[]) => {
      const [area, i] = data;
      this.areas[area].playAt(i, true);
    });
  }
}
