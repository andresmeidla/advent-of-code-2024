import { runSolution } from '../utils.ts';

enum GateType {
  xANDy = 'xANDy',
  xXORy = 'xXORy',
  Ri = 'Ri',
  Ci = 'Ci',
}

type Gate = {
  index: number;
  left: string;
  right: string;
  output: string;
  operator: 'AND' | 'OR' | 'XOR';
  type?: GateType;
};

type Wire = {
  id: string;
  value: 0 | 1;
  initialized?: boolean;
  index?: number;
};

/** provide your solution as the return of this function */
export async function day24a(data: string[]) {
  // console.log(data);
  let mode = 0;

  const inputSet = new Set<string>();
  const inputs: Wire[] = [];
  const gatesInit: Gate[] = [];
  let gateCount = 1000;
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
      inputSet.add(id);
    } else {
      const [left, operator, right, , to] = line
        .split(' ')
        .map((x) => x.trim());
      if (left.startsWith('x') && !right.startsWith('y')) {
        throw new Error('left is x but right is not y');
      }
      if (right.startsWith('y') && !left.startsWith('x')) {
        throw new Error('right is y but left is not x');
      }
      const isXy =
        (left.startsWith('x') && right.startsWith('y')) ||
        (right.startsWith('x') && left.startsWith('y'));
      if (isXy && !['AND', 'XOR'].includes(operator)) {
        throw new Error('x AND y or x XOR y expected');
      }
      const gate: Gate = {
        index: isXy ? parseInt(left.slice(-2)) : gateCount++,
        left: left.startsWith('x') ? left : right,
        right: left.startsWith('x') ? right : left,
        output: to,
        operator: operator as 'AND' | 'OR' | 'XOR',
        ...(isXy
          ? { type: operator === 'AND' ? GateType.xANDy : GateType.xXORy }
          : {}),
      };
      gatesInit.push(gate);
    }
  }

  const wiresInit: Wire[] = [];
  inputs.forEach((input) => {
    const wire: Wire = {
      id: input.id,
      value: input.value,
      initialized: true,
    };
    wiresInit.push(wire);
  });
  gatesInit.forEach((gate) => {
    if (!inputSet.has(gate.output)) {
      inputSet.add(gate.output);
      wiresInit.push({
        id: gate.output,
        value: 0,
        initialized: false,
      });
    }
  });

  wiresInit.forEach((wire) => {
    let index = 0;
    if (
      wire.id.startsWith('x') ||
      wire.id.startsWith('y') ||
      wire.id.startsWith('z')
    ) {
      index = parseInt(wire.id.slice(1));
      wire.index = index;
    }
  });

  const gateIdToAlias = new Map<string, string>();

  const zIndex = (index: number) => 'z' + `${index}`.padStart(2, '0');
  const cIndex = (index: number) => 'C' + `${index}`.padStart(2, '0');
  const rIndex = (index: number) => 'R' + `${index}`.padStart(2, '0');
  const onlyIndex = (index: number) => `${index}`.padStart(2, '0');

  const zWiresInit = wiresInit
    .filter((wire) => wire.id.startsWith('z'))
    .sort((a, b) => a.index! - b.index!);

  const SWAPS_MADE: string[][] = [];

  const swapGateOutputs = (gate1: Gate, gate2: Gate) => {
    const output1 = gate1.output;
    const output2 = gate2.output;
    gate1.output = output2;
    gate2.output = output1;
    SWAPS_MADE.push([output1, output2]);
  };

  const logGates = () => {
    console.log(
      '\n ####################### Logging Gates ########################'
    );
    const pGateLeft = (gate: Gate) => {
      const name = `${gateIdToAlias.get(gate.left) || gate.left} (${gate.left})`;
      return `${name.padStart(15, ' ')}`;
    };
    const pGateRight = (gate: Gate) => {
      const name = `${gateIdToAlias.get(gate.right) || gate.right} (${gate.right})`;
      return `${name.padEnd(15, ' ')}`;
    };
    const pGateOutput = (gate: Gate) => {
      const name = `${gateIdToAlias.get(gate.output) || gate.output} (${gate.output})`;
      return name;
    };

    gatesInit
      .sort((a, b) => {
        const aName =
          gateIdToAlias.get(a.left) ||
          gateIdToAlias.get(a.right) ||
          gateIdToAlias.get(a.output);
        const aIndex = aName ? parseInt(aName.slice(-2)) : a.index;
        const bName =
          gateIdToAlias.get(b.left) ||
          gateIdToAlias.get(b.right) ||
          gateIdToAlias.get(b.output);
        const bIndex = bName ? parseInt(bName.slice(-2)) : b.index;
        return (
          (isNaN(aIndex) ? Infinity : aIndex) -
          (isNaN(bIndex) ? Infinity : bIndex)
        );
      })
      .forEach((gate) => {
        console.log(
          `Gate ${gate.index.toString().padStart(4, ' ')}:`,
          pGateLeft(gate),
          gate.operator.padEnd(3, ' '),
          pGateRight(gate),
          '->',
          pGateOutput(gate)
        );
      });
  };

  const aliasToGate = new Map<string, Gate>();

  const getGatesUsingLastCarry = (index: number) => {
    const Ci_1 = aliasToGate.get(cIndex(index - 1));

    if (!Ci_1) {
      throw new Error(
        'Ci-1 not found for: ' +
          JSON.stringify({ index, Ci_1: cIndex(index - 1) })
      );
    }
    // find all the gates that have Ci-1 as input
    const gatesWithCi_1 = gatesInit.filter(
      (gate) => gate.left === Ci_1.output || gate.right === Ci_1.output
    );
    if (gatesWithCi_1.length !== 2) {
      throw new Error(
        'Expected 2 gates with Ci-1 as input: ' +
          JSON.stringify({ index, Ci_1: cIndex(index - 1) })
      );
    }
    return {
      Ci_1,
      andGate: gatesWithCi_1.find((gate) => gate.operator === 'AND'),
      xorGate: gatesWithCi_1.find((gate) => gate.operator === 'XOR'),
    };
  };

  const validatexXORy = ({
    index,
    Ci_1,
    andGate,
    xorGate,
  }: {
    index: number;
    Ci_1: Gate;
    andGate: Gate;
    xorGate: Gate;
  }) => {
    // both andGate should have xXORy as input
    const [andGateOther, xorGateOther] = [andGate, xorGate].map((g) =>
      g.left === Ci_1.output ? g.right : g.left
    );
    if (andGateOther !== xorGateOther) {
      throw new Error('Both inputs should be the same');
    }
    // otherIds should be both xXORy
    // find the xXORy gate
    const xXORy = gatesInit.find(
      (gate) => gate.type === GateType.xXORy && gate.index === index
    );

    if (!xXORy) {
      throw new Error('xXORy not found for index: ' + index);
    }
    if (xXORy.output !== andGateOther) {
      // find the gate that has andGateOther as output
      const gatesWithAndGateOther = gatesInit.filter(
        (gate) => gate.output === andGateOther
      );
      if (gatesWithAndGateOther.length !== 1) {
        throw new Error('Expected 1 gate with andGateOther as output');
      }
      const gateWithAndGateOther = gatesWithAndGateOther[0];
      // throw new Error('xXORy output does not match: ' + index);
      return { swap: [gateWithAndGateOther, xXORy] };
    }
    const xXORyAlias = 'xXORy' + onlyIndex(index);
    aliasToGate.set(xXORyAlias, xXORy);
    gateIdToAlias.set(xXORy.output, xXORyAlias);
    return { swap: [] };
  };

  const validateRi = ({ index, andGate }: { index: number; andGate: Gate }) => {
    // Ri = Ci-1 AND (xXORy)i
    const Ri = andGate;
    const RiAlias = rIndex(index);
    aliasToGate.set(RiAlias, Ri);
    gateIdToAlias.set(Ri.output, RiAlias);
    return { Ri };
  };

  const validateZi = ({ index, xorGate }: { index: number; xorGate: Gate }) => {
    // zi = Ci-1 XOR (xXORy)i
    const zi = xorGate;
    // find the gate that has zi as output
    const gatesWithZi = gatesInit.filter(
      (gate) => gate.output === zIndex(index)
    );
    if (gatesWithZi.length !== 1) {
      throw new Error('Expected 1 gate with zi as output');
    }
    const gateWithZi = gatesWithZi[0];
    if (gateWithZi !== zi) {
      return { swap: [gateWithZi, zi] };
    }

    const ziAlias = zIndex(index);
    aliasToGate.set(ziAlias, zi);
    gateIdToAlias.set(zi.output, ziAlias);
    return { swap: [] };
  };

  const validateCi = ({ index, Ri }: { index: number; Ri: Gate }) => {
    // Ci = (xANDy)i OR Ri
    // find the xANDy gate
    const xANDy = gatesInit.find(
      (gate) => gate.type === GateType.xANDy && gate.index === index
    );
    if (!xANDy) {
      throw new Error('xANDy not found for index: ' + index);
    }
    // find gate that has Ri.output as input
    const gatesWithRi = gatesInit.filter(
      (gate) => gate.left === Ri.output || gate.right === Ri.output
    );
    if (gatesWithRi.length !== 1) {
      throw new Error('Expected 1 gate with Ri as input');
    }
    const Ci = gatesWithRi[0];
    const CiOther = Ci.left === Ri.output ? Ci.right : Ci.left;
    if (CiOther !== xANDy.output) {
      throw new Error('CiOther does not match xANDy: ' + index);
    }
    const CiAlias = cIndex(index);
    aliasToGate.set(CiAlias, Ci);
    gateIdToAlias.set(Ci.output, CiAlias);
  };

  const validateAdderForBit = (index: number) => {
    console.log('Validating bit:', index);
    // Ci-1 XOR (xXORy)i -> zi (Sum)
    // Ci-1 AND (xXORy)i -> Ri (sub-equation for Carry)
    // (xANDy)i OR Ri -> Ci (Carry)
    // As Ci-1 should be available, we should find the gates that have Ci-1 as input
    const { Ci_1, andGate, xorGate } = getGatesUsingLastCarry(index);
    if (!andGate || !xorGate) {
      throw new Error(
        'AND and XOR gates not found for Ci-1: ' +
          JSON.stringify({ index, Ci_1: cIndex(index - 1) })
      );
    }
    const { swap: swap1 } = validatexXORy({ index, Ci_1, andGate, xorGate });
    if (swap1.length) {
      return swap1;
    }

    const { Ri } = validateRi({ index, andGate });

    const { swap: swap2 } = validateZi({ index, xorGate });
    if (swap2.length) {
      return swap2;
    }

    validateCi({ index, Ri });
    return [];
  };

  // z00 is a special case - half adder is used, other outputs use full adder
  // x00 AND y00 -> C00
  const C00 = gatesInit.find(
    (gate) =>
      gate.type === GateType.xANDy &&
      gate.left === 'x00' &&
      gate.right === 'y00'
  );
  if (!C00) {
    throw new Error('C00 not found');
  }
  aliasToGate.set('C00', C00);
  gateIdToAlias.set(C00.output, 'C00');
  const xXORy00 = gatesInit.find(
    (gate) =>
      gate.type === GateType.xXORy &&
      gate.left === 'x00' &&
      gate.right === 'y00'
  );
  if (!xXORy00) {
    throw new Error('xXORy00 not found');
  }
  aliasToGate.set('z00', xXORy00);
  gateIdToAlias.set(xXORy00.output, 'z00');

  // logGates();

  const gateOutputsInvolvedInSwaps: string[] = [];
  for (let i = 1; i < zWiresInit.length - 1; i++) {
    let swap: Gate[] = [];
    while ((swap = validateAdderForBit(i)) && swap.length > 0) {
      console.log('Swapping:', swap);
      gateOutputsInvolvedInSwaps.push(swap[0].output, swap[1].output);
      swapGateOutputs(swap[0], swap[1]);
    }
  }

  logGates();

  return gateOutputsInvolvedInSwaps.sort().join(',');
}

await runSolution(day24a);
