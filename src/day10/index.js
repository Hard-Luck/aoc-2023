import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
const legalMoves = {
  "0,1": ["-", "7", "J"], //E
  "0,-1": ["-", "F", "L"], //W
  "-1,0": ["|", "F", "7"], //S
  "1,0": ["|", "J", "L"], //N
};
const allDirections = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
const directionalCoords = {
  S: [-1, 0],
  N: [1, 0],
  E: [0, 1],
  W: [0, -1],
};
function sumCoords([a, b], [c, d]) {
  return [a + c, b + d];
}
function getValueFromMap([y, x], map) {
  try {
    return map[y][x];
  } catch (error) {}
}
function walk(position, direction, map) {
  const newPosition = sumCoords(position, direction);
  const tileAtNew = getValueFromMap(newPosition, map);
  if (!inBounds(newPosition, map)) {
    return -1;
  }
  if (!checkLegalStep(direction, tileAtNew)) {
    return -1;
  }
  return newPosition;
}
function inBounds([y, x], map) {
  return x >= 0 && x < map[0].length && y >= 0 && y < map.length;
}
function checkLegalStep([y, x], tile) {
  const directionKey = `${y},${x}`;
  return legalMoves[directionKey].includes(tile);
}
function turn(direction, tileValue) {
  if (["7", "L"].includes(tileValue)) {
    return [direction[1], direction[0]];
  }
  if (["J", "F"].includes(tileValue)) {
    return [-direction[1], -direction[0]].map((x) => {
      return x === -0 ? 0 : x;
    });
  }
  return direction;
}
function drawLoopOnEmptyGrid(map) {
  const blankGrid = map.map((x) => Array.from({ length: x.length }).fill(true));
  const startingCoords = findStartCoords(map);
  let startingDirection;
  for (const d in directionalCoords) {
    // initial direction
    let currentDirection = [...directionalCoords[d]];
    let currentPosition = [...startingCoords];
    let flag = true;
    // loop
    do {
      previousDirection = [...currentDirection];
      currentPosition = walk(currentPosition, currentDirection, map);
      if (currentPosition === -1) {
        break;
      }
      currentDirection = turn(
        currentDirection,
        getValueFromMap(currentPosition, map),
      );
      const tile = getValueFromMap(currentPosition, map);
      const [y, x] = currentPosition;
      blankGrid[y][x] = tile;
      if (
        currentPosition[0] === startingCoords[0] &&
        currentPosition[1] === startingCoords[1]
      ) {
        startingDirection = [...directionalCoords[d]];
        flag = false;
      }
    } while (flag);
    if (!flag) break;
  }
  // HARDCODEY
  function replaceS() {
    blankGrid[startingCoords[0]][startingCoords[1]] = "7";
  }
  replaceS();
  return blankGrid;
}
function findStartCoords(map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "S") return [i, j];
    }
  }
}

function scanLines(map) {
  let total = 0;
  let inBounds = false;
  let corner = null;
  for (let i = 0; i < map.length; i++) {
    inBounds = false;
    corner = null;
    for (let j = 0; j < map[0].length; j++) {
      const tile = map[i][j];
      if (tile === "|") {
        inBounds = !inBounds;
      } else if (["L", "F"].includes(tile)) {
        corner = tile;
      } else if (tile === "7") {
        if (corner === "L") {
          inBounds = !inBounds;
          corner = null;
        }
        if (corner === "F") {
          corner = null;
        }
      } else if (tile === "J") {
        if (corner === "L") {
          corner = null;
        }
        if (corner === "F") {
          inBounds = !inBounds;
          corner = null;
        }
      } else if (tile === true && inBounds) {
        total++;
      }
    }
  }
  return total;
}
const part1 = () => {};
const part2 = (rawInput) => {
  const grid = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(""));
  const loopMap = drawLoopOnEmptyGrid(grid);
  console.table(loopMap);
  const start = findStartCoords(grid);
  console.log(
    scanLines([
      "|.|L---J..F---7|.|L7.F-J...|...|"
        .split("")
        .map((x) => (x === "." ? true : x)),
    ]),
  );
  return scanLines(loopMap);
};

run({
  part1: {
    tests: [
      {
        input: `..F7.\n.FJ|.\nSJ.L7\n|F--J\nLJ...`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ...........
        .S-------7.
        .|F-----7|.
        .||OOOOO||.
        .||OOOOO||.
        .|L-7OF-J|.
        .|II|O|II|.
        .L--JOL--J.
        .....O.....
        `,
        expected: 4,
      },
      {
        input: `
      ..........
      .S------7.
      .|F----7|.
      .||OOOO||.
      .||OOOO||.
      .|L-7F-J|.
      .|II||II|.
      .L--JL--J.
      ..........
      `,
        expected: 4,
      },
      {
        input: `
        FF7FSF7F7F7F7F7F---7
        L|LJ||||||||||||F--J
        FL-7LJLJ||||||LJL-77
        F--JF--7||LJLJ7F7FJ-
        L---JF-JLJ.||-FJLJJ7
        |F|F-JF---7F7-L7L|7|
        |FFJF7L7F-JF7|JL---7
        7-L-JL7||F7|L7F-7F7|
        L.L7LFJ|||||FJL7||LJ
        L7JLJL-JLJLJL--JLJ.L
        `,
        expected: 10,
      },
      {
        input: `
        .F----7F7F7F7F-7....
        .|F--7||||||||FJ....
        .||.FJ||||||||L7....
        FJL7L7LJLJ||LJ.L-7..
        L--J.L7...LJS7F-7L7.
        ....F-J..F7FJ|L7L7L7
        ....L7.F7||L7|.L7L7|
        .....|FJLJ|FJ|F7|.LJ
        ....FJL-7.||.||||...
        ....L---J.LJ.LJLJ...
        `,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

let i = 1;
do {
  console.log(i);
} while (i < 1);
