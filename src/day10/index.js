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
const part1 = (rawInput) => {};
//   const input = parseInput(rawInput);
//   const map = into2DArray(input);
//   const start = findStartCoords(map);
//   let loopSteps;
//   outer: for (const d in directionalCoords) {
//     let steps = 0;
//     let location = [...start];
//     let direction = directionalCoords[d];
//     while (true) {
//       steps++;
//       const step = walk(location, direction, map);
//       if (step === -1) break;
//       location = step[0];
//       direction = step[1];
//       if (location[0] === start[0] && location[1] === start[1]) {
//         loopSteps = steps;
//         break outer;
//       }
//     }
//   }
//   return loopSteps / 2;
// };

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
function walk(location, direction, map, startD, endD) {
  if (!checkInBounds(location, direction, map)) return -1;
  const [y, x] = direction;
  const newLocation = [location[0] + y, location[1] + x];
  const [newI, newJ] = newLocation;
  const newPosition = map[newI][newJ];
  let newDirection =
    getValueFromMap(newLocation, map) === "S" && endD
      ? moveThroughS(startD, endD, direction)
      : turn(newPosition, direction);
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
function turn(nextPath, direction) {
  if (["7", "L"].includes(nextPath)) {
    return [direction[1], direction[0]];
  }
  if (["J", "F"].includes(nextPath)) {
    return [-direction[1], -direction[0]].map((x) => {
      return x === -0 ? 0 : x;
    });
  }
  return direction;
}
function changeOutsideDirection(nextPath, move) {
  if (nextPath === "F") {
    return [move[1], move[0]];
  }
  if (nextPath === "L") {
    return [-move[1], -move[0]].map((x) => {
      return x === -0 ? 0 : x;
    });
  }
  if (nextPath === "J") {
    return [move[1], move[0]];
  }
  if (nextPath === "7") {
    return [-move[1], -move[0]].map((x) => {
      return x === -0 ? 0 : x;
    });
  }
  return move;
}
const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const map = into2DArray(input);
  const start = findStartCoords(map);
  let startD = "";
  let endD = "";
  const mapOfLoop = map.map((x) => Array.from({ length: x.length }).fill(true));
  outer: for (const d in directionalCoords) {
    startD = directionalCoords[d];
    let steps = 0;
    let location = [...start];
    let direction = directionalCoords[d];
    const visited = [];
    while (true) {
      steps++;
      const step = walk(location, direction, map, startD);
      if (step === -1) break;
      location = step[0];
      direction = step[1];
      const isCorner = !["|", "-"].includes(getValueFromMap(location, map));
      visited.push({ location, isCorner });
      if (location[0] === start[0] && location[1] === start[1]) {
        visited.forEach(({ location }) => {
          updatePosition(location, mapOfLoop, getValueFromMap(location, map));
        });
        console.log(direction, "direction");
        endD = direction;
        break outer;
      }
    }
  }
  for (let i = 0; i < mapOfLoop[0].length; i++) {
    clearNeighbours([0, i], mapOfLoop);
    clearNeighbours([map.length - 1, i], mapOfLoop);
  }
  for (let j = 0; j < mapOfLoop.length; j++) {
    clearNeighbours([j, 0], mapOfLoop);
    clearNeighbours([j, mapOfLoop[0].length - 1], mapOfLoop);
  }
  let firstDash = [];
  bigFor: for (let i = 0; i < mapOfLoop.length; i++) {
    for (let j = 0; j < mapOfLoop[0].length; j++) {
      if (mapOfLoop[i][j] === "-") {
        firstDash = [i, j];
        break bigFor;
      }
    }
  }
  console.log(startD, endD);
  let direction = [0, 1];
  let outSideDirection = [-1, 0];
  let location = [...firstDash];
  do {
    const pointOutside = [
      location[0] + outSideDirection[0],
      location[1] + outSideDirection[1],
    ];

    const step = walk(location, direction, mapOfLoop, startD, endD);
    location = step[0];
    clearNeighbours(pointOutside, mapOfLoop);
    outSideDirection = changeOutsideDirection(
      getValueFromMap(location, mapOfLoop),
      outSideDirection,
    );
    console.log({
      location,
      direction,
      outSideDirection,
      firstDash,
      value: getValueFromMap(location),
    });
  } while (!(location[0] !== firstDash[0] && location[1] !== firstDash[1]));

  console.table(mapOfLoop);
  return totalEnclosed(mapOfLoop);
};
function exclude(point, map) {
  if (getValueFromMap(point, map) !== "X") {
    updatePosition(point, map, false);
  }
}
function moveThroughS(startD, endD, direction) {
  console.log(startD, endD, "move through a");
  if (direction[0] === endD[0] && direction[1] === endD[1]) {
    return startD;
  }
  if (direction[0] === -startD[0] && direction[1] === -startD[1]) {
    return [-endD[0], -endD[1]];
  }
  console.log("Shouldnt be here");
}
function clearNeighbours(point, map) {
  if (getValueFromMap(point, map) === true) {
    exclude(point, map);
    const neighbours = getNeighbours(point, map);
    while (neighbours.length) {
      const neighbour = neighbours.pop();
      neighbours.push(...getNeighbours(neighbour, map));
      exclude(neighbour, map);
    }
  }
}
function updatePosition(point, map, value) {
  map[point[0]][point[1]] = value;
}
function getValueFromMap(point, map) {
  try {
    return map[point[0]][point[1]];
  } catch (error) {
    console.log(point);
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
        if (getValueFromMap([newY, newX], map) === true) {
          neighbours.push([newY, newX]);
        }
      }
    }
  }
  return neighbours;
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
      {
        input: `
        FF7FSF7F7F7F7F7F---7
        L|LJ||||||||||||F--J
        FL-7LJLJ||||||LJL-77
        F--JF--7||LJLJIF7FJ-
        L---JF-JLJIIIIFJLJJ7
        |F|F-JF---7IIIL7L|7|
        |FFJF7L7F-JF7IIL---7
        7-L-JL7||F7|L7F-7F7|
        L.L7LFJ|||||FJL7||LJ
        L7JLJL-JLJLJL--JLJ.L
         `,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
