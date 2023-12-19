import run from "aocrunner";

const parseInput = (rawInput) => rawInput;
function extractPartData(rawPart) {
  return JSON.parse(
    rawPart
      .replace("x", '"x"')
      .replace("m", '"m"')
      .replace("a", '"a"')
      .replace("s", '"s"')
      .replaceAll("=", ":"),
  );
}
function parseInstruction(instruction) {
  if (!/:/.test(instruction)) return [instruction];
  const [comparison, destination] = instruction.split(":");
  if (/</.test(comparison)) {
    const [letter, value] = comparison.split("<");
    return [letter, "lt", +value, destination];
  }
  if (/>/.test(comparison)) {
    const [letter, value] = comparison.split(">");
    return [letter, "gt", +value, destination];
  }
}
function parseWorkflows(rawWorkFlow) {
  const [source, rawFlow] = rawWorkFlow.split("{");
  const workFlow = rawFlow.slice(0, -1).split(",");
  return [source, workFlow];
}
function followInstruction(part, workFlow) {
  for (const check of workFlow) {
    if (check.length === 1) return check[0];
    const [letter, operator, value, destination] = check;
    if (operator === "gt" && part[letter] > value) return destination;
    if (operator === "lt" && part[letter] < value) return destination;
  }
}

function followWorkFlowForRange(allWorkFlow) {
  let ranges = [
    ["in", { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }],
  ];
  const accepted = [];
  while (ranges.length) {
    const next = ranges.pop();
    const [location, part] = next;
    if (location === "R") continue;
    if (location === "A") {
      accepted.push(part);
      continue;
    }
    const newRanges = splitRange(location, part, allWorkFlow);
    if (newRanges.length) ranges.push(...newRanges);
  }
  return accepted;
}
function copyPart(part) {
  const newPart = {
    x: [...part.x],
    m: [...part.m],
    a: [...part.a],
    s: [...part.s],
  };
  return newPart;
}
function splitRange(location, part, allWorkFlow) {
  for (const check of allWorkFlow[location]) {
    if (check.length === 1) return [[check[0], part]];
    const [letter, operator, value, destination] = check;
    const [min, max] = part[letter];
    if (operator === "gt") {
      if (min <= value && max <= value) continue;
      if (min > value && max > value) {
        return [[destination, part]];
      }
      if (min <= value && max > value) {
        const newPartMax = copyPart(part);
        const newPartMin = copyPart(part);
        newPartMax[letter] = [value + 1, max];
        newPartMin[letter] = [min, value];
        return [
          [destination, newPartMax],
          [location, newPartMin],
        ];
      }
    }
    if (operator === "lt") {
      if (min >= value && max >= value) {
        continue;
      }
      if (min < value && max <= value) {
        return [[destination, part]];
      }
      if (min < value && max >= value) {
        const newPartMax = copyPart(part);
        const newPartMin = copyPart(part);
        newPartMax[letter] = [value, max];
        newPartMin[letter] = [min, value - 1];
        return [
          [location, newPartMax],
          [destination, newPartMin],
        ];
      }
    }
  }
}
const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n\n")
    .map((x) => x.split("\n"));
  const parts = input[1].map(extractPartData);
  const workFlow = input[0].map(parseWorkflows).reduce((a, c) => {
    a[c[0]] = c[1];
    return a;
  }, {});
  for (const key in workFlow) {
    workFlow[key] = workFlow[key].map(parseInstruction);
  }
  let total = 0;
  const accepted = [];
  for (const part of parts) {
    let current = "in";
    while (!["R", "A"].includes(current)) {
      current = followInstruction(part, workFlow[current]);
    }
    if (current === "A") {
      accepted.push(part);
    }
  }

  return accepted.reduce((acc, { x, m, a, s }) => acc + x + m + a + s, 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n\n")
    .map((x) => x.split("\n"));
  const parts = input[1].map(extractPartData);
  const workFlow = input[0].map(parseWorkflows).reduce((a, c) => {
    a[c[0]] = c[1];
    return a;
  }, {});
  for (const key in workFlow) {
    workFlow[key] = workFlow[key].map(parseInstruction);
  }
  const accepted = followWorkFlowForRange(workFlow);

  return accepted.reduce((acc, { x, m, a, s }) => {
    const xTotal = x[1] - x[0] + 1;
    const mTotal = m[1] - m[0] + 1;
    const aTotal = a[1] - a[0] + 1;
    const sTotal = s[1] - s[0] + 1;
    console.log({ total: xTotal * mTotal * aTotal * sTotal });
    return acc + xTotal * mTotal * aTotal * sTotal;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
        px{a<2006:qkq,m>2090:A,rfg}
        pv{a>1716:R,A}
        lnx{m>1548:A,A}
        rfg{s<537:gd,x>2440:R,A}
        qs{s>3448:A,lnx}
        qkq{x<1416:A,crn}
        crn{x>2662:A,R}
        in{s<1351:px,qqz}
        qqz{s>2770:qs,m<1801:hdj,R}
        gd{a>3333:R,R}
        hdj{m>838:A,pv}

        {x=787,m=2655,a=1222,s=2876}
        {x=1679,m=44,a=2067,s=496}
        {x=2036,m=264,a=79,s=2244}
        {x=2461,m=1339,a=466,s=291}
        {x=2127,m=1623,a=2188,s=1013}
        `,
        expected: 19114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        px{a<2006:qkq,m>2090:A,rfg}
        pv{a>1716:R,A}
        lnx{m>1548:A,A}
        rfg{s<537:gd,x>2440:R,A}
        qs{s>3448:A,lnx}
        qkq{x<1416:A,crn}
        crn{x>2662:A,R}
        in{s<1351:px,qqz}
        qqz{s>2770:qs,m<1801:hdj,R}
        gd{a>3333:R,R}
        hdj{m>838:A,pv}

        {x=787,m=2655,a=1222,s=2876}
        {x=1679,m=44,a=2067,s=496}
        {x=2036,m=264,a=79,s=2244}
        {x=2461,m=1339,a=466,s=291}
        {x=2127,m=1623,a=2188,s=1013}
        `,
        expected: 167409079868000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
