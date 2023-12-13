import run from "aocrunner";
const totalCache = {};
const canPlaceCache = {};
const combinationsCache = {};
function cacheCombination(string, hashTags, total) {
  combinationsCache[string] ??= {};
  combinationsCache[string][hashTags] = total;
}
function cacheCanPlace(hashTags, string, total) {
  canPlaceCache[string] ??= {};
  canPlaceCache[string][hashTags] = total;
}
function getCachedCombination(hashTags, string) {
  if (cacheCombination?.[hashTags]?.[string]) {
    console.count("combinations");

    return cacheCombination?.[hashTags]?.[string];
  }
  return null;
}
function getCachedCanPlace(hashTags, string) {
  if (cacheCanPlace?.[hashTags]?.[string]) {
    console.count("canPlace");

    return cacheCanPlace?.[hashTags]?.[string];
  }
  return null;
}
const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(" "));
  const withLetters = input.map((x) => {
    return [
      x[0].replace(/\./g, "-").replace(/\?/g, "p"),
      x[1].split(",").map(Number),
    ];
  });
  //console.log(getTotal("???#??.??????.??#..", [4, 3]));
  return withLetters.reduce((a, x) => a + getTotal(x[0], x[1]), 0);
};
function fiveTimes(input) {
  let instructions = input[0];
  const orders = [...input[1]];
  for (let i = 0; i < 4; i++) {
    instructions += `p${input[0]}`;
    orders.push(...input[1]);
  }
  return [instructions, orders];
}

function canPlace(hashTags, string) {
  const cached = getCachedCanPlace(hashTags, string);
  if (cached) return cached;
  if (hashTags > string.length) return false;
  if (string[hashTags] === "#") return false;
  for (let i = 0; i < hashTags; i++) {
    if (!(string[i] === "#" || string[i] === "p")) {
      cacheCanPlace(hashTags, string, false);
      return false;
    }
  }
  cacheCanPlace(hashTags, string, true);
  return true;
}

function combinations(hashTags, string) {
  const cached = getCachedCombination(hashTags, string);
  if (cached) return cached;
  let total = 0;
  for (let i = 0; i <= string.length - hashTags; i++) {
    if (canPlace(hashTags, string.slice(i, hashTags + i + 1))) {
      if (!countRemainingTags(string.slice(i + hashTags))) {
        total++;
      }
      if (string[hashTags + i - 1] === "#") break;
    }
  }
  cacheCombination(string, hashTags, total);
  return total;
}
function getTotal(string, orders, position = 0) {
  const label = `${string.slice(0, orders[position] + 1)}${JSON.stringify(
    orders[position],
  )}}`;
  if (totalCache[label]) return totalCache[label];
  if (!string.length) return 0;
  let hashTags = orders[position];
  const indexOfDot = string.indexOf(".");
  if (indexOfDot !== -1 && indexOfDot < hashTags) {
    return getTotal(string.slice(indexOfDot + 1), orders, position);
  }
  const tagsRemaining = orders.reduce((a, b) => a + b);
  if (countRemainingTags(string) > tagsRemaining) {
    return 0;
  }
  let total = 0;
  // if i can place it check the substring for next hit (has to be at least 1 gap)
  if (position === orders.length - 1) {
    total += combinations(hashTags, string);
    //console.log({ string, orders, position, total });
  } else {
    //console.log({ string, orders, position, total });
    if (canPlace(hashTags, string)) {
      total += getTotal(string.slice(hashTags + 1), orders, position + 1);
    }
    let i = 1;
    if (string[0] === "#") {
      return total;
    }
    total += getTotal(string.slice(i), orders, position);
  }
  return total;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(" "));

  return;
};

function countRemainingTags(string) {
  return string.match(/#/g)?.length ?? 0;
}
run({
  part1: {
    tests: [
      {
        input: `???#??.??????.??#.. 4,3`,
        expected: 3,
      },
      {
        input: `????.######..#####. 1,6,5`,
        expected: 4,
      },
      {
        input: `.??..??...?##. 1,1,3`,
        expected: 4,
      },

      {
        input: `
        ???.### 1,1,3
        .??..??...?##. 1,1,3
        ?#?#?#?#?#?#?#? 1,3,1,6
        ????.#...#... 4,1,1
        ????.######..#####. 1,6,5
        ?###???????? 3,2,1
      `,
        expected: 21,
      },
      {
        input: `?#?#?#?#?#?#?#? 1,3,1,6`,
        expected: 1,
      },
      {
        input: `###.### 3`,
        expected: 0,
      },
      {
        input: `.##.?#??.#.?# 2,1,1,1`,
        expected: 1,
      },

      {
        input: `?.? 1,1`,
        expected: 1,
      },
      {
        input: `#?#?#??? 1,1,1`,
        expected: 1,
      },
      {
        input: `???.### 1,1,3`,
        expected: 1,
      },
      {
        input: `?###???????? 3,2,1`,
        expected: 10,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      //{
      //  input: `???.### 1,1,3`,
      //  expected: 1,
      //},
      //{
      //  input: `.??..??...?##. 1,1,3`,
      //  expected: 16384,
      //},
      //{
      //  input: `
      //  ???.### 1,1,3
      //  .??..??...?##. 1,1,3
      //  ?#?#?#?#?#?#?#? 1,3,1,6
      //  ????.#...#... 4,1,1
      //  ????.######..#####. 1,6,5
      //  ?###???????? 3,2,1
      //  `,
      //  expected: 525152,
      //},
      //{
      //  input: `#.?#.#???????...??## 1,2,2,1,1,4`,
      //  expected: 0,
      //},
      //{
      //  input: `???#???.?#?????? 1,2,2,3,2`,
      //  expected: 0,
      //},
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

function regexMaker(num) {
  const pattern = `^[^#]*[p#]{${num}}[^#]*$`;
  return new RegExp(pattern);
}
