import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
function replaceAt(string, index, replacement) {
  const r = string.split("");
  r[index] = replacement;
  return r.join("");
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n\n")
    .map((x) => x.split("\n"));
  let total = 0;
  for (let g in input) {
    const grid = input[g];
    let flag = true;
    for (let i = 1; i < grid.length; i++) {
      if (checkMirrorLine(grid, i)) {
        total += i * 100;
        flag = false;
        break;
      }
    }
    if (flag) {
      const rotated = rotateInput(grid);
      for (let i = 1; i < rotated.length; i++) {
        if (checkMirrorLine(rotated, i)) {
          total += i;
          break;
        }
      }
    }
  }
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
function checkMirrorLine(grid, mirrorLine, part = 1) {
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
  return bottom === top;
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
  const input = parseInput(rawInput);
  const parsed = input.split("\n\n").map((x) => x.split("\n"));
  console.log(parsed, "<----------");
  let total = 0;
  for (let grid of parsed) {
    console.log(grid);
    outer: for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[0].length; y++) {
        let flag = true;
        const oldSym = grid[x][y];
        const newSym = grid[x][y] === "." ? "#" : ".";
        console.log(oldSym);
        console.log(newSym);
        console.log(grid[x], "grid x ");
        console.log(grid[x + 1], "grid x +1");
        console.log({ x, y });
        grid[x] = replaceAt(grid[x], y, newSym);
        console.log(grid[x]);
        for (let i = 0; i < grid.length; i++) {
          if (checkMirrorLine(grid, i, 2)) {
            total += i * 100;
            flag = false;
            replaceAt(grid[x], y, oldSym);
            break outer;
          }
        }
        if (flag) {
          const rotated = rotateInput(grid);
          for (let i = 1; i < rotated.length; i++) {
            if (checkMirrorLine(rotated, i, 2)) {
              console.log(i, grid, "rotated");
              total += i;
              replaceAt(grid[x], y, oldSym);
              break outer;
            }
          }
        }
        replaceAt(grid[x], y, oldSym);
      }
    }
  }
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
      //{
      //  input: `
      //   #.##..##.
      //   ..#.##.#.
      //   ##......#
      //   ##......#
      //   ..#.##.#.
      //   ..##..##.
      //   #.#.##.#.
      //   `,
      //  expected: 300,
      //},
      //{
      //  input: `
      //  #.##..##.
      //  ..#.##.#.
      //  ##......#
      //  ##......#
      //  ..#.##.#.
      //  ..##..##.
      //  #.#.##.#.
      //
      //  #...##..#
      //  #....#..#
      //  ..##..###
      //  #####.##.
      //  #####.##.
      //  ..##..###
      //  #....#..#
      //`   ,
      //   expected: 400,
      // },
      // {
      //   input: `
      //   .#..#......
      //   ..#.#......
      //   ..#...#....
      //   #.##...####
      //   .#..#..####
      //   #.#.##.####
      //   ###..#.#..#
      //    `,
      //   expected: 9,
      // },
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
      //{
      //  input: `
      //   #.##..##.
      //   ..#.##.#.
      //   ##......#
      //   ##......#
      //   ..#.##.#.
      //   ..##..##.
      //   #.#.##.#.
      //   `,
      //  expected: 300,
      //},
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
