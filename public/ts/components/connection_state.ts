import { game } from "../main.js";

export class ConnectionState {
  state: number;
  element: HTMLElement;
  private texts: {
    [key: number]: {
      key: string;
      class_value: string;
    };
  } = {
    0: {
      key: "waiting for other player...",
      class_value: "yellow",
    },
    1: {
      key: "other player is connected",
      class_value: "green",
    },
    2: {
      key: "other player is disconnected",
      class_value: "red",
    },
    3: {
      key: "you are disconnected",
      class_value: "red",
    },
  };
  constructor({ state }: { state: number }) {
    this.state = state;
    this.element = this.build();
    document.body.append(this.element);
  }

  build() {
    const otherState = document.createElement("div");
    otherState.className = `other-state ${this.texts[0].class_value}`;
    otherState.textContent = this.texts[0].key;
    return otherState;
  }

  changeState(state: number) {
    this.state = state;
    this.element.className = `other-state ${this.texts[state].class_value}`;
    this.element.textContent = this.texts[state].key;
    if (state !== 1) return (game.connected = false);
    game.connected = true;
  }
}
