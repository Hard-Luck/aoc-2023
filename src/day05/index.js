import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
function parseMappings(input) {
  const mapsData = input.split("\n\n");
  const formattedData = {};
  mapsData.forEach((map, index) => {
    if (index === 0) {
      const seeds = map.match(/\d+/g);
      formattedData["seeds"] = seeds;
    } else {
      const splitMappings = map.split("\n");
      const heading = splitMappings.shift().slice(0, -1);
      formattedData[heading] ??= [];
      splitMappings.forEach((line) => {
        const maps = line.match(/\d+/g);
        line && formattedData[heading].push(maps);
      });
      splitMappings;
      formattedData[heading].sort((a, b) => a[1] - b[1]);
    }
  });
  console.log(formattedData);
  return formattedData;
}
function mapsOnto(currentState, nextMap) {
  for (const [destination, source, range] of nextMap) {
    const difference = +currentState - +source;
    if (+difference < +range && difference >= 0)
      return +destination + difference;
  }
  return +currentState;
}
const part1 = (rawInput) => {
  const input = parseInput(rawInput);
  const mappings = parseMappings(input);
  const mapOrder = [
    "seed-to-soil map",
    "soil-to-fertilizer map",
    "fertilizer-to-water map",
    "water-to-light map",
    "light-to-temperature map",
    "temperature-to-humidity map",
    "humidity-to-location map",
  ];
  let lowest = Infinity;
  const seeds = mappings["seeds"];

  for (const seed of seeds) {
    let currentState = seed;
    for (const map of mapOrder) {
      currentState = mapsOnto(currentState, mappings[map]);
    }
    lowest = Math.min(currentState, lowest);
  }
  return lowest;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const mappings = parseMappings(input);
  const mapOrder = [
    "seed-to-soil map",
    "soil-to-fertilizer map",
    "fertilizer-to-water map",
    "water-to-light map",
    "light-to-temperature map",
    "temperature-to-humidity map",
    "humidity-to-location map",
  ];
  let lowest = Infinity;
  const seeds = mappings["seeds"].map(Number);
  const seedRanges = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push([seeds[i], seeds[i] + seeds[i + 1], 1]);
  }
  for (const pair of seedRanges) {
    const thisGo = [[...pair]];
    while (thisGo.length) {
      const [min, max, mapIndex] = thisGo.pop();
      const newRanges = [];
      for (const range of mappings[mapOrder[mapIndex]]) {
        const [_, sMin, sRange] = range.map(Number);
        console.log(sMin + sRange);
        if (min < sMin && max < sMin) {
          continue;
        } else if (min >= sMin && max < sMin + sRange) {
          newRanges.push([min, max, mapIndex]);
        } else if (min < sMin && max < sMin + sRange) {
          newRanges.push([sMin, max, mapIndex]);
        } else if (min < sMin && max > sMin + sRange) {
          newRanges.push([sMin, sMin + sRange, mapIndex]);
        }
        // both in range
        // just min in range
      }
      for (const range of newRanges) {
        const x = mapsOnto(range[0], mappings[mapOrder[range[2]]]);
        const y = mapsOnto(range[1], mappings[mapOrder[range[2]]]);
        if (range[2] === mapOrder.length) {
          lowest = Math.min(x, lowest);
          console.log({ lowest });
          break;
        } else {
          newRanges.push([x, y, mapIndex + 1]);
        }
      }
    }
  }
  return lowest;
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
      {
        input: `
        seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48

        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15

        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4

        water-to-light map:
        88 18 7
        18 25 70

        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13

        temperature-to-humidity map:
        0 69 1
        1 0 69

        humidity-to-location map:
        60 56 37
        56 93 4`,
        expected: 20,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
