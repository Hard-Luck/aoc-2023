import run from "aocrunner";
import { rotateInput } from "../utils/index.js";
const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(""));
  const rotated = rotateInput(input).map((x) => x.split("").reverse());
  for (const row of rotated) {
    bubbleSort(row);
  }
  console.table(rotated);
  let total = 0;
  rotated.forEach((x) => {
    x.forEach((y, i) => {
      if (y === "O") total += i + 1;
    });
  });
  return total;
};
function bubbleSort(row) {
  for (let i = 0; i < row.length; i++) {
    let changed = false;
    for (let j = 0; j < row.length - 1 - i; j++) {
      if (row[j] === "O" && row[j + 1] === ".") {
        changed = true;
        [row[j], row[j + 1]] = [row[j + 1], row[j]];
      }
    }
    if (!changed) return;
  }
}
const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
         O....#....
         O.OO#....#
         .....##...
         OO.#O....O
         .O.....O#.
         O.#..O.#.#
         ..O..#O..O
         .......O..
         #....###..
         #OO..#....
         `,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
