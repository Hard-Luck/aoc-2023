import run from "aocrunner";

function handlePulseFlipFlop(pulseType, modName, modules) {
  const commands = [];
  if (pulseType === "high") return commands;
  const mod = modules[modName];
  if (pulseType === "low") {
    mod.active = !mod.active;
  }
  for (const dest of mod.destinations) {
    commands.push([mod.active ? "high" : "low", modName, dest]);
  }
  return commands;
}
function handlePulseConjunction(pulseType, from, modName, modules) {
  const mod = modules[modName];
  const commands = [];
  mod.receivedFrom[from] = pulseType;
  const allHigh = allRecievedPulsesHigh(mod);
  for (const dest of mod.destinations) {
    commands.push([allHigh ? "low" : "high", modName, dest]);
  }
  return commands;
}
function allRecievedPulsesHigh(mod) {
  let allHigh = true;
  for (const key in mod.receivedFrom) {
    const value = mod.receivedFrom[key];
    if (value !== "high") {
      allHigh = false;
      break;
    }
  }
  return allHigh;
}
function inRfCylce(modules) {
  const keeps = new Set("rf");
  const q = ["rf"];
  while (q.length) {
    console.log(q);
    const current = q.shift();
    let found = false;
    for (const key in modules) {
      if (
        modules[key].destinations.includes(current) ||
        modules[key]?.receivedFrom?.hasOwnProperty(current)
      ) {
        if (!keeps.has(current)) q.push(key);
        found = true;
      }
      if (found) keeps.add(current);
    }
  }
  return keeps;
}
const parseInput = (rawInput) => rawInput;
function parseModules(input) {
  const modules = {};
  for (const line of input) {
    const mod = {};
    const [typeName, output] = line.split(" -> ");
    const destinations = output.split(",").map((x) => x.trim());
    mod.destinations = destinations;
    if (typeName === "broadcaster") {
      modules.broadcaster = mod;
      continue;
    }
    const type = typeName[0];
    const name = typeName.slice(1);
    mod.type = type === "&" ? "conjunction" : "flipFlop";
    if (mod.type === "conjunction") {
      mod.receivedFrom = {};
    }
    if (mod.type === "flipFlop") {
      mod.active = false;
    }
    modules[name] = mod;
  }
  for (const key in modules) {
    const current = modules[key];
    for (const to of current.destinations) {
      if (modules[to]?.type === "conjunction") {
        modules[to].receivedFrom[key] = "low";
      }
      if (!(to in modules)) {
        modules[to] = { destinations: [], type: "testing" };
      }
    }
  }
  return modules;
}

const part1 = (rawInput) => {
  const highLow = { low: 0, high: 0 };
  const input = parseInput(rawInput).split("\n");
  const modules = parseModules(input);
  const q = [["low", "button,", "broadcaster"]];

  let i = 1;
  while (q.length) {
    const [pulse, from, to] = q.shift();
    highLow[pulse]++;
    if (pulse === "low" && to === "rx") break;
    if (to === "broadcaster") {
      for (const key in modules.broadcaster.destinations) {
        const d = modules.broadcaster.destinations[key];
        q.push([pulse, "broadcast", d]);
      }
    }
    if (modules[to].type === "flipFlop") {
      const toAdd = handlePulseFlipFlop(pulse, to, modules);
      if (toAdd.length) {
        q.push(...toAdd);
      }
    }
    if (modules[to].type === "conjunction") {
      const toAdd = handlePulseConjunction(pulse, from, to, modules);

      if (toAdd.length) {
        q.push(...toAdd);
      }
    }
    if (q.length === 0 && i < 1000) {
      q.push(["low", "button,", "broadcaster"]);
      i++;
    }
  }
  return highLow.low * highLow.high;
};
function findEndOfCycle(modules, key, pairs = new Set()) {
  const mod = modules[key];
  console.log(key);
  for (const next of mod.destinations) {
    if (pairs.has(next)) continue;
    pairs.add(next);
    if (next === "hp") return key;
    const potential = findEndOfCycle(modules, next, pairs);
    if (potential) return potential;
  }
}
const part2 = (rawInput) => {
  const input = parseInput(rawInput).split("\n");
  const modules = parseModules(input);
  const pairs = modules.broadcaster.destinations.map((x) => [
    x,
    findEndOfCycle(modules, x),
  ]);
  console.log(pairs);
  const cycles = pairs.reduce((acc, [start, end]) => {
    acc[end] ??= {};
    acc[end] = null;
    return acc;
  }, {});
  for (const [start, end] of pairs) {
    let x = 1;
    const q = [["low", "button,", "broadcaster"]];
    while (q.length) {
      const [pulse, from, to] = q.shift();
      if (from === end && pulse === "high") {
        cycles[end] = x;
        break;
      }
      if (to === "broadcaster") {
        q.push([pulse, "broadcast", start]);
        continue;
      }
      if (modules[to].type === "flipFlop") {
        const toAdd = handlePulseFlipFlop(pulse, to, modules);
        // if (toAdd.length === 1 && toAdd[0][0] === "low" && toAdd[0][2] === "rx") {
        //   break;
        // }
        if (toAdd.length) {
          q.push(...toAdd);
        }
      }
      if (modules[to].type === "conjunction") {
        const toAdd = handlePulseConjunction(pulse, from, to, modules);
        // if (toAdd.length === 1 && toAdd[0][0] === "low" && toAdd[0][2] === "rx") {
        //   break;
        // }
        if (toAdd.length) {
          q.push(...toAdd);
        }
      }
      if (q.length === 0) {
        q.push(["low", "button,", "broadcaster"]);
        x++;
      }
    }
  }
  function lcm(a, b) {
    return (a * b) / gcd(a, b);
  }
  function gcd(a, b) {
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }
  let total = 1;
  console.log(cycles);
  for (const cycle of Object.values(cycles)) {
    total = lcm(total, cycle);
  }
  return total;
};
function allHigh(mod) {
  for (const key in mod.receivedFrom) {
    if (mod.receivedFrom[key] === "high") return false;
  }
  return true;
}
run({
  part1: {
    tests: [
      {
        input: `
         broadcaster -> a
         %a -> inv, con
         &inv -> b
         %b -> con
         &con -> output
         `,
        expected: 11687500,
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
