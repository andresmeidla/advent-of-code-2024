import { runSolution } from '../utils.ts';

type Gate = {
  left: string;
  right: string;
  output: string;
  operator: 'AND' | 'OR' | 'XOR';
};

type Wire = {
  id: string;
  value: 0 | 1;
  initialized?: boolean;
  index?: number;
};

/** provide your solution as the return of this function */
export async function day24a(data: string[]) {
  console.log(data);
  let mode = 0;

  const inputs: Wire[] = [];
  const gates: Gate[] = [];
  for (let i = 0; i < data.length; i++) {
    const line = data[i];

    if (line.length === 0) {
      mode = 1;
      continue;
    }

    if (mode === 0) {
      const [id, valueStr] = line.split(':').map((x) => x.trim());
      const input: Wire = {
        id,
        value: parseInt(valueStr) as 0 | 1,
      };
      inputs.push(input);
    } else {
      const [left, operator, right, , to] = line
        .split(' ')
        .map((x) => x.trim());
      const gate: Gate = {
        left,
        right,
        output: to,
        operator: operator as 'AND' | 'OR' | 'XOR',
      };
      gates.push(gate);
    }
    console.log(line);
  }
  console.log(inputs, gates);

  const wires: Wire[] = [];
  const wireMap = new Map<string, Wire>();
  inputs.forEach((input) => {
    const wire = {
      id: input.id,
      value: input.value,
      initialized: true,
    };
    wireMap.set(input.id, wire);
    wires.push(wire);
  });
  gates.forEach((gate) => {
    const allWires: string[] = [gate.left, gate.right, gate.output];
    allWires.forEach((wireId) => {
      if (!wireMap.has(wireId)) {
        const wire: Wire = {
          id: wireId,
          value: 0,
          initialized: false,
        };
        wires.push(wire);
        wireMap.set(wireId, wire);
      }
    });
  });

  wires.forEach((wire) => {
    let index = 0;
    if (
      wire.id.startsWith('z') ||
      wire.id.startsWith('x') ||
      wire.id.startsWith('y')
    ) {
      index = parseInt(wire.id.slice(1));
      wire.index = index;
    }
  });

  const calculate = () => {
    // go through all the gates
    for (let i = 0; i < gates.length; i++) {
      const gate = gates[i];
      const left = wireMap.get(gate.left);
      const right = wireMap.get(gate.right);
      if (!left || !right) {
        throw new Error('Not all inputs are known');
      }
      if (!left.initialized || !right.initialized) {
        continue;
      }
      const output = wireMap.get(gate.output);
      if (
        !left ||
        !right ||
        !left.initialized ||
        !right.initialized ||
        !output
      ) {
        throw new Error('Not all inputs are initialized');
      }
      switch (gate.operator) {
        case 'AND':
          output.value = left.value & right.value ? 1 : 0;
          break;
        case 'OR':
          output.value = left.value | right.value ? 1 : 0;
          break;
        case 'XOR':
          output.value = left.value ^ right.value ? 1 : 0;
          break;
        default:
          throw new Error('Unknown operator');
      }
      console.log(
        `Calculated: ${left.id}(${left.value}) ${gate.operator} ${right.id}(${right.value}) = ${output.id}(${output.value})`
      );

      output.initialized = true;
    }
  };

  const neededOutputs = wires
    .filter((wire) => wire.id.startsWith('z'))
    .sort((a, b) => a.index! - b.index!);
  console.log('initial', wires);
  while (neededOutputs.some((wire) => !wire.initialized)) {
    calculate();
    // console.log('iteration', i, wires);
  }

  const out = neededOutputs;
  console.log('out', out);
  const binary = parseInt(
    out
      .map((o) => o.value)
      .reverse()
      .join(''),
    2
  );

  return binary;
}

await runSolution(day24a);
