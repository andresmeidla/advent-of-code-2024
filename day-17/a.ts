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

/** provide your solution as the return of this function */
export async function day17a(data: string[]) {
  console.log(data);
  let regA = parseInt(data[0].slice(12));
  let regB = parseInt(data[1].slice(12));
  let regC = parseInt(data[2].slice(12));
  const program = data[4]
    .slice(9)
    .split(',')
    .map((x) => parseInt(x));

  console.log(regA, regB, regC, program);

  const operandValue = (operand: number) => {
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

  const output: number[] = [];
  let instructionPointer = 0;

  const performInstruction = (instruction: {
    opcode: number;
    operand: number;
  }) => {
    switch (instruction.opcode) {
      case 0: {
        // adv (division)
        const numerator = regA;
        const denominator = Math.pow(2, operandValue(instruction.operand));
        const division = Math.floor(numerator / denominator);
        regA = division;
        break;
      }
      case 1: {
        // bxl (bitwise XOR)
        const leftSide = regB;
        const rightSide = instruction.operand;
        regB = leftSide ^ rightSide;
        break;
      }
      case 2: {
        // bst (mod 8)
        const value = operandValue(instruction.operand) % 8;
        regB = value;
        break;
      }
      case 3: {
        // jnz (jump if not zero)
        if (regA !== 0) {
          instructionPointer = instruction.operand;
          return;
        }
        break;
      }
      case 4: {
        // bxc (bitwise XOR)
        const leftSide = regB;
        const rightSide = regC;
        regB = leftSide ^ rightSide;
        break;
      }
      case 5: {
        // out
        output.push(operandValue(instruction.operand) % 8);
        break;
      }
      case 6: {
        // bdv
        const numerator = regA;
        const denominator = Math.pow(2, operandValue(instruction.operand));
        const division = Math.floor(numerator / denominator);
        regB = division;
        break;
      }
      case 7: {
        // cdv
        const numerator = regA;
        const denominator = Math.pow(2, operandValue(instruction.operand));
        const division = Math.floor(numerator / denominator);
        regC = division;
        break;
      }
      default: {
        throw new Error('Invalid opcode');
      }
    }
    instructionPointer += 2;
  };

  let count = 0;

  while (instructionPointer < program.length - 1) {
    const instruction = {
      opcode: program[instructionPointer],
      operand: program[instructionPointer + 1],
    };
    console.log('#######################################', count);
    console.log(
      'opcode:',
      `${opcodeToName[instruction.opcode]} (${instruction.opcode})`,
      'operand:',
      instruction.operand,
      'Pointer:',
      instructionPointer
    );
    performInstruction(instruction);
    console.log('Registers:', 'A:', regA, 'B:', regB, 'C:', regC);
    console.log('Output:', output);
    count += 1;
    // if (count > 20) {
    //   throw new Error('Too many iterations');
    // }
  }

  const answer = output.join(',');
  console.log(
    'FINAL OUTPUT:',
    answer,
    output.length,
    program.join(','),
    program.length
  );

  return answer;
}

await runSolution(day17a);
