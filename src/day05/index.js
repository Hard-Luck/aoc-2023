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
  const seeds = mappings["seeds"].map(Number);
  let seedRanges = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push([seeds[i], seeds[i] + seeds[i + 1], 1]);
  }
  const ranges = mapOrder.map((x) => mappings[x].map((y) => y.map(Number)));
  for (const range of ranges) {
    range.sort((a, b) => {
      return a[1] + b[1];
    });
  }
  for (const x of ranges) {
    const newSeeds = [];
    while (seedRanges.length) {
      let matched = false;
      const [min, max] = seedRanges.pop();
      for (const [a, b, c] of x) {
        if (min < b + c) {
          const newMin = Math.max(min, b);
          const newMax = Math.min(max, b + c);
          if (max < b + c) {
            newSeeds.push([newMin - b + a, a + newMax - b]);
          } else {
            newSeeds.push([newMin - b + a, a + c]);
            seedRanges.push([b + c, max]);
          }
          matched = true;
          break;
        }
      }
      if (!matched) {
        newSeeds.push([min, max]);
      }
    }
    seedRanges = newSeeds;
  }
  seedRanges.sort((a, b) => a[0] - b[0]);
  console.log(seedRanges);
  return seedRanges[0][0];
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
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
