import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
function getGridSize(instructions) {
  let height = { max: 0, min: 0 };
  let width = { max: 0, min: 0 };
  let currentHeight = 0;
  let currentWidth = 0;
  instructions.forEach(([d, v]) => {
    if (d === "R") currentWidth += v;
    if (d === "L") currentWidth -= v;
    if (d === "U") currentHeight += v;
    if (d === "D") currentHeight -= v;
    height.max = Math.max(currentHeight, height.max);
    height.min = Math.min(currentHeight, height.min);
    width.max = Math.max(currentWidth, width.max);
    width.min = Math.min(currentWidth, width.min);
  });
  return { height, width };
}
function getRevisedGridSize(instructions) {
  let height = { max: 0, min: 0 };
  let width = { max: 0, min: 0 };
  let currentHeight = 0;
  let currentWidth = 0;
  instructions.forEach(([d, _, hex]) => {
    console.log(hex);
    const v = parseInt(hex.slice(2, -2), 16);
    if (hex[hex.length - 2] === "0") currentWidth += v;
    if (hex[hex.length - 2] === "1") currentWidth -= v;
    if (hex[hex.length - 2] === "2") currentHeight += v;
    if (hex[hex.length - 2] === "3") currentHeight -= v;
    height.max = Math.max(currentHeight, height.max);
    height.min = Math.min(currentHeight, height.min);
    width.max = Math.max(currentWidth, width.max);
    width.min = Math.min(currentWidth, width.min);
  });
  return { height, width };
}
function getNeighbours([y, x], grid) {
  const n = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      if (!inBounds(grid, y + j, x + i)) continue;
      if (grid[y][x] === ".") n.push([y + j, x + i]);
    }
  }
  return n;
}
function inBounds(grid, y, x) {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
}
function floodFill(grid, point, fill = false) {
  const neighbours = [point];
  while (neighbours.length) {
    const [y, x] = neighbours.pop();
    const n = getNeighbours([y, x], grid);
    n.length && neighbours.push(...n);
    grid[y][x] = grid[y][x] === true ? true : fill;
  }
}
function fillFromOutside(grid) {
  for (let y = 0; y < grid.length; y++) {
    floodFill(grid, [y, 0]);
    floodFill(grid, [y, grid[0].length - 1]);
  }
  for (let x = 0; x < grid[0].length; x++) {
    floodFill(grid, [0, x]);
    floodFill(grid, [grid.length - 1, x]);
  }
}
const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(" "))
    .map(([a, b, c]) => [a, +b, c]);
  //console.table(input);
  const { height, width } = getGridSize(input);
  //console.log({ height, width });
  const grid = Array.from({ length: height.max - height.min + 1 }, (_) => {
    return Array.from({ length: width.max - width.min + 1 }, () => {
      return ".";
    });
  });
  let currentLocation = [-height.min, -width.min];
  const visited = [];
  input.forEach(([d, v]) => {
    for (let i = 0; i < v; i++) {
      if (d === "R") currentLocation[1] += 1;
      if (d === "L") currentLocation[1] -= 1;
      if (d === "U") currentLocation[0] += 1;
      if (d === "D") currentLocation[0] -= 1;
      visited.push([...currentLocation]);
    }
  });
  //console.table(visited);
  visited.forEach(([y, x]) => {
    grid[y][x] = true;
  });
  fillFromOutside(grid);
  //console.table(grid.reverse());
  return grid.reduce((a, c) => {
    return (
      a +
      c.reduce((x, y) => {
        return x + (y === false ? 0 : 1);
      }, 0)
    );
  }, 0);
};

const part2 = (rawInput) => {
  let counter = { false: 0 };
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(" "))
    .map(([_, __, c]) => c);
  //console.table(input);
  const { height, width } = getRevisedGridSize(input);
  const di = {
    0: "R",
    1: "D",
    2: "L",
    3: "U",
  };
  let total = 0;
  let currentLocation = [-height.min, -width.min];
  const vertexes = [[-height.min, -width.min]];
  console.log("here");
  input.forEach((a) => {
    const v = parseInt(a.slice(2, -2), 16);
    const directionIndex = a[a.length - 2];
    const d = di[directionIndex];
    total += v;
    console.log({ d, v });
    if (d === "R") currentLocation[1] -= v;
    if (d === "L") currentLocation[1] += v;
    if (d === "U") currentLocation[0] += v;
    if (d === "D") currentLocation[0] -= v;
    vertexes.push([...currentLocation]);
  });
  //console.table(visited);
  console.log(vertexes);
  //console.table(grid.reverse());
  return 1 + shoelace(vertexes) + total / 2;
};
function shoelace(vertexes) {
  let left = 0;
  let right = 0;
  for (let i = 0; i < vertexes.length - 1; i++) {
    const [x1, y1] = vertexes[i];
    const [x2, y2] = vertexes[i + 1];
    const leftAddition = x1 * y2;
    const rightAddition = x2 * y1;
    left += leftAddition;
    right += rightAddition;
  }
  const [x1, y1] = vertexes.at(-1);
  const [x2, y2] = vertexes.at(0);
  const leftAddition = x1 * y2;
  const rightAddition = x2 * y1;
  left += leftAddition;
  right += rightAddition;
  return Math.abs(left - right) / 2;
}
run({
  part1: {
    tests: [
      {
        input: `
          R 6 (#70c710)
          D 5 (#0dc571)
          L 2 (#5713f0)
          D 2 (#d2c081)
          R 2 (#59c680)
          D 2 (#411b91)
          L 5 (#8ceee2)
          U 2 (#caa173)
          L 1 (#1b58a2)
          U 2 (#caa171)
          R 2 (#7807d2)
          U 3 (#a77fa3)
          L 2 (#015232)
          U 2 (#7a21e3)
      `,
        expected: 62,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          R 6 (#70c710)
          D 5 (#0dc571)
          L 2 (#5713f0)
          D 2 (#d2c081)
          R 2 (#59c680)
          D 2 (#411b91)
          L 5 (#8ceee2)
          U 2 (#caa173)
          L 1 (#1b58a2)
          U 2 (#caa171)
          R 2 (#7807d2)
          U 3 (#a77fa3)
          L 2 (#015232)
          U 2 (#7a21e3)
      `,
        expected: 952408144115,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
