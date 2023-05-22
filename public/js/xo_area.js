var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { game, myArea, settings } from "./main.js";
import { socket } from "./socket.js";
import { XO } from "./xo.js";
export class XOArea extends XO {
    constructor({ active, id }) {
        super();
        this.active = active;
        this.array = [];
        this.id = id;
        this.element = this.build();
        this.done = false;
    }
    changeState(active) {
        if (this.done)
            return;
        this.active = active;
        if (active)
            return this.element.classList.remove("disabled");
        this.element.classList.add("disabled");
    }
    drawLine({ direction, indexes }) {
        for (const i of indexes) {
            const span = this.element.children.item(+i);
            span === null || span === void 0 ? void 0 : span.classList.add(direction);
        }
    }
    playAt(i, other) {
        return __awaiter(this, void 0, void 0, function* () {
            if (settings.online && !game.connected)
                return;
            if (game.currentPlayer !== game.me && !other)
                return false;
            if (!this.active || this.array[i] !== undefined)
                return false;
            const span = this.element.childNodes[i];
            span.innerHTML = game.currentPlayer;
            span.className = game.currentPlayer;
            this.array[i] = game.currentPlayer;
            if (game.timeMode)
                myArea.stopTime();
            // online
            if (settings.online && !other) {
                this.wasPlayedAt(i);
                myArea.stopTime();
                socket.emit("play", [this.id, i]);
                socket.once("played", () => {
                    console.log("played was received");
                    myArea.continueTime();
                });
            }
            else
                this.wasPlayedAt(i);
        });
    }
    wasPlayedAt(i) {
        if (this.isWon(i)) {
            myArea.add({ value: game.currentPlayer, index: this.id });
            this.changeState(false);
            this.done = true;
            this.element.classList.add("done", game.currentPlayer);
            this.element.setAttribute("winner", game.currentPlayer);
            this.drawLine(this.getWinLine(i));
        }
        // no one won in this filed and it's full
        if (this.array.length === 9 &&
            [...this.array.values()].every((el) => el !== undefined)) {
            this.changeState(false);
            this.done = true;
        }
        myArea.changePlace(i);
        if (!settings.online)
            game.me = game.me == "x" ? "o" : "x";
    }
    build() {
        const div = document.createElement("div");
        div.className = `xo_area ${!this.active ? "disabled" : ""}`;
        for (let i = 0; i < 9; i++) {
            const span = document.createElement("span");
            span.addEventListener("mouseenter", () => {
                if (!this.active || this.array[i] !== undefined)
                    return false;
                span.setAttribute("current", game.me);
            });
            span.addEventListener("mouseleave", () => {
                if (!this.active || this.array[i] !== undefined)
                    return false;
                span.removeAttribute("current");
            });
            span.addEventListener("click", () => this.playAt(i));
            div.append(span);
        }
        return div;
    }
}
