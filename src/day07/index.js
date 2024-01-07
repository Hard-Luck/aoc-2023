import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
const cardWeights = {
  noPair: [1, 1, 1, 1, 1],
  pair: [2, 1, 1, 1],
  twoPair: [2, 2, 1],
  threeOfAKind: [3, 1, 1],
  fullHouse: [3, 2],
  fourOfAKind: [4, 1],
  fiveOfAKind: [5],
};
const order = [
  "noPair",
  "pair",
  "twoPair",
  "threeOfAKind",
  "fullHouse",
  "fourOfAKind",
  "fiveOfAKind",
];

function sortFromValues(a, b, cardStrengths) {
  const handA = a[0];
  const handB = b[0];
  for (let i = 0; i < handA.length; i++) {
    if (handA[i] !== handB[i]) {
      return cardStrengths[handA[i]] - cardStrengths[handB[i]];
    }
  }
  return 0;
}
const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(" "));
  const hands = {
    noPair: [],
    pair: [],
    twoPair: [],
    threeOfAKind: [],
    fullHouse: [],
    fourOfAKind: [],
    fiveOfAKind: [],
  };
  const cardStrengths = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
  };

  function getHandLabel(hand) {
    if (hand[0] === "JJJJJ") {
      hands["fiveOfAKind"].push(hand);
      return;
    }
    const letters = {};
    for (const letter of hand[0]) {
      letters[letter] ??= 0;
      letters[letter]++;
    }
    const values = Object.values(letters).sort((a, b) => b - a);
    for (const weight in cardWeights) {
      const expected = cardWeights[weight];
      if (expected.every((a, i) => a === values[i])) {
        hands[weight].push(hand);
      }
    }
  }
  input.forEach((hand) => {
    getHandLabel(hand);
  });
  for (const key in hands) {
    const collection = hands[key];
    collection.sort((a, b) => sortFromValues(a, b, cardStrengths));
  }
  let final = [];
  for (const key of order) {
    final = [...final, ...hands[key]];
  }
  return final.reduce((acc, curr, i) => {
    return acc + +curr[1] * (i + 1);
  }, 0);
};

function getHandLabelWithJacksWild(hand, hands) {
  if (hand[0] === "JJJJJ") {
    hands["fiveOfAKind"].push(hand);
    return;
  }
  const letters = {};
  for (const letter of hand[0]) {
    letters[letter] ??= 0;
    letters[letter]++;
  }
  const js = letters["J"];
  delete letters["J"];
  const values = Object.values(letters).sort((a, b) => b - a);
  if (js) values[0] += js;
  for (const weight in cardWeights) {
    const expected = cardWeights[weight];
    if (expected.every((a, i) => a === values[i])) {
      hands[weight].push(hand);
    }
  }
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(" "));
  const hands = {
    noPair: [],
    pair: [],
    twoPair: [],
    threeOfAKind: [],
    fullHouse: [],
    fourOfAKind: [],
    fiveOfAKind: [],
  };
  const cardStrengths = {
    J: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    T: 10,
    Q: 12,
    K: 13,
    A: 14,
  };

  input.forEach((hand) => {
    getHandLabelWithJacksWild(hand, hands);
  });
  for (const key in hands) {
    const collection = hands[key];
    collection.sort((a, b) => sortFromValues(a, b, cardStrengths));
  }
  let final = [];
  for (const key of order) {
    final = [...final, ...hands[key]];
  }
  return final.reduce((acc, curr, i) => {
    return acc + +curr[1] * (i + 1);
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
