import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
function replaceAt(string, index, replacement) {
  const r = string.split("");
  r[index] = replacement;
  return r.join("");
}

const part1 = (rawInput) => {
  let collected = 0;
  const input = parseInput(rawInput)
    .split("\n\n")
    .map((x) => x.split("\n"));
  let total = 0;
  for (let g in input) {
    const grid = input[g];
    let flag = true;
    for (let i = 1; i < grid.length; i++) {
      if (checkMirrorLine(grid, i, 1)) {
        total += i * 100;
        flag = false;
        collected++;
        break;
      }
    }
    if (flag) {
      const rotated = rotateInput(grid);
      for (let i = 1; i < rotated.length; i++) {
        if (checkMirrorLine(rotated, i, 1)) {
          total += i;
          collected++;
          break;
        }
      }
    }
  }
  console.log(input.length, collected);
  return total;
};

function sumMirrored(grid) {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === grid[i + 1]) {
      let subtotal = 1;
      let j = 0;
      while (grid[i - j] === grid[i + 1 + j] && i + j < grid.length) {
        subtotal++;
        j++;
      }
      if (i + j + 1 === grid.length || i - j === -1) return subtotal;
    }
  }
  return 0;
}
function rotateInput(grid) {
  const newGrid = [];
  for (const _ in grid[0]) {
    newGrid.push("");
  }
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      newGrid[j] += grid[i][j];
    }
  }
  return newGrid;
}
function checkMirrorLine(grid, mirrorLine, part) {
  let top, bottom;
  if (mirrorLine <= grid.length / 2) {
    top = grid
      .slice(mirrorLine, mirrorLine * 2)
      .toReversed()
      .join("");
    bottom = grid.slice(0, mirrorLine).join("");
  } else {
    top = grid
      .slice((mirrorLine - grid.length) * 2, mirrorLine)
      .toReversed()
      .join("");
    bottom = grid.slice(mirrorLine).join("");
  }
  // if (part === 1) {
  //   return bottom === top;
  // }
  const difference = top.split("").reduce((a, c, i) => {
    if (c !== bottom[i]) return a + 1;
    return a;
  }, 0);
  if (part == 1) {
    return difference === 0;
  } else if (part == 2) {
    return difference === 1;
  }
}
function toBin(line) {
  return line.replace(/#/g, "1").replace(/\./g, "0");
}
function compareBin(a, b) {
  return parseInt(a, 2) ^ parseInt(b, 2);
}
function isPowerOf2(num) {
  return Math.log2(num) % 1 === 0;
}

function matching(a, b) {
  const x = toBin(a);
  const y = toBin(b);
  const total = compareBin(x, y);
  return total === 0;
}
const part2 = (rawInput) => {
  let collected = 0;
  const input = parseInput(rawInput);
  const parsed = input.split("\n\n").map((x) => x.split("\n"));
  let total = 0;
  for (let grid of parsed) {
    let flag = true;
    for (let i = 1; i < grid.length; i++) {
      if (checkMirrorLine(grid, i, 2) && !checkMirrorLine(grid, i)) {
        total += i * 100;
        collected++;
        flag = false;
        break;
      }
    }
    if (flag) {
      const rotated = rotateInput(grid);
      for (let i = 1; i < rotated.length; i++) {
        if (checkMirrorLine(rotated, i, 2) && !checkMirrorLine(grid, i)) {
          total += i;
          collected++;
          flag = false;
          break;
        }
      }
      //flag && console.log(grid);
    }
  }
  console.log(parsed.length, collected);
  return total;
};

run({
  part1: {
    tests: [
      {
        input: `
         #.##..##.
         ..#.##.#.
         ##......#
         ##......#
         ..#.##.#.
         ..##..##.
         #.#.##.#.
         
         #...##..#
         #....#..#
         ..##..###
         #####.##.
         #####.##.
         ..##..###
         #....#..#
         `,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        #.##..##.
        ..#.##.#.
        ##......#
        ##......#
        ..#.##.#.
        ..##..##.
        #.#.##.#.
        
        #...##..#
        #....#..#
        ..##..###
        #####.##.
        #####.##.
        ..##..###
        #....#..#
        `,
        expected: 400,
      },
      {
        input: `
         #.##..##.
         ..#.##.#.
         ##......#
         ##......#
         ..#.##.#.
         ..##..##.
         #.#.##.#.
         `,
        expected: 300,
      },
      {
        input: `
         .#..#......
         ..#.#......
         ..#...#....
         #.##...####
         .#..#..####
         #.#.##.####
         ###..#.#..#
          `,
        expected: 10,
      },
      {
        input: `
         #...##..#
         #....#..#
         ..##..###
         #####.##.
         #####.##.
         ..##..###
         #....#..#
          `,
        expected: 100,
      },
      {
        input: `
         #.##..##.
         ..#.##.#.
         ##......#
         ##......#
         ..#.##.#.
         ..##..##.
         #.#.##.#.
         `,
        expected: 300,
      },
    ],

    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
