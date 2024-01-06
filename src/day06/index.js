import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const races = parseInput(rawInput).split("\n");
  const times = races[0].match(/\d+/g).map(Number);
  const distances = races[1].match(/\d+/g).map(Number);
  let multiplier = 1;
  for (let i = 0; i < times.length; i++) {
    let winning = 0;
    for (let j = 0; j < times[i]; j++) {
      if ((times[i] - j) * j > distances[i]) winning++;
    }
    multiplier *= winning;
  }
  return multiplier;
};

const part2 = (rawInput) => {
  const races = parseInput(rawInput).split("\n");
  const time = +races[0].match(/\d+/g).join("");
  const distance = +races[1].match(/\d+/g).join("");
  let winning = 0;
  for (let j = 0; j < time; j++) {
    if ((time - j) * j > distance) winning++;
  }
  return winning;
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
