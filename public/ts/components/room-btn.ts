import { joinRoom } from "../join-room.js";
import { socket } from "../socket.js";
export class RoomButton {
  id: string;
  el: HTMLButtonElement;
  constructor({ id }: { id: string }) {
    this.id = id;
    this.el = this.build();
  }
  join() {
    socket.emit("join-room", this.id, joinRoom);
  }
  build() {
    const button = document.createElement("button");
    button.textContent = this.id;
    button.id = `i${this.id}`;
    button.className = "room-btn";
    button.addEventListener("click", () => this.join());
    return button;
  }
}
