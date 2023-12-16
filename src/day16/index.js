import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
function handleForwardSlash([y, x]) {
  return [[-x, -y]];
}
function handleBackSlash([y, x]) {
  return [[x, y]];
}
function handleHorizontal([y, x]) {
  if (y === 0) return [[y, x]];
  return [
    [-1, 0],
    [1, 0],
  ];
}
function handleVertical([y, x]) {
  if (x === 0) return [[y, x]];
  return [
    [0, 1],
    [0, -1],
  ];
}
const moves = {
  b: handleBackSlash,
  "/": handleForwardSlash,
  "-": handleHorizontal,
  "|": handleVertical,
};

function draw(grid, location) {
  console.log(location);
  const [y, x] = location;
  if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) return;
  grid[y][x] = true;
}
function walk(grid, mapped, location, direction) {
  const nextDirection = newDirection(grid, location, direction);
  for (const d of nextDirection) {
    const newLocation = [location[0] + d[0], location[1] + d[1]];
    draw(mapped, newLocation);
    const [y, x] = newLocation;
    console.log({ newLocation, d });
    if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) return;
    walk(grid, mapped, newLocation, d);
  }
  return mapped;
}
function newDirection(grid, [b, a], [dy, dx]) {
  if (grid[b]?.[a] in moves) {
    return moves[grid[b][a]]([dy, dx]);
  }
  return [[dy, dx]];
}

function mapJourney(grid) {
  const visited = grid.map((x) =>
    Array.from({ length: grid[0].length }).fill(false),
  );
  walk(grid, visited, [0, 0], [0, 1]);
  return visited;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .replaceAll("\\", "b")
    .split("\n")
    .map((x) => x.split(""));
  const visited = mapJourney(input);
  console.table(visited);
  return visited.reduce((a, c) => {
    return (
      a +
      c.reduce((b, d) => {
        return b + (d === true ? 1 : 0);
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
       .|...\\....
       |.-.\\.....
       .....|-...
       ........|.
       ..........
       .........\\
       ..../.\\\\..
       .-.-/..|..
       .|....-|.\\
       ..//.|....
       `,
        expected: 46,
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
  onlyTests: true,
});
