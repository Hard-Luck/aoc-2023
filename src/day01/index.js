import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput).split("\n");
  return input.reduce((acc, line) => {
    const digits = line.match(/\d/g);
    return acc + +(digits.at(0) + digits.at(-1));
  }, 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput).split("\n");
  return input.reduce((acc, line) => {
    const digits = [
      ...line.matchAll(
        /(?=(one|two|three|four|five|six|seven|eight|nine|[1-9]))/g,
      ),
    ];
    const map = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
    };
    const first = digits[0]?.[1];
    const last = digits.at(-1)?.[1];
    if (!(first && last)) return acc;
    return acc + +`${map[first] ?? first}${map[last] ?? last}`;
  }, 0);
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
