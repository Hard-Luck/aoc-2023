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
    let previousDirection;
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

function handleBoundariesAndNeighbours(map) {
  for (let i = 0; i < map[0].length; i++) {
    excludeWithNeighbours([0, i], map);
  }
  for (let i = 0; i < map.length; i++) {
    excludeWithNeighbours([i, 0], map);
  }
  for (let i = 0; i < map[0].length; i++) {
    excludeWithNeighbours([map.length - 1, i], map);
  }
  for (let i = 0; i < map[0].length; i++) {
    excludeWithNeighbours([i, [map[0].length - 1]], map);
  }
}
function getNeighbours(current, map) {
  const neighbours = allDirections.map((point) => {
    const coords = sumCoords(point, current);
    return coords;
  });
  const extraFromPipes = [];
  neighbours.forEach((point) => {
    if (getValueFromMap(point, map) === true) {
      const verticalPipeEnds = checkForVerticalPipe(point, map);
      const horizontalPipeEnds = checkForHorizontalPipe(point, map);
      extraFromPipes.push(...verticalPipeEnds);
      extraFromPipes.push(...horizontalPipeEnds);
      const diagonalPipes = checkForDiagonalPipes(point, map);
      extraFromPipes.push(...diagonalPipes);
    }
  });
  if (extraFromPipes.length) neighbours.push(...extraFromPipes);
  return neighbours;
}
function checkForVerticalPipe([y, x], map) {
  const found = [];
  const up = [y - 1, x];
  const rightUp = [y - 1, x + 1];
  const rightDown = [y + 1, x - 1];
  const leftUp = [y - 1, x - 1];
  const down = [y + 1, x];
  if (
    ["J", "7"].includes(getValueFromMap(up, map)) &&
    ["F", "L"].includes(getValueFromMap(rightUp, map))
  ) {
    up[0]--;
    rightUp[0]--;
    let leftFlag = false;
    let rightFlag = false;
    while (inBounds(up, map)) {
      if (rightFlag && leftFlag) {
        break;
      }
      if (!["|", "7", "J"].includes(getValueFromMap(up, map))) {
        if (getValueFromMap(up, map) === true && !leftFlag) {
          found.push(up);
        }
        leftFlag = true;
      } else {
        up[0]--;
      }
      if (!["|", "F", "L"].includes(getValueFromMap(up, map) && !rightFlag)) {
        if (getValueFromMap(rightUp, map) === true) {
          found.push(rightUp);
        }
        rightFlag = true;
      } else {
        rightUp[0]--;
      }
    }
  }
  if (
    ["J", "7"].includes(getValueFromMap(up, map)) &&
    ["F", "L"].includes(getValueFromMap(rightUp, map))
  ) {
    down[0]++;
    rightDown[0]++;
    let leftFlag = false;
    let rightFlag = false;
    while (inBounds(down, map)) {
      if (rightFlag && leftFlag) {
        break;
      }
      if (!["|", "J", "7"].includes(getValueFromMap(down, map))) {
        if (getValueFromMap(down, map) === true && !leftFlag) {
          found.push(down);
        }
        leftFlag = true;
      } else {
        down[0]++;
      }
      if (!["|", "F", "L"].includes(getValueFromMap(down, map))) {
        if (getValueFromMap(rightDown, map) === true && !rightFlag) {
          found.push(rightDown);
        }
        rightFlag = true;
      } else {
        rightDown[0]++;
      }
    }
  }
  if (
    ["J", "7"].includes(getValueFromMap(up, map)) &&
    ["F", "L"].includes(getValueFromMap(rightUp, map))
  ) {
    up[0]--;
    leftUp[0]--;
    let leftFlag = false;
    let upFlag = false;
    while (inBounds(leftUp, map)) {
      if (rightFlag && upFlag) {
        break;
      }
      if (!["|", "J", "7"].includes(getValueFromMap(leftUp, map))) {
        if (getValueFromMap(leftUp, map) === true && !leftFlag) {
          found.push(up);
        }
        leftFlag = true;
      } else {
        up[0]--;
      }
      if (!["|", "F", "L"].includes(getValueFromMap(up, map))) {
        if (getValueFromMap(up, map) === true && !rightFlag) {
          found.push(up);
        }
        upFlag = true;
      } else {
        leftUp[0]--;
      }
    }
  }
  return found;
}
function checkForHorizontalPipe([y, x], map) {
  const found = [];
  const right = [y, x + 1];
  const rightDown = [y + 1, x + 1];
  const left = [y, x - 1];
  const leftDown = [y + 1, x - 1];
  if (
    ["J", "L"].includes(getValueFromMap(right, map)) &&
    ["7", "F"].includes(getValueFromMap(rightDown, map))
  ) {
    right[1]++;
    rightDown[1]++;
    let upFlag = false;
    let downFlag = false;
    while (inBounds(right, map)) {
      if (downFlag && upFlag) {
        break;
      }
      if (!["-", "L", "J"].includes(getValueFromMap(right, map))) {
        if (getValueFromMap(right, map) === true && !upFlag) {
          found.push(right);
        }
        upFlag = true;
      } else {
        right[1]++;
      }
      if (!["-", "F", "7"].includes(getValueFromMap(rightDown, map))) {
        if (getValueFromMap(rightDown, map) === true && !downFlag) {
          found.push(rightDown);
        }
        downFlag = true;
      } else {
        rightDown[1]++;
      }
    }
  }
  if (
    ["J", "L"].includes(getValueFromMap(left, map)) &&
    ["7", "F"].includes(getValueFromMap(leftDown, map))
  ) {
    left[1]--;
    leftDown[1]--;
    let upFlag = false;
    let downFlag = false;
    while (inBounds(left, map)) {
      if (downFlag && upFlag) {
        break;
      }
      if (!["-", "L", "J"].includes(getValueFromMap(left, map))) {
        if (getValueFromMap(left, map) === true && !upFlag) {
          found.push(left);
        }
        upFlag = true;
      } else {
        left[1]--;
      }
      if (!["-", "F", "7"].includes(getValueFromMap(leftDown, map))) {
        if (getValueFromMap(leftDown, map) === true && !downFlag) {
          found.push(leftDown);
        }
        downFlag = true;
      } else {
        leftDown[1]--;
      }
    }
  }
  return found;
}
function checkForDiagonalPipes([y, x], map) {
  const found = [];
  const right = [y, x + 1];
  const left = [y, x - 1];
  const up = [y - 1, x];
  const down = [y + 1, x];
  if (getValueFromMap(right, map) === "F" && getValueFromMap(up, map) === "J") {
    found.push([y - 1, x + 1]);
  }
  if (getValueFromMap(left, map) === "7" && getValueFromMap(up, map) === "L") {
    found.push([y - 1, x - 1]);
  }
  if (
    getValueFromMap(right, map) === "L" &&
    getValueFromMap(down, map) === "7"
  ) {
    found.push([y + 1, x + 1]);
  }
  if (
    getValueFromMap(left, map) === "J" &&
    getValueFromMap(down, map) === "F"
  ) {
    found.push([y + 1, x - 1]);
  }
  return found;
}
function excludeWithNeighbours(point, map, processed = new Set()) {
  const neighbours = getNeighbours(point, map)
    .filter(([y, x]) => inBounds([y, x], map))
    .filter(([y, x]) => getValueFromMap([y, x], map) === true)
    .filter(([y, x]) => !processed.has(`${y},${x}`));

  while (neighbours.length) {
    const current = neighbours.pop();
    const key = `${current[0]},${current[1]}`;
    processed.add(key);
    map[current[0]][current[1]] = false;

    getNeighbours(current, map)
      .filter(([y, x]) => inBounds([y, x], map))
      .filter(([y, x]) => getValueFromMap([y, x], map) === true)
      .filter(([y, x]) => !processed.has(`${y},${x}`))
      .forEach((neighbour) => {
        if (!processed.has(`${neighbour[0]},${neighbour[1]}`)) {
          neighbours.push(neighbour);
        }
      });
  }
}
function totalEnclosed(map) {
  let total = 0;
  for (const row of map) {
    for (const x of row) {
      if (x === true) {
        total++;
      }
    }
  }
  return total;
}
const validCorner = [
  ["L", "J"],
  ["F", "7"],
];
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
