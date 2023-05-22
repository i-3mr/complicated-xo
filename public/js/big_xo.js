import { ConnectionState } from "./components/connection_state.js";
import { game, myArea, settings } from "./main.js";
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
            showWinner(value);
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
        game.other = new ConnectionState({ state: 0 });
        // online
        if (settings.online) {
            socket.on("play", (data) => {
                if (game.currentPlayer == game.me)
                    return;
                const [area, i] = data;
                this.areas[area].playAt(i, true);
                socket.emit("played");
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
function showWinner(winner) {
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
        var _a;
        (_a = document.querySelector(".big_xo")) === null || _a === void 0 ? void 0 : _a.remove();
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
