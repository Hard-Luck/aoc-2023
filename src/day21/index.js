import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
function findStart(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "S") {
        return [y, x];
      }
    }
  }
}
function inBounds([y, x], map) {
  return x >= 0 && x < map[0].length && y >= 0 && y < map.length;
}
const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];
function walk(grid, location, remainingSteps, globalVisited) {
  let total = 0;
  const [y, x] = location;
  if (globalVisited.has(JSON.stringify([[y, x], remainingSteps]))) return 0;
  // if (localVisited.includes(JSON.stringify([y, x]))) return 0;
  globalVisited.add(JSON.stringify([[y, x], remainingSteps]));
  if (remainingSteps === 0) return 1;
  // localVisited.push(JSON.stringify([y, x]));
  for (const [b, a] of directions) {
    const [ny, nx] = [y + b, x + a];
    if (!inBounds([ny, nx], grid)) continue;
    if (grid[ny][nx] === "#") continue;
    total += walk(grid, [ny, nx], remainingSteps - 1, globalVisited);
  }
  return total;
}
function getPoints(grid, start, steps) {
  const seen = new Set();
  const canReach = new Set();
  const q = [[start[0], start[1], steps]];
  while (q.length) {
    const [y, x, s] = q.shift();
    if (seen.has(JSON.stringify([y, x, s]))) continue;
    seen.add(JSON.stringify([y, x, s]));
    if (s % 2 === 0) canReach.add(JSON.stringify([y, x]));
    if (s === 0) continue;
    for (const [b, a] of directions) {
      const [ny, nx] = [y + b, x + a];
      if (
        inBounds([ny, nx], grid) &&
        grid[ny][nx] !== "#" &&
        !seen.has(JSON.stringify([ny, nx, s - 1])) &&
        !canReach.has(JSON.stringify([ny, nx]))
      ) {
        q.push([ny, nx, s - 1]);
      }
    }
  }
  return canReach.size;
}
const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(""));
  const start = findStart(input);
  const globalVisited = new Set();
  const MAX_STEPS = 64;

  const total = getPoints(input, start, MAX_STEPS);
  return total;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(""));
  const gridLength = input.length;
  const gridWidth = input[0].length;
  console.log(gridLength, gridWidth);
  const start = findStart(input);
  const [y, x] = start;
  const canReachOnEvenStep = getPoints(input, start, gridLength * 2);
  const canReachOnOddStep = getPoints(input, start, gridLength * 2 + 1);
  console.log({ odd: canReachOnOddStep, even: canReachOnEvenStep });
  const topCorner = getPoints(input, [gridLength - 1, x], gridLength - 1);
  const bottomCorner = getPoints(input, [0, x], gridLength - 1);
  const rightCorner = getPoints(input, [y, 0], gridWidth - 1);
  const leftCorner = getPoints(input, [y, gridWidth - 1], gridLength - 1);
  const points = {
    left: topCorner,
    right: bottomCorner,
    top: rightCorner,
    bottom: leftCorner,
  };
  console.log(points);
  //console.log({ even: canReachOnEvenStep, odd: canReachOnOddStep });
  const smallCorners = {
    br: getPoints(input, [0, 0], Math.floor(gridLength / 2) - 1),
    bl: getPoints(input, [gridLength - 1, 0], Math.floor(gridLength / 2) - 1),
    tr: getPoints(input, [0, gridWidth - 1], Math.floor(gridLength / 2) - 1),
    tl: getPoints(
      input,
      [gridLength - 1, gridWidth - 1],
      Math.floor(gridLength / 2) - 1,
    ),
  };
  const bigCorners = {
    br: getPoints(input, [0, 0], Math.floor((3 * gridLength) / 2) - 1),
    bl: getPoints(
      input,
      [gridLength - 1, 0],
      Math.floor((3 * gridLength) / 2) - 1,
    ),
    tr: getPoints(
      input,
      [0, gridWidth - 1],
      Math.floor((3 * gridLength) / 2) - 1,
    ),
    rl: getPoints(
      input,
      [gridLength - 1, gridWidth - 1],
      Math.floor((3 * gridLength) / 2) - 1,
    ),
  };
  console.log({ smallCorners, bigCorners });
  const n = Math.floor(26501365 / input.length);
  let total = (n - 1) ** 2 * canReachOnOddStep;
  total += n ** 2 * canReachOnEvenStep;
  total += Object.values(smallCorners).reduce((a, c) => a + c * n, 0);
  total += Object.values(bigCorners).reduce((a, c) => a + c * (n - 1), 0);
  total += topCorner;
  total += bottomCorner;
  total += leftCorner;
  total += rightCorner;
  return total;
};

run({
  part1: {
    tests: [
      // {
      //   input: `
      //    ...........
      //    .....###.#.
      //    .###.##..#.
      //    ..#.#...#..
      //    ....#.#....
      //    .##..S####.
      //    .##..#...#.
      //    .......##..
      //    .##.#.####.
      //    .##..##.##.
      //    ...........
      //    `,
      //   expected: 16,
      // },
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
