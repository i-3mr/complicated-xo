export class Time {
    constructor({ minutes }) {
        this.interval = null;
        this._minutes = minutes;
        this.seconds = minutes * 60;
        this.element = this.build();
    }
    set minutes(value) {
        this.seconds = value * 60;
    }
    startDecrement() {
        this.element.classList.add("active");
        return new Promise((res, rej) => {
            this.interval = setInterval(() => {
                this.seconds--;
                if (this.seconds < 0) {
                    this.seconds = 0;
                    rej();
                }
                this.element.textContent = this.format();
            }, 1000);
        });
    }
    stopDecrement() {
        this.element.classList.remove("active");
        clearInterval(this.interval);
    }
    build() {
        // an element which shows the time using format: 00:00
        const time = document.createElement("div");
        time.className = "time";
        time.textContent = this.format();
        return time;
    }
    format() {
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;
        return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }
    reset() {
        this.stopDecrement();
        this.seconds = this._minutes * 60;
        this.element.textContent = this.format();
    }
}
