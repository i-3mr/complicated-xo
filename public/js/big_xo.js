import { game } from "./main.js";
import { socket } from "./socket.js";
import { XO } from "./xo.js";
import { XOArea } from "./xo_area.js";
export class BigXO extends XO {
    constructor() {
        super();
        this.areas = [];
        this.array = [];
        this.finished = false;
    }
    add({ value, index }) {
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
    changePlace(placeIndex) {
        var _a;
        game.currentPlayer = game.currentPlayer == "x" ? "o" : "x";
        if (this.finished)
            return;
        document.body.className = game.currentPlayer;
        if ((_a = this.areas[placeIndex]) === null || _a === void 0 ? void 0 : _a.done) {
            this.areas.forEach((el) => el.changeState(true));
        }
        else {
            this.areas.forEach((el, i) => {
                if (placeIndex == i)
                    el === null || el === void 0 ? void 0 : el.changeState(true);
                else
                    el === null || el === void 0 ? void 0 : el.changeState(false);
            });
        }
    }
    build() {
        var _a;
        const cont = document.createElement("div");
        cont.className = "big_xo";
        for (let i = 0; i < 9; i++) {
            const ox = new XOArea({ active: true, id: i });
            this.areas.push(ox);
            cont.append(ox.element);
        }
        document.body.className = game.currentPlayer;
        document.body.id = game.me;
        (_a = document.querySelector("#app")) === null || _a === void 0 ? void 0 : _a.append(cont);
        socket.on("play", (data) => {
            const [area, i] = data;
            this.areas[area].playAt(i, true);
        });
    }
}
