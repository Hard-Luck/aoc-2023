import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

function lengthen(grid) {
  const newGrid = [];
  for (const row of grid) {
    if (row.every((x) => x === ".")) {
      newGrid.push(row);
    }
    newGrid.push(row);
  }
  return newGrid;
}
function getStretchColumns(grid) {
  const stretchColumns = [];
  for (let i = 0; i < grid[0].length; i++) {
    let good = true;
    for (const row of grid) {
      if (row[i] !== ".") {
        good = false;
      }
    }
    if (good) {
      stretchColumns.push(i);
    }
  }
  return stretchColumns;
}
function getStretchRows(grid) {
  return grid
    .map((x, i) => {
      return x.every((x) => x === ".") ? i : -1;
    })
    .filter((x) => x !== -1);
}
function stretch(grid) {
  const stretchColumns = getStretchColumns(grid);
  const newGrid = [];
  for (let i = 0; i < grid.length; i++) {
    newGrid.push([]);
  }
  for (let i = 0; i < grid[0].length; i++) {
    for (let j = 0; j < grid.length; j++) {
      newGrid[j].push(grid[j][i]);
      if (stretchColumns.includes(i)) {
        newGrid[j].push(".");
      }
    }
  }
  return newGrid;
}
function expandGalaxy(grid) {
  const lengthened = lengthen(grid);
  const stretched = stretch(lengthened);
  return stretched;
}
function getGalaxyLocations(grid) {
  const galaxies = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "#") {
        galaxies.push([i, j]);
      }
    }
  }
  return galaxies;
}
function calculateDistance([a, b], [x, y]) {
  return Math.abs(a - x) + Math.abs(b - y);
}
const part1 = (rawInput) => {
  let total = 0;
  const grid = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(""));
  const expanded = expandGalaxy(grid);
  const galaxies = getGalaxyLocations(expanded);
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = 0; j < galaxies.length; j++) {
      if (i === j) continue;
      total += calculateDistance(galaxies[i], galaxies[j]);
    }
  }
  return total / 2;
};
function passesThrough([a, b], [c, d], rows, cols) {
  let total = 0;
  for (let i = Math.min(a, c); i < Math.max(a, c); i++) {
    if (rows.includes(i)) total++;
  }
  for (let j = Math.min(b, d); j < Math.max(b, d); j++) {
    if (cols.includes(j)) total++;
  }
  return total;
}
function calculateMegaDistance([a, b], [x, y], rows, cols, multiplier = 1) {
  const additional = passesThrough([a, b], [x, y], rows, cols);
  const toAdd = additional * multiplier;
  return Math.abs(a - x) + Math.abs(b - y) + toAdd;
}
const part2 = (rawInput) => {
  let total = 0;
  const grid = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(""));
  const cols = getStretchColumns(grid);
  const rows = getStretchRows(grid);
  console.log(rows, cols);
  const galaxies = getGalaxyLocations(grid);
  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      if (i === j) continue;
      total += calculateMegaDistance(
        galaxies[i],
        galaxies[j],
        rows,
        cols,
        999999,
      );
    }
  }
  return total;
};

run({
  part1: {
    tests: [
      {
        input: `
       ...#......
       .......#..
       #.........
       ..........
       ......#...
       .#........
       .........#
       ..........
       .......#..
       #...#.....
       `,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
       ...#......
       .......#..
       #.........
       ..........
       ......#...
       .#........
       .........#
       ..........
       .......#..
       #...#.....
       `,
        expected: 8410,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
