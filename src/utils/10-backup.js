import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const directionalCoords = {
  S: [-1, 0],
  N: [1, 0],
  E: [0, 1],
  W: [0, -1],
};
const legalMoves = {
  "0,1": ["-", "7", "J", "S"], //E
  "0,-1": ["-", "F", "L", "S"], //W
  "-1,0": ["|", "F", "7", "S"], //S
  "1,0": ["|", "J", "L", "S"], //N
};
const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const map = into2DArray(input);
  const start = findStartCoords(map);
  let loopSteps;
  outer: for (const d in directionalCoords) {
    let steps = 0;
    let location = [...start];
    let direction = directionalCoords[d];
    while (true) {
      steps++;
      const step = walk(location, direction, map);
      if (step === -1) break;
      location = step[0];
      direction = step[1];
      if (location[0] === start[0] && location[1] === start[1]) {
        loopSteps = steps;
        break outer;
      }
    }
  }
  return loopSteps / 2;
};

function into2DArray(input) {
  return input.split("\n").map((x) => x.split(""));
}
function findStartCoords(map) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "S") return [i, j];
    }
  }
}
function walk(location, direction, map) {
  if (!checkInBounds(location, direction, map)) return -1;
  const [y, x] = direction;
  const newLocation = [location[0] + y, location[1] + x];
  const [newI, newJ] = newLocation;
  const newPosition = map[newI][newJ];
  let newDirection = turn(newPosition, direction);
  if (!checkEndOfLoop(direction, newPosition)) return -1;
  return [newLocation, newDirection, newPosition];
}
function checkEndOfLoop(direction, next, location) {
  const directionKey = `${direction[0]},${direction[1]}`;
  return legalMoves[directionKey].includes(next);
}
function checkInBounds(location, move, map) {
  const [y, x] = location;
  const [dy, dx] = move;
  if (y + dy < 0 || y + dy > map.length) return false;
  if (x + dx < 0 || x + dx > map[0].length) return false;
  return true;
}
function turn(nextPath, move) {
  if (["7", "L"].includes(nextPath)) {
    return [move[1], move[0]];
  }
  if (["J", "F"].includes(nextPath)) {
    return [-move[1], -move[0]];
  }
  return move;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const map = into2DArray(input);
  const start = findStartCoords(map);
  const mapOfLoop = map.map((x) => Array.from({ length: x.length }).fill(true));
  outer: for (const d in directionalCoords) {
    let steps = 0;
    let location = [...start];
    let direction = directionalCoords[d];
    const visited = [];
    while (true) {
      steps++;
      const step = walk(location, direction, map);
      if (step === -1) break;
      location = step[0];
      direction = step[1];
      const isCorner = !["|", "-"].includes(getValueFromMap(location, map));
      visited.push({ location, isCorner });
      if (location[0] === start[0] && location[1] === start[1]) {
        visited.forEach(({ location, isCorner }) => {
          updatePosition(
            location,
            mapOfLoop,
            isCorner ? "C" : getValueFromMap(location, map),
          );
        });
        break outer;
      }
    }
  }
  console.table(mapOfLoop);
  for (let i = 0; i < mapOfLoop.length; i++) {
    clearNeighbours([0, i], mapOfLoop);
    clearNeighbours([map.length - 1, i], mapOfLoop);
  }
  for (let j = 0; j < mapOfLoop.length; j++) {
    clearNeighbours([j, 0], mapOfLoop);
    clearNeighbours([j, mapOfLoop[0].length - 1], mapOfLoop);
  }
  console.table(mapOfLoop);
  return totalEnclosed(mapOfLoop);
};
function exclude(point, map) {
  if (getValueFromMap(point, map) !== "X") {
    updatePosition(point, map, false);
  }
}
function clearNeighbours(point, map) {
  if (getValueFromMap(point, map) !== true) {
    return;
  }
  exclude(point, map);
  const neighbours = getNeighbours(point, map);
  neighbours.forEach((p) => {
    clearNeighbours(p, map);
  });
}
function updatePosition(point, map, value) {
  map[point[0]][point[1]] = value;
}
function getValueFromMap(point, map) {
  try {
    return map[point[0]][point[1]];
  } catch (error) {
    console.log(point);
    console.error(map);
    throw error;
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
function getNeighbours([y, x], map) {
  const neighbours = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newX = x + i;
      const newY = y + j;
      if (i === 0 && j === 0) continue;
      if (newX >= 0 && newY >= 0 && newX < map[0].length && newY < map.length) {
        if (i === 0 && x + 1 < map[0].length) {
          const points = slideVerticalPipe([newY, x], [newY, x + 1], map, j);
          if (points.length) {
            neighbours.push(...points);
          }
        }
        if (j === 0 && y + 1 < map.length) {
          const points = slideHorizontalPipe([y, newX], [y, newX], map, i);
          if (points.length) {
            neighbours.push(...points);
          }
        }
        neighbours.push([newY, newX]);
      }
    }
  }
  return neighbours;
}
function slideVerticalPipe(point1, point2, map, yDirection) {
  const toCheck = [];
  if (
    getValueFromMap(point1, map) === "C" &&
    getValueFromMap(point2, map) === "C"
  ) {
    let currentY1 = point1[0] + yDirection;
    let currentPoint = [currentY1, point1[1]];
    if (currentY1 >= map.length - 1 || currentY1 <= 0) return toCheck;
    do {
      currentY1 += yDirection;
      currentPoint = [currentY1, point1[1]];
      if (currentY1 >= map.length - 1 || currentY1 <= 0) return toCheck;
    } while (getValueFromMap(currentPoint, map) === "|");
    currentY1 += yDirection;
    if (getValueFromMap([currentY1, point1[1]], map) !== "C") {
      toCheck.push([currentY1, point1[1]]);
    }
    let currentY2 = point2[0] + yDirection;
    let currentPoint2 = [currentY2, point2[1]];
    if (currentY2 >= map.length - 1 || currentY2 <= 0) return toCheck;
    do {
      currentY2 += yDirection;
      currentPoint2 = [currentY2, point2[1]];
      if (currentY2 >= map.length - 1 || currentY2 <= 0) return toCheck;
    } while (getValueFromMap(currentPoint2, map) === "|");
    currentY2 += yDirection;
    if (getValueFromMap([currentY2, point2[1]], map) !== "C") {
      toCheck.push([currentY2, point2[1]]);
    }
  }
  return toCheck;
}
function slideHorizontalPipe(point1, point2, map, xDirection) {
  const toCheck = [];
  if (
    getValueFromMap(point1, map) === "C" &&
    getValueFromMap(point2, map) === "C"
  ) {
    let currentX1 = point1[1] + xDirection;
    let currentPoint = [point1[0], currentX1];
    if (currentX1 >= map.length - 1 || currentX1 <= 0) return toCheck;
    do {
      currentX1 += xDirection;
      currentPoint = [point1[0], currentX1];
      if (currentX1 >= map.length - 1 || currentX1 <= 0) return toCheck;
    } while (getValueFromMap(currentPoint, map) === "-");
    currentX1 += xDirection;
    if (getValueFromMap([point1[0], currentX1], map) !== "C") {
      toCheck.push([point1[0], currentX1]);
    }
    let currentX2 = point2[1] + xDirection;
    let currentPoint2 = [point2[0], currentX2];
    if (currentX2 >= map.length - 1 || currentX2 <= 0) return toCheck;
    do {
      currentX2 += xDirection;
      currentPoint2 = [point2[0], currentX2];
      if (currentX2 >= map.length - 1 || currentX2 <= 0) return toCheck;
    } while (getValueFromMap(currentPoint2, map) === "-");
    currentX2 += xDirection;
    if (getValueFromMap([point2[1], currentX2], map) !== "C") {
      toCheck.push([point2[1], currentX2]);
    }
  }
  return toCheck;
}
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
  onlyTests: true,
});
