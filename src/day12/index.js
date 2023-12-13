import run from "aocrunner";
const totalCache = {};
const canPlaceCache = {};
function addToTotalCache(string, orders, total) {
  totalCache[string] ??= {};
  total[string][orders] = total;
}
function getFromTotalCache(string, orders) {
  return totalCache[string]?.[orders];
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

function getTotal(string, orders, position = 0) {
  const tagsRemaining = orders.reduce((a, b) => a + b);
  if (countRemainingTags(string) > tagsRemaining) return 0;
  let total = 0;
  let numOfHashTags = orders[position];
  if (!string.length) return 0;
  // if i can place it check the substring for next hit (has to be at least 1 gap)
  if (position === orders.length - 1) {
    //console.log(string);
    for (let i = 0; i < string.length; i++) {
      if (canPlace(numOfHashTags, string.slice(i))) {
        if (!countRemainingTags(string.slice(i + numOfHashTags))) {
          total++;
        }
      }
      if (string[i] === "#") {
        //console.log("bug");
        return total;
      }
    }
  } else {
    if (canPlace(numOfHashTags, string)) {
      total += getTotal(string.slice(numOfHashTags + 1), orders, position + 1);
    }
    let i = 1;
    if (string[0] === "#") return total;
    total += getTotal(string.slice(i), orders, position);
  }
  return total;
  // if not try next place
}

function countRemainingTags(string) {
  return string.match(/#/g)?.length ?? 0;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(" "));
  return;
};

run({
  part1: {
    tests: [
      //{
      //  input: `.##.?#??.#.?# 2,1,1,1`,
      //  expected: 1,
      //},
      //{
      //  input: `###.### 3`,
      //  expected: 0,
      //},
      //{
      //  input: `?.? 1,1`,
      //  expected: 1,
      //},
      //{
      //  input: `#?#?#??? 1,1,1`,
      //  expected: 1,
      //},
      //{
      //  input: `???.### 1,1,3`,
      //  expected: 1,
      //},
      //{
      //  input: `.??..??...?##. 1,1,3`,
      //  expected: 4,
      //},
      //{
      //  input: `?#?#?#?#?#?#?#? 1,3,1,6`,
      //  expected: 1,
      //},
      //{
      //  input: `????.######..#####. 1,6,5`,
      //  expected: 4,
      //},
      //{
      //  input: `?###???????? 3,2,1`,
      //  expected: 10,
      //},
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
      //  input: `???#??.??????.??#.. 4,3`,
      // expected: 3,
      //},
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
      {
        input: `
        ???.### 1,1,3
        .??..??...?##. 1,1,3
        ?#?#?#?#?#?#?#? 1,3,1,6
        ????.#...#... 4,1,1
        ????.######..#####. 1,6,5
        ?###???????? 3,2,1
        `,
        expected: 525152,
      },
      {
        input: `#.?#.#???????...??## 1,2,2,1,1,4`,
        expected: 0,
      },
      {
        input: `???#???.?#?????? 1,2,2,3,2`,
        expected: 0,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
