import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
function draw(grid, [y, x]) {
  grid[y][x] = true;
}
function inBounds(grid, [y, x]) {
  return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length;
}
function walk(grid, mapped, { location, direction }) {
  const nextDirections = newDirection(grid, location, direction);
  const locations = [];
  for (const d of nextDirections) {
    const newLocation = [location[0] + d[0], location[1] + d[1]];
    const [y, x] = newLocation;
    if (!inBounds(grid, [y, x])) continue;
    draw(mapped, newLocation);
    locations.push({ location: newLocation, direction: d });
  }
  return locations;
}
function getFromLocation(grid, location) {
  const [y, x] = location;
  return grid[y][x];
}
function newDirection(grid, location, direction) {
  const tile = getFromLocation(grid, location);
  const [dy, dx] = direction;
  if (tile === "/") {
    return [[-dx, -dy]];
  }
  if (tile === "b") {
    return [[dx, dy]];
  }
  if (tile === "|" && dy === 0) {
    return [
      [1, 0],
      [-1, 0],
    ];
  }
  if (tile === "-" && dx === 0) {
    return [
      [0, 1],
      [0, -1],
    ];
  }
  return [[dy, dx]];
}

function mapJourney(grid, [sy, sx] = [0, 0], [dy, dx] = [0, 1]) {
  const seenWithApproach = {};
  const visited = grid.map((x) =>
    Array.from({ length: grid[0].length }).fill(false),
  );
  const currentLocations = [{ location: [sy, sx], direction: [dy, dx] }];
  visited[sy][sx] = true;
  while (currentLocations.length) {
    const { location, direction } = currentLocations.pop();
    const next = walk(grid, visited, { location, direction });
    next.forEach((x) => {
      const label = `${x.location}${x.direction}`;
      if (!seenWithApproach[label]) {
        currentLocations.push(x);
        seenWithApproach[label] = true;
      } else {
        seenWithApproach[label] = true;
      }
    });
  }
  return visited;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .replaceAll("\\", "b")
    .split("\n")
    .map((x) => x.split(""));
  const visited = mapJourney(input);
  //console.table(visited);
  return sumEnergised(visited);
};
function sumEnergised(grid) {
  return grid.reduce((a, c) => {
    return (
      a +
      c.reduce((b, d) => {
        return b + (d === true ? 1 : 0);
      }, 0)
    );
  }, 0);
}
const part2 = (rawInput) => {
  const input = parseInput(rawInput)
    .replaceAll("\\", "b")
    .split("\n")
    .map((x) => x.split(""));
  let best = 0;
  for (let i = 0; i < input[0].length; i++) {
    const visitedDown = mapJourney(input, [0, i], [1, 0]);
    const visitedUp = mapJourney(input, [input.length - 1, i], [-1, 0]);
    best = Math.max(sumEnergised(visitedUp), sumEnergised(visitedDown), best);
  }
  for (let j = 0; j < input.length; j++) {
    const visitedRight = mapJourney(input, [j, 0], [0, 1]);
    const visitedLeft = mapJourney(input, [j, input.length[0] - 1], [0, -1]);
    best = Math.max(
      sumEnergised(visitedRight),
      sumEnergised(visitedLeft),
      best,
    );
  }
  //console.table(visited);
  return best;
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
  onlyTests: false,
});
