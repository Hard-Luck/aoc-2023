import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput).split("\n\n");
  const instructions = input[0];
  const directions = parseDirections(input[1].split("\n"));
  let location = "AAA";
  let steps = 0;
  const lr = {
    L: 0,
    R: 1,
  };
  while (location !== "ZZZ") {
    for (const instruction of instructions) {
      steps++;
      location = directions[location][lr[instruction]];
      if (location === "ZZZ") return steps;
    }
  }
  return;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput).split("\n\n");
  const instructions = input[0];
  const directions = parseDirections(input[1].split("\n"));
  let locations = Object.keys(directions).filter((x) => x.endsWith("A"));
  const lr = {
    L: 0,
    R: 1,
  };
  const timesToZ = locations.reduce((times, curr) => {
    times[curr] = [];
    return times;
  }, {});
  const fullLoop = instructions.length;
  for (const start of locations) {
    let currentLocation = start;
    let steps = 0;
    let endOfLoopValues = [];
    outer: while (true) {
      for (const instruction of instructions) {
        ++steps;
        currentLocation = directions[currentLocation][lr[instruction]];
        if (
          steps % fullLoop === 0 &&
          endOfLoopValues.includes(currentLocation)
        ) {
          break outer;
        }
        if (steps % fullLoop === 0) endOfLoopValues.push(currentLocation);
        if (currentLocation.endsWith("Z")) timesToZ[start].push(steps);
      }
    }
  }
  const times = Object.values(timesToZ);
  const loops = times.sort((a, b) => b.length - a.length)[0].length;
  let best = times.reduce((a, c) => lcm(a, c[0]), times[0][0]);
  for (const a of times[0]) {
    console.count(`: out of ${loops}`);
    console.log("current best: ", best);
    for (const b of times[1]) {
      let currentb = lcm(a, b);
      if (currentb >= best) continue;
      for (const c of times[2]) {
        let currentc = lcm(currentb, c);
        if (currentc >= best) continue;
        for (const d of times[3]) {
          let currentd = lcm(currentc, d);
          if (currentd >= best) continue;
          for (const e of times[4]) {
            let currente = lcm(currentd, e);
            if (currente >= best) continue;
            for (const f of times[5]) {
              let currentf = lcm(currente, f);
              best = Math.min(currentf, best);
            }
          }
        }
      }
    }
  }
  console.log(best);
  return best;
  f;
};
function parseDirections(mappings) {
  return mappings.reduce((map, line) => {
    const [location, destinations] = line.split(" = ");
    map[location] = destinations.replace(/[() ]/g, "").split(",");
    return map;
  }, {});
}
function gcd(a, b) {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}
function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

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
