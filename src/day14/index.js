import run from "aocrunner";
import { log } from "console";
const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(""));

  tiltNorth(input);
  console.table(input);
  //console.table(rotated);
  let total = 0;
  input.forEach((x, i) => {
    x.forEach((y) => {
      if (y === "O") {
        total += input.length - i;
      }
    });
  });
  return total;
};

function sortEast(row) {
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
function sortWest(row) {
  for (let i = row.length - 1; i >= 0; i--) {
    let changed = false;
    for (let j = row.length - 1; j > row.length - 1 - i; j--) {
      if (row[j] === "O" && row[j - 1] === ".") {
        changed = true;
        [row[j], row[j - 1]] = [row[j - 1], row[j]];
      }
    }
    if (!changed) return;
  }
}
function tiltWest(grid) {
  for (const row of grid) {
    sortWest(row);
  }
}
function tiltEast(grid) {
  for (const row of grid) {
    sortEast(row);
  }
}
function tiltSouth(grid) {
  for (let i = 0; i < grid[0].length; i++) {
    for (let j = 0; j < grid.length; j++) {
      let changed = false;
      for (let k = 0; k < grid.length - 1 - j; k++) {
        if (grid[k][i] === "O" && grid[k + 1][i] === ".") {
          changed = true;
          [grid[k][i], grid[k + 1][i]] = [grid[k + 1][i], grid[k][i]];
        }
      }
      if (!changed) break;
    }
  }
}
function tiltNorth(grid) {
  for (let i = 0; i < grid[0].length; i++) {
    for (let j = 0; j < grid.length; j++) {
      let changed = false;
      for (let k = grid.length - 1; k > 0 + j; k--) {
        if (grid[k - 1][i] === "." && grid[k][i] === "O") {
          changed = true;
          [grid[k][i], grid[k - 1][i]] = [grid[k - 1][i], grid[k][i]];
        }
      }
      if (!changed) break;
    }
  }
}
function cycle(grid) {
  tiltNorth(grid);
  //console.log("North");
  //console.table(grid);

  tiltWest(grid);
  //console.log("West");
  //.table(grid);

  tiltSouth(grid);
  //console.log("South");
  //console.table(grid);

  tiltEast(grid);
  //console.log("East");
  //console.table(grid);
}
const cache = {};
function cacheResult(key, cycle) {
  cache[key] = cycle;
}
function checkCache(label) {
  const result = cache[label];
  if (result) {
    console.log("hit");
  }
  return result;
}
function findCycles(input) {
  const key = JSON.stringify(input);
  cacheResult(key, 0);
  for (let i = 1; i <= 1000000000; i++) {
    const key = JSON.stringify(input);
    if (checkCache(key)) {
      const cycleLength = i - checkCache(key);
      return { cycleLength, i };
    }
    cycle(input);
    cacheResult(key, i);
  }
}
const CYCLES = 1000000000;
const part2 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((y) => y.split(""));
  const { cycleLength, i } = findCycles(input);
  const required = (CYCLES - i) % cycleLength;
  for (let i = 0; i <= required; i++) {
    cycle(input);
  }
  //console.table(input);
  let total = 0;
  input.forEach((x, i) => {
    x.forEach((y) => {
      if (y === "O") {
        total += input.length - i;
      }
    });
  });
  return total;
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
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
