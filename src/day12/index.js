import run from "aocrunner";
const totalCache = {};
const canPlaceCache = {};
function addToTotalCache(string, orders, total) {
  totalCache[string] ??= {};
  totalCache[string][orders] ??= {};
  totalCache[string][orders] = total;
}
function getCachedTotal(string, orders) {
  const total = totalCache?.[string]?.[orders];
  if (total !== undefined) {
    //console.count("hit");
    return total;
  }
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
  return withLetters.reduce((a, x) => a + getTotal(x[0], x[1]), 0);
};

function canPlace(hashTags, string) {
  const label = JSON.stringify(`${hashTags}${string.slice(0, hashTags + 1)}`);
  if (hashTags > string.length) return false;
  if (string[hashTags] === "#") return false;
  for (let i = 0; i < hashTags; i++) {
    if (!(string[i] === "#" || string[i] === "p")) return false;
  }
  canPlaceCache[label] = true;
  return true;
}

function getTotal(string, orders) {
  const cached = getCachedTotal(string, orders);
  if (cached !== undefined) return cached;
  const tagsRemaining = orders.reduce((a, b) => a + b);
  if (countRemainingTags(string) > tagsRemaining) return 0;
  let total = 0;
  let numOfHashTags = orders[0];
  if (!string.length) return 0;
  if (0 === orders.length - 1) {
    for (let i = 0; i < string.length; i++) {
      if (canPlace(numOfHashTags, string.slice(i))) {
        if (!countRemainingTags(string.slice(i + numOfHashTags))) {
          total++;
        }
      }
      if (string[i] === "#") {
        addToTotalCache(string, orders, total);
        return total;
      }
    }
  } else {
    if (canPlace(numOfHashTags, string)) {
      total += getTotal(string.slice(numOfHashTags + 1), orders.slice(1));
    }
    let i = 1;
    if (string[0] === "#") return total;
    total += getTotal(string.slice(i), orders);
  }
  addToTotalCache(string, orders, total);
  return total;
}

function countRemainingTags(string) {
  return string.match(/#/g)?.length ?? 0;
}
function formatInput([x, y]) {
  const a = [];
  const b = [];
  for (let i = 0; i < 5; i++) {
    a.push(x);
    b.push(...y.split(","));
  }
  return [a.join("?"), b];
}
const part2 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(" "));
  const fiveX = input.map(formatInput);
  const withLetters = fiveX.map((x) => {
    return [x[0].replace(/\./g, "-").replace(/\?/g, "p"), x[1].map((x) => +x)];
  });
  let total = 0;
  withLetters.sort((a, b) => a[0].length - b[0].length);

  return withLetters.reduce((a, x) => a + getTotal(x[0], x[1]), 0);
};

run({
  part1: {
    tests: [
      {
        input: `.##.?#??.#.?# 2,1,1,1`,
        expected: 1,
      },
      {
        input: `###.### 3`,
        expected: 0,
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
        input: `.??..??...?##. 1,1,3`,
        expected: 4,
      },
      {
        input: `?#?#?#?#?#?#?#? 1,3,1,6`,
        expected: 1,
      },
      {
        input: `????.######..#####. 1,6,5`,
        expected: 4,
      },
      {
        input: `?###???????? 3,2,1`,
        expected: 10,
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
        input: `???#??.??????.??#.. 4,3`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `???.### 1,1,3`,
        expected: 1,
      },
      {
        input: `.??..??...?##. 1,1,3`,
        expected: 16384,
      },
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
    ], //
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
