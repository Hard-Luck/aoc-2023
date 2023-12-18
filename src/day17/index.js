import run from "aocrunner";
import { Heap } from "heap-js";

function parseInput(rawInput) {
  return rawInput;
}
const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split("").map(Number));
  const costs = triplePushingDijkstra(input);
  return costs;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split("").map(Number));

  const costs = megaCruciblePushingDijkstra(input);
  return costs;
};
function inBounds(grid, y, x) {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
}

const directions = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
];

function sortPriorityQueue(a, b) {
  return a[5] - b[5];
}
function atEnd(grid, y, x) {
  return y === grid.length - 1 && x === grid[0].length - 1;
}

function triplePushingDijkstra(grid) {
  const visited = new Set();
  const pq = new Heap(sortPriorityQueue);
  pq.push([0, 0, 0, 0, 0, 0]);
  while (pq.length > 0) {
    const [y, x, dy, dx, numSteps, heatLoss] = pq.pop();
    if (atEnd(grid, y, x)) {
      return heatLoss;
    }
    if (visited.has(JSON.stringify([y, x, dy, dx, numSteps]))) continue;
    visited.add(JSON.stringify([y, x, dy, dx, numSteps]));
    if (numSteps < 3 && !(dx === 0 && dy === 0)) {
      if (inBounds(grid, y + dy, x + dx)) {
        const cost = heatLoss + grid[y + dy][x + dx];
        pq.push([y + dy, x + dx, dy, dx, numSteps + 1, cost]);
      }
    }
    for (const [a, b] of directions) {
      if (a === -dy && b === -dx) continue;
      if (a === dy && b === dx) continue;
      const [y1, x1] = [y + a, x + b];
      if (!inBounds(grid, y1, x1)) continue;
      const cost = heatLoss + grid[y1][x1];
      pq.push([y1, x1, a, b, 1, cost]);
    }
  }
}
function sumNextFour(grid, y, x, dy, dx) {
  let sum = 0;
  for (let i = 1; i <= 4; i++) {
    const [ny, nx] = [y + i * dy, x + i * dx];
    if (inBounds(grid, ny, nx)) {
      sum += grid[ny][nx];
    }
  }
  return sum;
}
function megaCruciblePushingDijkstra(grid) {
  const visited = new Set();
  const pq = new Heap(sortPriorityQueue);
  pq.push([0, 0, 0, 0, 0, 0]);
  while (pq.length > 0) {
    const [y, x, dy, dx, numSteps, heatLoss] = pq.pop();
    if (atEnd(grid, y, x)) {
      return heatLoss;
    }
    if (visited.has(JSON.stringify([y, x, dy, dx, numSteps]))) continue;
    visited.add(JSON.stringify([y, x, dy, dx, numSteps]));

    if (numSteps < 10 && numSteps >= 4) {
      if (inBounds(grid, y + dy, x + dx)) {
        const cost = heatLoss + grid[y + dy][x + dx];
        pq.push([y + dy, x + dx, dy, dx, numSteps + 1, cost]);
      }
    }
    for (const [a, b] of directions) {
      if (a === -dy && b === -dx) continue;
      if (a === dy && b === dx) continue;
      const ny = y + a * 4;
      const nx = x + b * 4;
      if (!inBounds(grid, ny, nx)) continue;
      const cost = heatLoss + sumNextFour(grid, y, x, a, b);
      pq.push([ny, nx, a, b, 4, cost]);
    }
  }
}
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
      {
        input: `
          1531
          1111
          1234
        `,
        expected: 8,
      },
      {
        input: `
        2413432311323
        3215453535623
        3255245654254
        3446585845452
        4546657867536
        1438598798454
        4457876987766
        3637877979653
        4654967986887
        4564679986453
        1224686865563
        2546548887735
        4322674655533
        `,
        expected: 102,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        2413432311323
        3215453535623
        3255245654254
        3446585845452
        4546657867536
        1438598798454
        4457876987766
        3637877979653
        4654967986887
        4564679986453
        1224686865563
        2546548887735
        4322674655533
        `,
        expected: 94,
      },
      {
        input: `
        111111111111
        999999999991
        999999999991
        999999999991
        999999999991
        `,
        expected: 71,
      },
      {
        input: `
          12341
        `,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
