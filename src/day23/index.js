import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
const cardinalDirections = {
  "^": [-1, 0],
  v: [1, 0],
  "<": [0, -1],
  ">": [0, 1],
};
function getAt(grid, [y, x]) {
  return grid[y][x];
}
function inBounds(grid, [y, x]) {
  return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length;
}
function getNeighbours(grid, [y, x]) {
  const steps = [];
  for (const [dy, dx] of Object.values(cardinalDirections)) {
    const ny = dy + y;
    const nx = dx + x;
    if (inBounds(grid, [ny, nx]) && getAt(grid, [ny, nx]) !== "#") {
      steps.push([ny, nx]);
    }
  }
  return steps;
}
let best1 = 0;
function walk(grid, location, end, path = []) {
  const next = [];
  if (tileLabel(...location) === tileLabel(...end)) {
    best1 = Math.max(best1, path.length);
  } else if (!path.includes(tileLabel(...location))) {
    path.push(tileLabel(...location));
    const currentTile = getAt(grid, location);
    if (cardinalDirections[currentTile]) {
      const [dy, dx] = cardinalDirections[currentTile];
      next.push([location[0] + dy, location[1] + dx]);
    } else {
      next.push(...getNeighbours(grid, location));
    }
    for (const x of next) {
      walk(grid, x, end, path);
    }
    path.pop();
  }
}
let best2 = 0;
function walk2(graph, location, end, path = [], total = 0) {
  if (path.includes(location)) {
    path.pop();
    return;
  }
  path.push(location);
  if (location === end) {
    best2 = Math.max(best2, total);
  } else {
    for (const key in graph[location]) {
      if (path.includes(key)) continue;
      const distance = graph[location][key];
      walk2(graph, key, end, path, distance + total);
    }
  }
  path.pop();
}

function tileLabel(y, x) {
  return `${y},${x}`;
}
const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(""));
  const start = [0, input[0].indexOf(".")];
  const end = [input.length - 1, input.at(-1).indexOf(".")];
  walk(input, start, end);
  return best1;
};
function findNodes(input) {
  const nodes = [];
  for (let i = 0; i < input[0].length; i++) {
    for (let j = 0; j < input.length; j++) {
      if (getAt(input, [j, i]) === "#") continue;
      const neighbours = getNeighbours(input, [j, i]);
      if (neighbours.length > 2) {
        nodes.push([j, i]);
      }
    }
  }
  return nodes;
}
const part2 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(""));
  const start = [0, input[0].indexOf(".")];
  const end = [input.length - 1, input.at(-1).indexOf(".")];
  const nodes = [start, ...findNodes(input), end];
  const nodeLocations = nodes.map(([y, x]) => tileLabel(y, x));
  const graph = findDistances(input, nodes, nodeLocations);
  walk2(graph, tileLabel(...start), tileLabel(...end));
  return best2;
};
function findDistances(input, nodes, nodeLocations) {
  const graph = {};
  nodes.forEach(([y, x]) => {
    const visited = new Set();

    let q = [[y, x, 0]];
    while (q.length) {
      const [cy, cx, steps] = q.shift();
      if (visited.has(tileLabel(cy, cx))) continue;
      visited.add(tileLabel(cy, cx));
      if (steps > 0 && nodeLocations.includes(tileLabel(cy, cx))) {
        graph[tileLabel(y, x)] ??= {};
        graph[tileLabel(y, x)][tileLabel(cy, cx)] = steps;
        continue;
      }
      const neighbours = getNeighbours(input, [cy, cx]);
      neighbours.forEach((n) => q.push([...n, steps + 1]));
    }
  });
  return graph;
}
run({
  part1: {
    tests: [
      {
        input: `
        #.#####################
        #.......#########...###
        #######.#########.#.###
        ###.....#.>.>.###.#.###
        ###v#####.#v#.###.#.###
        ###.>...#.#.#.....#...#
        ###v###.#.#.#########.#
        ###...#.#.#.......#...#
        #####.#.#.#######.#.###
        #.....#.#.#.......#...#
        #.#####.#.#.#########v#
        #.#...#...#...###...>.#
        #.#.#v#######v###.###v#
        #...#.>.#...>.>.#.###.#
        #####v#.#.###v#.#.###.#
        #.....#...#...#.#.#...#
        #.#########.###.#.#.###
        #...###...#...#...#.###
        ###.###.#.###v#####v###
        #...#...#.#.>.>.#.>.###
        #.###.###.#.###.#.#v###
        #.....###...###...#...#
        #####################.#
        `,
        expected: 94,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        #.#####################
        #.......#########...###
        #######.#########.#.###
        ###.....#.>.>.###.#.###
        ###v#####.#v#.###.#.###
        ###.>...#.#.#.....#...#
        ###v###.#.#.#########.#
        ###...#.#.#.......#...#
        #####.#.#.#######.#.###
        #.....#.#.#.......#...#
        #.#####.#.#.#########v#
        #.#...#...#...###...>.#
        #.#.#v#######v###.###v#
        #...#.>.#...>.>.#.###.#
        #####v#.#.###v#.#.###.#
        #.....#...#...#.#.#...#
        #.#########.###.#.#.###
        #...###...#...#...#.###
        ###.###.#.###v#####v###
        #...#...#.#.>.>.#.>.###
        #.###.###.#.###.#.#v###
        #.....###...###...#...#
        #####################.#
        `,
        expected: 154,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
