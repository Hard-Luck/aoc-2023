import run from "aocrunner";
import { writeFileSync } from "fs";
/**
 * In this example, if you disconnect
 * the wire between    hfx/pzl,
 * the wire between    bvb/cmg,     and
 * the wire between    nvd/jqt,
 * you will divide the components into two separate,
 * disconnected groups:
 */
const parseInput = (rawInput) => rawInput;
function countSetsOfParts(parts, current, sets) {
  sets.push(new Set());
  const q = [current];
  const currentSet = sets.at(-1);
  while (q.length) {
    let part = q.shift();
    if (currentSet.has(part)) continue;
    currentSet.add(part);
    for (const x of parts[part] ?? []) {
      q.push(x);
    }
  }
}

function combineSets(setsOfParts) {
  for (let i = 0; i < setsOfParts.length - 1; i++) {
    for (let j = i + 1; j < setsOfParts.length; j++) {
      if (setsOfParts[j] === null || setsOfParts[i] === null) continue;
      const arrayOfParts = [...setsOfParts[i]];
      if (arrayOfParts.some((x) => setsOfParts[j].has(x))) {
        arrayOfParts.forEach((x) => setsOfParts[j].add(x));
        setsOfParts[i] = null;
      }
    }
  }
}
function removeLink(input, part1, part2) {
  input[part1] = input[part1]?.filter((x) => x !== part2);
  input[part2] = input[part2]?.filter((x) => x !== part1);
}
function makeAllPairs(input) {
  let pairs = [];
  for (const key in input) {
    console.log(input[key]);
    for (const part of input[key] ?? []) {
      pairs.push([key, part]);
    }
  }
  return pairs;
}
const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(": "))
    .map(([a, b]) => [a, b.split(" ")])
    .reduce((a, [b, c]) => {
      a[b] = c;
      return a;
    }, {});
  const setsOfParts = [];
  // const pairCombos = makeAllPairs(input);
  // let text = "";

  // const toRemove = new Set();
  // console.log({ input });

  // for (let i = 0; i < pairCombos.length - 1; i++) {
  //   for (let j = i + 1; j < pairCombos.length - 0; j++) {
  //     const [x, check] = pairCombos[i];
  //     if (
  //       pairCombos.filter(([a, b]) => b === check).length === 1 ||
  //       !(check in input)
  //     ) {
  //       toRemove.add(JSON.stringify([x, check]));
  //     }
  //   }
  // }
  // const possiblePairs = [...toRemove].map((x) => JSON.parse(x));
  // console.log(possiblePairs);

  removeLink(input, "mfs", "ffv");
  removeLink(input, "ljh", "tbg");
  removeLink(input, "qnv", "mnh");

  for (const part in input) {
    countSetsOfParts(input, part, setsOfParts);
  }
  combineSets(setsOfParts);
  const sizes = setsOfParts.filter((x) => x !== null).map((x) => x.size);
  console.log(sizes);
  if (sizes.length === 2) return sizes[0] * sizes[1];

  return;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      // {
      //   input: `
      //    jqt: rhn xhk nvd
      //    rsh: frs pzl lsr
      //    xhk: hfx
      //    cmg: qnr nvd lhk bvb
      //    rhn: xhk bvb hfx
      //    bvb: xhk hfx
      //    pzl: lsr hfx nvd
      //    qnr: nvd
      //    ntq: jqt hfx bvb xhk
      //    nvd: lhk
      //    lsr: lhk
      //    rzs: qnr cmg lsr rsh
      //    frs: qnr lhk lsr
      //    `,
      //   expected: 54,
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
