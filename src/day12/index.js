import run from "aocrunner";

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
  console.log(getTotal("#pp#p#pp#", [1, 1, 1]), "total");
  //console.table(withLetters.filter((x) => [...x].every((y) => y)));
  return withLetters.reduce((a, x) => a + getTotal(x[0], x[1]), 0);
};
function canPlace(hashTags, string) {
  if (hashTags > string.length) return false;
  if (string[hashTags] === "#") return false;
  for (let i = 0; i < hashTags; i++) {
    if (!(string[i] === "#" || string[i] === "p")) return false;
  }
  return true;
}
function getTotal(string, orders, position = 0) {
  if (!string) return 0;
  const finalCall = orders.length - 1 === position;
  const hashTags = orders[position];

  let total = 0;
  if (!hashTags) throw new Error("out of bounds");
  if (finalCall) {
    for (let i = 0; i < string.length; i++) {
      if (string[i - 1] === "#") continue;
      if (canPlace(hashTags, string.slice(i))) {
        console.log(
          {
            i,
            string,
            orders,
            position,
            can: canPlace(hashTags, string.slice(i)),
          },
          "++total",
        );
        total++;
      }
    }
  } else {
    for (let i = 0; i < string.length - orders.slice(position).length; i++) {
      if (canPlace(hashTags, string.slice(i))) {
        if (string[i - 1] === "#") continue;
        let extra = 0;
        while (string[i + hashTags - 1] !== "#") extra++;
        total += getTotal(
          string.slice(i + hashTags + 1 + extra),
          orders,
          position + 1,
        );
      }
    }
  }
  return total;
}
function generateValidRegEx(nums) {
  console.log(nums);
  const pattern = nums.reduce((pattern, num) => {
    for (let i = 0; i < num; i++) {
      pattern += "#";
    }
    return pattern + `-*`;
  }, `-*`);
  return new RegExp(pattern);
}
const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `#p#p#ppp 1,2,1`,
        expected: 1,
      },
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
  onlyTests: true,
});
