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
function cacheTotal(string, orders, total) {
  totalCache[string] ??= {};
  totalCache[string][JSON.stringify(orders)] = total;
}
function getCachedTotal(string, orders) {
  const total = totalCache[string]?.[JSON.stringify(orders)];
  if (total) {
    console.log({ total, string });
    return totalCache[string][JSON.stringify(orders)];
  }
  return null;
}

// function getCachedCombination(hashTags, string) {
//   if (cacheCombination?.[hashTags]?.[string]) {
//     console.count("combinations");

//     return cacheCombination?.[hashTags]?.[string];
//   }
//   return null;
// }
function getCachedCanPlace(hashTags, string) {
  if (cacheCanPlace?.[hashTags]?.[string]) {
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
console.log(canPlace(1, "p#"));

function canPlace(hashTags, string) {
  const cached = getCachedCanPlace(hashTags, string);
  if (cached) return cached;
  if (hashTags > string.length) return false;
  if (string[hashTags] === "#") return false;
  for (let i = 0; i < hashTags; i++) {
    if (!(string[i] === "#")) {
      cacheCanPlace(hashTags, string, false);
      return false;
    }
  }
  cacheCanPlace(hashTags, string, true);
  return true;
}

function getTotal(string, orders) {
  if (getCachedTotal(string, orders)) {
    return getCachedTotal(string, orders);
  }
  const tagsToPlace = orders.reduce((a, b) => a + b, 0);
  if (string.length < tagsToPlace) {
    return 0;
  }
  if (countRemainingTags(string) > tagsToPlace) {
    return 0;
  }
  if (orders.length === 0) {
    if (countRemainingTags(string) === 0) {
      console.log(string, "plus 1");
      return 1;
    }
    return 0;
  }
  let total = 0;

  if (canPlace(orders[0], string)) {
    if (orders.length === 1 && string[0] === "#") {
      console.log({ string, orders });
      return 1;
    }
    console.log({ string, orders, canPlace: true });

    total += getTotal(string.slice(1), orders.slice(1));
  }
  total += getTotal(string.slice(1), orders.slice());
  cacheTotal(string, orders, total);
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
      //
      //{
      //  input: `
      //  ???.### 1,1,3
      //  .??..??...?##. 1,1,3
      //  ?#?#?#?#?#?#?#? 1,3,1,6
      //  ????.#...#... 4,1,1
      //  ????.######..#####. 1,6,5
      //  ?###???????? 3,2,1
      //`,
      //  expected: 21,
      //},
      //{
      //  input: `?#?#?#?#?#?#?#? 1,3,1,6`,
      //  expected: 1,
      //},
      //{
      //  input: `###.### 3`,
      //  expected: 0,
      //},
      //{
      //  input: `.##.?#??.#.?# 2,1,1,1`,
      //  expected: 1,
      //},
      //
      //{
      //  input: `?.? 1,1`,
      //  expected: 1,
      //},
      {
        input: `#?#?#??? 1,1,1`,
        expected: 1,
      },
      //{
      //  input: `???.### 1,1,3`,
      //  expected: 1,
      //},
      //{
      //  input: `?###???????? 3,2,1`,
      //  expected: 10,
      //},
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
  onlyTests: true,
});

function regexMaker(num) {
  const pattern = `^[^#]*[p#]{${num}}[^#]*$`;
  return new RegExp(pattern);
}
