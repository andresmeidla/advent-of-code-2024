import { runSolution } from '../utils.ts';

const opcodeToName = {
  0: 'adv',
  1: 'bxl',
  2: 'bst',
  3: 'jnz',
  4: 'bxc',
  5: 'out',
  6: 'bdv',
  7: 'cdv',
};

const operandValue = (
  operand: number,
  { regA, regB, regC }: { regA: number; regB: number; regC: number }
) => {
  switch (operand) {
    case 4:
      return regA;
    case 5:
      return regB;
    case 6:
      return regC;
    case 7: {
      throw new Error('Invalid operand');
    }
    default:
      return operand;
  }
};

const performInstruction = (
  instruction: {
    opcode: number;
    operand: number;
  },
  registers: { regA: number; regB: number; regC: number },
  output: number[],
  instructionPointer: number
) => {
  switch (instruction.opcode) {
    case 0: {
      // adv (division)
      const numerator = registers.regA;
      const denominator = Math.pow(
        2,
        operandValue(instruction.operand, registers)
      );
      const division = Math.floor(numerator / denominator);
      registers.regA = division;
      break;
    }
    case 1: {
      // bxl (bitwise XOR)
      const leftSide = registers.regB;
      const rightSide = instruction.operand;
      registers.regB = (leftSide ^ rightSide) >>> 0;
      break;
    }
    case 2: {
      // bst (mod 8)
      const value = operandValue(instruction.operand, registers) % 8;
      registers.regB = value;
      break;
    }
    case 3: {
      // jnz (jump if not zero)
      if (registers.regA !== 0) {
        return instruction.operand;
      }
      break;
    }
    case 4: {
      // bxc (bitwise XOR)
      const leftSide = registers.regB;
      const rightSide = registers.regC;
      registers.regB = (leftSide ^ rightSide) >>> 0;
      break;
    }
    case 5: {
      // out
      output.push(operandValue(instruction.operand, registers) % 8);
      break;
    }
    case 6: {
      // bdv
      const numerator = registers.regA;
      const denominator = Math.pow(
        2,
        operandValue(instruction.operand, registers)
      );
      const division = Math.floor(numerator / denominator);
      registers.regB = division;
      break;
    }
    case 7: {
      // cdv
      const numerator = registers.regA;
      const denominator = Math.pow(
        2,
        operandValue(instruction.operand, registers)
      );
      const division = Math.floor(numerator / denominator);
      registers.regC = division;
      break;
    }
    default: {
      throw new Error('Invalid opcode');
    }
  }
  return instructionPointer + 2;
};

const debug = false;

const findSolution = (
  registers: {
    regA: number;
    regB: number;
    regC: number;
  },
  program: number[]
): number[] => {
  let instructionPointer = 0;
  const output: number[] = [];
  let count = 0;
  while (instructionPointer < program.length - 1) {
    const instruction = {
      opcode: program[instructionPointer],
      operand: program[instructionPointer + 1],
    };
    if (debug) {
      console.log('#######################################', count);
      console.log(
        'opcode:',
        `${opcodeToName[instruction.opcode]} (${instruction.opcode})`,
        'operand:',
        instruction.operand,
        'Pointer:',
        instructionPointer
      );
    }
    instructionPointer = performInstruction(
      instruction,
      registers,
      output,
      instructionPointer
    );
    if (debug) {
      console.log(
        'Registers:',
        'A:',
        registers.regA,
        'B:',
        registers.regB,
        'C:',
        registers.regC
      );
    }
    if (debug) {
      console.log('Output:', output);
    }
    // if (!expectedAnswer.startsWith(output.join(','))) {
    //   break;
    // }
    count += 1;
    // if (count > 20) {
    //   throw new Error('Too many iterations');
    // }
  }

  return output;
};

const red = (str: string) => `\x1b[31m${str}\x1b[0m`;
const pad = (str: string, length: number) => {
  return str.padStart(length, ' ');
};
const diffAnswers = (a: number[], b: number[]) => {
  const str: string[] = [];
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      str.push(`${red(`${a[i]}`)}`);
    } else {
      str.push(`${a[i]}`);
    }
  }
  return str.join(',');
};

/** provide your solution as the return of this function */
export async function day17a(data: string[]) {
  console.log(data);
  const regA = parseInt(data[0].slice(12));
  const regB = parseInt(data[1].slice(12));
  const regC = parseInt(data[2].slice(12));
  const program = data[4]
    .slice(9)
    .split(',')
    .map((x) => parseInt(x));

  console.log(regA, regB, regC, program);

  let potentialIs: { i: number; same: number }[] = [];
  // const s = 202310139751076; // Math.pow(2, 45); // start for 16 output chars
  // const e = Math.pow(2, 48); // end for 16 output chars
  // let mostSame = 0;
  // let lastSame = 0;
  // const step = Math.ceil((e - s) / 1_000_000_000);
  // console.log('step', step);
  // for (let i = s; i < e; i = i + step) {
  //   const answer = findSolution({ ...registers, regA: i }, program);
  //   if (answer.length !== program.length) {
  //     throw new Error('Invalid answer length ' + answer.length);
  //   }
  //   let same = 0;
  //   for (let i = 0; i < program.length; ++i) {
  //     if (answer[answer.length - i - 1] !== program[program.length - i - 1]) {
  //       break;
  //     } else {
  //       same += 1;
  //     }
  //   }
  //   if (same > mostSame) {
  //     mostSame = same;
  //     console.log('## New record', i, 'same', same);
  //     console.log(
  //       'i',
  //       pad(`${i}`, 10),
  //       'answer',
  //       diffAnswers(answer, program),
  //       'length',
  //       answer.length,
  //       'program',
  //       program.join(',')
  //     );
  //     // if (mostSame > 7) {
  //     //   stepFactor = (stepFactor - 1) / 50 + 1;
  //     //   console.log('## New step factor', stepFactor, i * stepFactor - i);
  //     // }
  //     // potentialIsForSlicePoint.push(i);
  //   }
  //   if (lastSame !== same) {
  //     console.log('i', i, 'new same', same);
  //     potentialIs.push({ i, same });
  //   }
  //   lastSame = same;
  //   // if (
  //   //   answer.join('') === program.slice(program.length - answer.length).join('')
  //   // ) {
  //   //   potentialIsForSlicePoint.push(i);
  //   //   console.log('i', i, answer, 'last I was at', lastI, 'diff', i - lastI);
  //   //   lastI = i;
  //   // }

  //   if (i >= 202992818072106) {
  //     // the winner we know
  //     break;
  //   }
  // }

  // // look downwards as well
  // for (let i = s; i > s - 1000000000 && i > 0; i -= 32) {
  //   const answer = findSolution({ ...registers, regA: i }, program);
  //   if (
  //     answer.join('') === program.slice(program.length - answer.length).join('')
  //   ) {
  //     potentialIsForSlicePoint.push(i);
  //     console.log('i', i, answer, 'last I was at', lastI, 'diff', i - lastI);
  //     lastI = i;
  //   }
  // }

  console.log('Potential i:', potentialIs);
  // potentialIs = potentialIs.filter((p) => p.same > 7);
  potentialIs = [
    { i: 202366924884741, same: 10 },
    { i: 202430398669256, same: 5 },
    { i: 202602197327366, same: 5 },
    { i: 202641802864381, same: 10 },
    { i: 202641892241666, same: 8 },
    { i: 202962974556896, same: 5 },
    { i: 202991746442826, same: 11 },
    { i: 202992359892411, same: 9 },
    { i: 202992818099431, same: 11 },
  ];

  for (const potential of potentialIs) {
    const mostPotential = potential;

    // const mostPotential = 2944;
    const mostPotentialAnswer = findSolution(
      { regA: mostPotential.i, regB, regC },
      program
    );

    const startFrom =
      mostPotential.i *
      Math.pow(8, program.length - mostPotentialAnswer.length);
    console.log('potential', potential, 'startFrom', startFrom);

    // const ninthPower = Math.pow(2, 23);

    const a = findSolution({ regA: startFrom, regB, regC }, program);

    console.log(
      'i',
      pad(`${-1}`, 5),
      'power',
      pad(`${0}`, 16),
      'answer',
      diffAnswers(a, program),
      'length',
      a.length,
      'program',
      program.join(',')
    );

    const toCheck = 10000000;
    let i;

    for (i = startFrom; i >= startFrom - toCheck; --i) {
      const answer = findSolution({ regA: i, regB, regC }, program);
      if (answer.length === program.length) {
        if (answer.join('') === program.join('')) {
          console.log('#### ANSWER MATCHES', i);
          return i;
        }
      }
    }
    console.log(
      '#### NO ANSWER MATCHES for ---',
      startFrom,
      'to',
      startFrom - toCheck
    );

    for (i = startFrom; i < startFrom + toCheck; ++i) {
      const answer = findSolution({ regA: i, regB, regC }, program);
      if (answer.length === program.length) {
        if (answer.join('') === program.join('')) {
          console.log('#### ANSWER MATCHES', i, answer);
          return i;
        }
      }
    }

    console.log(
      '#### NO ANSWER MATCHES for +++',
      startFrom,
      'to',
      startFrom + toCheck - 1
    );
  }
  return;
}

await runSolution(day17a);
