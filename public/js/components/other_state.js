export class ConnectionState {
    constructor({ state }) {
        this.texts = {
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
        };
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
    changeState(state) {
        if (this.state === state)
            return;
        this.state = state;
        this.element.className = `other-state ${this.texts[state ? 1 : 2].class_value}`;
        this.element.textContent = this.texts[state ? 1 : 2].key;
    }
}
