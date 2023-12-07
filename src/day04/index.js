import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
  const games = parseInput(rawInput)
    .split("\n")
    .map((game) => game.replace(/Card \d: /, ""))
    .map((game) => game.split("|"));
  let total = 0;
  games.forEach((game) => {
    const elfsNumbers = game[0].split(" ");
    const winningNumbers = game[1].split(" ").filter((num) => num !== "");
    const winners = elfsNumbers.filter((number) => {
      return winningNumbers.includes(number);
    });
    if (winners.length) {
      console.log(winners.length);
      total += 2 ** (winners.length - 1);
    }
  });

  return total;
};

const part2 = (rawInput) => {
  const games = parseInput(rawInput)
    .split("\n")
    .map((game) => game.split("|"));
  let cache = Array.from({ length: games.length });
  function calculateWinners(gameIndex) {
    const cached = cache[gameIndex];
    if (cached) return cached;
    let total = 0;
    let game = games[gameIndex];
    let elfsNumbers = game[0].match(/\d+/g);
    let winningNumbers = game[1].match(/\d+/g);
    let subtotal = 0;
    for (let i = 0; i < elfsNumbers.length; i++) {
      if (i === 0) continue;
      if (winningNumbers.indexOf(elfsNumbers[i]) !== -1) {
        subtotal++;
      }
    }
    total += subtotal;
    for (let i = 0; i < subtotal; i++) {
      total += calculateWinners(i + 1 + gameIndex);
    }
    cache[gameIndex] = total;
    return total;
  }
  let allWinners = 0;
  for (let i = 0; i < games.length; i++) {
    allWinners += 1 + calculateWinners(i);
  }
  return allWinners;
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
