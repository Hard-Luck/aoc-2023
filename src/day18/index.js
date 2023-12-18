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
    console.log({ y, x });
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
  console.table(input);
  const { height, width } = getGridSize(input);
  console.log({ height, width });
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
  console.table(visited);
  visited.forEach(([y, x]) => {
    grid[y][x] = true;
  });
  fillFromOutside(grid);
  console.table(grid.reverse());
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
  const input = parseInput(rawInput);

  return;
};

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
