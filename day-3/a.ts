import { runSolution } from '../utils.ts';

function findMulitplications(str: string) {
  const regex = /mul\(\d{1,},\d{1,}\)/g;
  const matches = str.match(regex);
  return matches;
}

function doMultiply(str: string) {
  const numbers = str.slice(4, -1).split(',');
  return parseInt(numbers[0]) * parseInt(numbers[1]);
}

/** provide your solution as the return of this function */
export async function day3a(dataIn: string[]) {
  const data = dataIn.join();
  let sum = 0;
  const matches = findMulitplications(data);
  for (const match in matches) {
    const multiplication = doMultiply(matches[match]);
    sum += multiplication;
  }
  return sum;
}

await runSolution(day3a);
