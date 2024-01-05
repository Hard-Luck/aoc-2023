import run from "aocrunner";
const abs = (n) => (n < 0n ? -n : n);
const parseInput = (rawInput) => rawInput;
//const MIN = 7;
//const MAX = 27;
const MIN = 200_000_000_000_000n;
const MAX = 400_000_000_000_000n;
const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((x) => x.split(" @ "))
    .map(([a, b]) => [
      a.match(/-*\d+/g).map(BigInt),
      b.match(/-*\d+/g).map(BigInt),
    ]);
  const total = checkAllLines(input);
  return total;
};
function crossLines([f, df], [g, dg]) {
  const [a, b] = f;
  const [da, db] = df;
  const [x1, y1] = [a, b];
  const [x2, y2] = [a + MAX * da, b + MAX * db];
  const [c, d] = g;
  const [dc, dd] = dg;
  const [x3, y3] = [c, d];
  const [x4, y4] = [c + MAX * dc, d + MAX * dd];
  const denominator = Number((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  if (denominator === 0) return false;
  let t =
    (Number(x1 - x3) / denominator) * Number(y3 - y4) -
    (Number(y1 - y3) / denominator) * Number(x3 - x4);
  let u =
    (Number(x1 - x3) / denominator) * Number(y1 - y2) -
    (Number(y1 - y3) / denominator) * Number(x1 - x2);

  // console.log({
  //   a,
  //   b,
  //   c,
  //   d,
  //   da,
  //   db,
  //   dc,
  //   dd,
  //   x1,
  //   x2,
  //   x3,
  //   x4,
  //   y1,
  //   y2,
  //   y3,
  //   y4,
  //   t,
  //   u,
  // });
  console.log(t);
  let [px, py] = [];
  if (t >= 0n && t <= 1n && u >= 0n && u <= 1n) {
    [px, py] = [
      Number(x1) + t * Number(x2 - x1),
      Number(y1) + t * Number(y2 - y1),
    ];
    return px >= MIN && px <= MAX && py >= MIN && py <= MAX;
  }
}
function checkAllLines(lines) {
  let total = 0;
  for (let i = 0; i < lines.length - 1; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const intersection = crossLines(lines[i], lines[j]);
      if (intersection) {
        total++;
      }
    }
  }
  return total;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
        19, 13, 30 @ -2,  1, -2
        18, 19, 22 @ -1, -1, -2
        20, 25, 34 @ -2, -2, -4
        12, 31, 28 @ -1, -2, -1
        20, 19, 15 @  1, -5, -3
        `,
        expected: 2,
      },
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
