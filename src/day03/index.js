import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
function getGearLocations(input) {
  const locations = [];
  input.forEach((line, y) => {
    [...line].forEach((symbol, x) => {
      if (input[y][x] === "*") {
        locations.push(`${y},${x}`);
      }
    });
  });
  return locations;
}
function getAdjacent(x, y, input) {
  const neighbours = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newX = x + i;
      const newY = y + j;
      if (i === 0 && j === 0) continue;
      if (
        newX >= 0 &&
        newY >= 0 &&
        newX < input[0].length &&
        newY < input.length
      ) {
        neighbours.push([newX, newY]);
      }
    }
  }
  return neighbours;
}
function hasSymbolAdjacent(x, y, input) {
  const neighbours = getAdjacent(x, y, input);
  for (let i = 0; i < neighbours.length; i++) {
    const [xToCheck, yToCheck] = neighbours[i];
    if (input[yToCheck][xToCheck].match(/[^\d\.]/)) {
      return true;
    }
  }
  return false;
}
function getMatches(string) {
  return string.matchAll(/\d+/g);
}
function hasGearAdjacent(x, y, input, gearLocations) {
  const neighbours = getAdjacent(x, y, input);
  for (let i = 0; i < neighbours.length; i++) {
    const [xToCheck, yToCheck] = neighbours[i];
    if (gearLocations.includes(`${yToCheck},${xToCheck}`)) {
      return `${xToCheck},${yToCheck}`;
    }
  }
  return false;
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput).split("\n");
  let total = 0;
  input.forEach((line, y) => {
    const numbers = matchNumberWithIndex(line);
    numbers.forEach(({ number, index: x }) => {
      for (let i = 0; i < number.length; i++) {
        if (hasSymbolAdjacent(x + i, y, input)) {
          total += +number;
          break;
        }
      }
    });
  });
  return total;
};
function matchNumberWithIndex(string) {
  const matchMetaData = [];
  const matches = string.matchAll(/\d+/g);
  let match = matches.next();
  while (match.value) {
    let index = match.value.index;
    matchMetaData.push({ index, number: match.value[0] });
    match = matches.next();
  }
  return matchMetaData;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput).split("\n");
  const gearLocations = getGearLocations(input);

  let gearCombinations = {};
  let total = 0;
  input.forEach((line, y) => {
    const numbers = matchNumberWithIndex(line);
    numbers.forEach(({ number, index: x }) => {
      for (let i = 0; i < number.length; i++) {
        const gearLocation = hasGearAdjacent(x + i, y, input, gearLocations);
        if (gearLocation) {
          gearCombinations[gearLocation] ??= [];
          gearCombinations[gearLocation].push(number);
          break;
        }
      }
    });
  });
  for (const key in gearCombinations) {
    const parts = gearCombinations[key];
    if (parts.length === 2) {
      total += parts[0] * parts[1];
    }
  }
  return total;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
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
