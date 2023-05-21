import { game } from "./main.js";

export type xo = "x" | "o";
export class XO {
  array: string[];
  constructor() {
    this.array = [];
  }
  getWinPossibilities(index: number): (string[] | never[])[] {
    const column = XO.getColumn(this.array, index);
    const raw = XO.getRaw(this.array, index);
    const minusDiagonal = XO.getMinusDiagonal(this.array, index);
    const plusDiagonal = XO.getPlusDiagonal(this.array, index);
    return [column, raw, minusDiagonal, plusDiagonal];
  }
  isWon(index: number) {
    return Boolean(
      this.getWinPossibilities(index).filter(
        (el) => el.length == 3 && new Set(el).size == 1
      ).length
    );
  }
  getWinLine(index: number): { indexes: number[]; direction: string } {
    const data: any = {
      0: { value: "column", func: XO.getColumn },
      1: { value: "raw", func: XO.getRaw },
      2: { value: "minusDiagonal", func: XO.getMinusDiagonal },
      3: { value: "plusDiagonal", func: XO.getPlusDiagonal },
    };
    const array = this.getWinPossibilities(index);
    for (let i = 0; i < array.length; i++) {
      if (array[i].length == 3 && new Set(array[i]).size == 1) {
        return {
          indexes: data[i].func([0, 1, 2, 3, 4, 5, 6, 7, 8], index),
          direction: data[i].value,
        };
      }
    }
    return { indexes: [], direction: "" };
  }

  static getColumn(array: any[], index: number) {
    return array.filter((el, ind) => ind % 3 === index % 3);
  }
  static getRaw(array: any[], index: number) {
    return array.filter((el, ind) => ~~(ind / 3) === ~~(index / 3));
  }
  static getMinusDiagonal(array: any[], index: number) {
    return array.filter((el, i) => i % 4 === 0);
  }
  static getPlusDiagonal(array: any[], index: number) {
    return array.filter(
      (el, i) => i % 2 === 0 && (i % 4 !== 0 || i === 4)
    );
  }
}
