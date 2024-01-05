import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
function checkCollision([[x1, y1], [x2, y2]], [[x3, y3], [x4, y4]]) {
  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      if ((x - x3) * (x - x4) <= 0 && (y - y3) * (y - y4) <= 0) {
        return true;
      }
    }
  }
  return false;
}
function getMinZ(brick) {
  return brick[0][2];
}
function getMaxZ(brick) {
  return brick[1][2];
}
function reduceZ(brick, dif) {
  brick[0][2] -= dif;
  brick[1][2] -= dif;
}
function preSettle(bricks) {
  for (let i = 0; i < bricks.length - 1; i++) {
    const bottom = bricks[i];
    const top = bricks[i + 1];
    if (getMinZ(top) > getMaxZ(bottom)) {
      const dif = top[0][2] - bottom[1][2] - 1;
      reduceZ(top, dif);
    }
  }
}

function findNextLevel(currentBrick, bricks) {
  const currentZ = getMinZ(currentBrick);
  const potentialCollisions = bricks.filter((x) => x[1][2] === currentZ - 1);
  return potentialCollisions;
}
function validateAndPassBricks(bricks) {
  main: for (let i = 0; i < bricks.length; i++) {
    const current = bricks[i];
    const currentZ = getMinZ(current);
    if (currentZ === 1) continue;
    while (getMinZ(current) > 1) {
      const allLevelBelow = findNextLevel(current, bricks);
      if (allLevelBelow.every((x) => !checkCollision(current, x))) {
        reduceZ(current, 1);
      } else {
        continue main;
      }
    }
  }
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split("~"))
    .map(([a, b]) => {
      return [a.split(",").map(Number), b.split(",").map(Number)];
    })
    .sort((a, b) => {
      return a[0][2] - b[0][2];
    });
  preSettle(input);
  validateAndPassBricks(input);
  const supporting = {};
  for (const brick of input) {
    getBricksTouchingBelow(brick, input, supporting);
  }
  const singleSupporters = new Set();
  for (const key in supporting) {
    if (supporting[key].size === 1) {
      singleSupporters.add([...supporting[key]][0]);
    }
  }
  return input.length - singleSupporters.size;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split("~"))
    .map(([a, b]) => {
      return [a.split(",").map(Number), b.split(",").map(Number)];
    })
    .sort((a, b) => {
      return a[0][2] - b[0][2];
    });
  preSettle(input);
  validateAndPassBricks(input);
  const below = {};
  const above = {};
  for (const brick of input) {
    getBricksTouchingBelow(brick, input, below);
    getBricksTouchingAbove(brick, input, above);
  }
  let total = 0;
  for (const brick of input) {
    if (!above[JSON.stringify(brick)]?.size) continue;
    total += countBricksChainReaction(brick, above, below);
  }
  return total;
};
function getBricksTouchingAbove(brick, bricks, touchingAbove) {
  if (getMinZ(brick) === bricks.length - 1) return new Set();
  const levelAbove = allLevelAbove(brick, bricks);
  levelAbove.forEach((x) => {
    if (checkCollision(brick, x)) {
      touchingAbove[JSON.stringify(brick)] ??= new Set();
      touchingAbove[JSON.stringify(brick)].add(JSON.stringify(x));
    }
  });
}
function getBricksTouchingBelow(brick, bricks, touchingBelow) {
  if (getMinZ(brick) === 1) new Set();
  const allLevelBelow = findNextLevel(brick, bricks);
  const set = new Set();
  allLevelBelow.forEach((x) => {
    if (checkCollision(brick, x)) {
      set.add(JSON.stringify(x));
    }
  });
  touchingBelow[JSON.stringify(brick)] = set;
}
function allLevelAbove(brick, bricks) {
  const currentZ = getMaxZ(brick);
  const potentiallySupported = bricks.filter((x) => x[0][2] === currentZ + 1);
  return potentiallySupported;
}
let i = 0;
function countBricksChainReaction(brick, above, below) {
  let q = [JSON.stringify(brick)];
  i++;
  const destroyed = new Set();
  while (q.length) {
    const current = q.shift();
    if (destroyed.has(current)) continue;
    destroyed.add(current);
    const bricksAbove = above[current];

    for (const brick of bricksAbove ? [...bricksAbove] : []) {
      const belowBrick = below[brick];
      if ([...belowBrick].every((x) => destroyed.has(x))) {
        q.push(brick);
      }
    }
  }
  return destroyed.size - 1;
}

//NOTES FOR TOMORROW
/**
 * Properly get and lable bricks under and above
 * Add all currently disintergrated bricks to a set
 * if all supports are in the disintergrated set push that brick
 */
run({
  part1: {
    tests: [
      // {
      //   input: `
      //    1,1,8~1,1,9,7
      //    0,2,3~2,2,3,3
      //    0,0,2~2,0,2,2
      //    1,0,1~1,2,1,1
      //    0,0,4~0,2,4,4
      //    0,1,6~2,1,6,6
      //    2,0,5~2,2,5,5
      //     `,
      //   expected: 5,
      // },
      // {
      //   input: `
      //   0,0,1~0,1,1,1
      //   1,1,1~1,1,1,2
      //   0,0,2~0,0,2,3
      //   0,1,2~1,1,2,4
      //    `,
      //   expected: 3,
      // },
      // {
      //   input: `
      //   0,0,1~1,0,1
      //   0,1,1~0,1,2
      //   0,0,5~0,0,5
      //   0,0,4~0,1,4
      //    `,
      //   expected: 2,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        1,0,1~1,2,1,1
        0,0,2~2,0,2,2
        0,2,3~2,2,3,3
        0,0,4~0,2,4,4
        2,0,5~2,2,5,5
        0,1,6~2,1,6,6
        1,1,8~1,1,9,7
          `,
        expected: 7,
      },
      {
        input: `
        0,0,2~0,0,4
        1,0,3~2,0,3
        1,0,4~1,0,5
        0,0,6~1,0,6
        `,
        expected: 1,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
