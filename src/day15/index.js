import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

function hash(string) {
  let total = 0;
  for (const letter of string) {
    total += letter.charCodeAt(0);
    total *= 17;
    total %= 256;
  }
  return total;
}
const part1 = (rawInput) => {
  const input = parseInput(rawInput).split(",");

  return input.reduce((a, b) => a + hash(b), 0);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput).split(",");
  const boxes = [];
  for (let i = 0; i < 256; i++) {
    boxes.push([]);
  }
  input.forEach((x) => {
    const [boxUnhashed, l] = x.split(/[=-]/);
    console.log(boxUnhashed, x, l);
    const box = hash(boxUnhashed);
    if (+l === 0) {
      for (const i in boxes[box]) {
        const slot = boxes[box][i];
        if (slot.startsWith(boxUnhashed)) {
          boxes[box].splice(i, 1);
        }
      }
    } else {
      let wasThere = false;
      for (const i in boxes[box]) {
        const slot = boxes[box][i];
        if (slot.startsWith(boxUnhashed)) {
          boxes[box].splice(i, 1, x);
          wasThere = true;
          break;
        }
      }
      if (!wasThere) boxes[box].push(x);
    }
  });

  return boxes.reduce((a, c, i) => {
    return (
      a +
      c.reduce((sub, slot, boxNum) => {
        return sub + (boxNum + 1) * (i + 1) * +slot.split("=")[1];
      }, 0)
    );
  }, 0);
};

run({
  part1: {
    tests: [
      //{
      //  input: `HASH`,
      //  expected: 52,
      //},
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
