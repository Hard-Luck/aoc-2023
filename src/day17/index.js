import run from "aocrunner";
const cache = {};
/*
cache = {
  [2,1]: {
    d : 10
    dd : 8
    uu : 7
    ...etc
  }
}

*/
const parseInput = (rawInput) => rawInput;
function generateWeightGrid(input) {
  const grid = input.map((_) =>
    Array.from({ length: input[0].length }).fill(Infinity),
  );
  grid[0][0] = 0;
  return grid;
}
const directions = {
  u: [-1, 0],
  d: [1, 0],
  l: [0, -1],
  r: [0, 1],
};
function sumPoints([a, b], [c, d]) {
  return [a + c, b + d];
}
function addSeenToCache(point, direction) {
  cache[point] ??= {};
  cache[point].seen = true;
}
function addValueToCache(point, direction, value) {
  cache[point] ??= {};
  cache[point].seen = true;
}
let best = Infinity;
function distanceToEnd(grid, [y, x], [ey, ex], direction, currentWeight) {
  if (cache[[y, x]]?.[direction]?.value !== undefined) {
    return cache[[y, x]][direction];
  }
  if (cache[[y, x]]?.[direction]?.seen !== undefined) {
    return Infinity;
  }
  addSeenToCache([y, x], direction);
  if (!inBounds(grid, [y, x])) return;
  currentWeight += grid[y][x];
  console.log({ ex, ey, x, y });
  if (ey === y && ex === x) {
    console.log("here");
    best = Math.min(currentWeight, best);
    return currentWeight;
  }
  const neighbours = getNeighbours(grid, [y, x], direction);

  const toCache = Math.min(
    ...neighbours
      .filter(
        ({ next, direction }) => cache[[y, x]]?.[direction]?.seen !== true,
      )
      .map(({ next, direction }) => {
        console.log({ next, neighbours });
        return distanceToEnd(grid, next, [ey, ex], direction, currentWeight);
      }),
  );
  addValueToCache([y, x], direction, toCache);
  return toCache;
}
// go to each neighbour
// keep track of direction
// return infinity for 3x in same direction
//
function inBounds(grid, [y, x]) {
  return y >= 0 && x >= 0 && x < grid[0].length && y < grid.length;
}
function getNeighbours(grid, point, [dy, dx]) {
  const neighbours = [];
  if (dy !== 0 || dx !== 1) {
    const toAdd = [point[0], point[1] - 1];
    if (inBounds(grid, toAdd)) {
      neighbours.push({ next: toAdd, direction: "l" });
    }
  }
  if (dy !== 0 || dx !== -1) {
    const toAdd = [point[0], point[1] + 1];
    if (inBounds(grid, toAdd)) {
      neighbours.push({ next: toAdd, direction: "r" });
    }
  }
  if (dy !== 1 || dx !== 0) {
    const toAdd = [point[0] - 1, point[1]];
    if (inBounds(grid, toAdd)) {
      neighbours.push({ next: toAdd, direction: "u" });
    }
  }
  if (dy !== -1 || dx !== 0) {
    const toAdd = [point[0] + 1, point[1]];
    if (inBounds(grid, toAdd)) {
      neighbours.push({ next: toAdd, direction: "d" });
    }
  }
  return neighbours;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split("").map(Number));
  const startX = 0;
  const startY = 0;
  const endX = input[0].length - 1;
  const endY = input.length - 1;
  distanceToEnd(input, [startX, startY], [endX, endY], [0, 0], 0);
  return best;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
          15
          63
        `,
        expected: 8,
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
