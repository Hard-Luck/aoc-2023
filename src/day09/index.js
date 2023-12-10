import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const readings = parseInput(rawInput)
    .split("\n")
    .map((x) => [x.split(" ").map((y) => +y)]);
  readings.forEach((reading) => {
    extendReadingToZeros(reading);
    extrapolateReading(reading);
  });

  const total = sumPredictions(readings);

  return total;
};

const part2 = (rawInput) => {
  const readings = parseInput(rawInput)
    .split("\n")
    .map((x) => [x.split(" ").map((y) => +y)]);

  readings.forEach((reading) => {
    reading.at(0).reverse();
    extendReadingToZeros(reading);
    extrapolateReading(reading);
  });

  const total = sumPredictions(readings);

  return total;
};
function checkForAllZeros(line) {
  return line.every((x) => x === 0);
}
function extendReadingToZeros(reading) {
  do {
    reading.unshift(calculateNextLine(reading));
  } while (!checkForAllZeros(reading.at(0)));
}
function calculateNextLine(reading, part = 1) {
  const newLine = [];
  for (let i = 0; i < reading.at(0).length - 1; i++) {
    const left = reading.at(0).at(i);
    const right = reading.at(0).at(i + 1);
    if (part === 1) {
      newLine.push(right - left);
    } else {
      newLine.push(left - right);
    }
  }
  return newLine;
}
function extrapolateReading(reading) {
  reading.at(0).push(0);
  for (let i = 1; i < reading.length; i++) {
    const row = reading.at(i);
    const endOfPreviousRow = reading.at(i - 1).at(-1);
    const endOfCurrentRow = row.at(-1);
    const difference = endOfCurrentRow + endOfPreviousRow;
    row.push(difference);
  }
}
function sumPredictions(readings) {
  return readings.reduce((total, reading) => {
    return reading.at(-1).at(-1) + total;
  }, 0);
}

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15\n1 3 6 10 15 21\n10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15\n1 3 6 10 15 21\n10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
