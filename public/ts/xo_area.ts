import { game, myArea, settings } from "./main.js";
import { socket } from "./socket.js";
import { xo, XO } from "./xo.js";

export class XOArea extends XO {
  array: xo[];
  active: boolean;
  element: HTMLElement;
  id: number;
  done: boolean;
  constructor({ active, id }: { active: boolean; id: number }) {
    super();
    this.active = active;
    this.array = [];
    this.id = id;
    this.element = this.build();
    this.done = false;
  }

  changeState(active: boolean) {
    if (this.done) return;
    this.active = active;
    if (active) return this.element.classList.remove("disabled");
    this.element.classList.add("disabled");
  }

  drawLine({ direction, indexes }: { direction: string; indexes: number[] }) {
    for (const i of indexes) {
      const span = this.element.children.item(+i);
      span?.classList.add(direction);
    }
  }
  async playAt(i: number, other?: boolean) {
    if (settings.online && !game.connected) return;
    if (game.currentPlayer !== game.me && !other) return false;
    if (!this.active || this.array[i] !== undefined) return false;
    const span = <HTMLElement>this.element.childNodes[i];
    span.innerHTML = game.currentPlayer;
    span.className = game.currentPlayer;
    this.array[i] = game.currentPlayer;

    // online
    if (settings.online && !other) {
      this.wasPlayedAt(i);
      socket.emit("play", [this.id, i]);
      socket.once("played", () => {
        console.log("played was received");
        myArea.switchTime();
      });
    } else this.wasPlayedAt(i);
    if (settings.online && other) myArea.switchTime();
  }

  wasPlayedAt(i: number) {
    if (this.isWon(i)) {
      myArea.add({ value: game.currentPlayer, index: this.id });
      this.changeState(false);
      this.done = true;
      this.element.classList.add("done", game.currentPlayer);
      this.element.setAttribute("winner", game.currentPlayer);
      this.drawLine(this.getWinLine(i));
    }
    // no one won in this filed and it's full
    if (
      this.array.length === 9 &&
      [...this.array.values()].every((el) => el !== undefined)
    ) {
      this.changeState(false);
      this.done = true;
    }

    myArea.changePlace(i);
    if (!settings.online) game.me = game.me == "x" ? "o" : "x";
  }

  build() {
    const div = document.createElement("div");
    div.className = `xo_area ${!this.active ? "disabled" : ""}`;
    for (let i = 0; i < 9; i++) {
      const span = document.createElement("span");
      span.addEventListener("mouseenter", () => {
        if (!this.active || this.array[i] !== undefined) return false;
        span.setAttribute("current", game.me);
      });
      span.addEventListener("mouseleave", () => {
        if (!this.active || this.array[i] !== undefined) return false;

        span.removeAttribute("current");
      });
      span.addEventListener("click", () => this.playAt(i));
      div.append(span);
    }

    return div;
  }


}
