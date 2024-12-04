import { runSolution } from '../utils.ts';

function findMAS(str: string[], x: number, y: number) {
  // the MAX needs to be in a X formation like this:
  // M_S
  // _A_
  // M_S
  // there needs to be 3 characters to the right and 3 characters down for a possible formation

  if (
    str[y][x] === 'M' &&
    str[y][x + 2] === 'S' &&
    str[y + 1][x + 1] === 'A' &&
    str[y + 2][x] === 'M' &&
    str[y + 2][x + 2] === 'S'
  ) {
    return 1;
  }

  if (
    str[y][x] === 'M' &&
    str[y][x + 2] === 'M' &&
    str[y + 1][x + 1] === 'A' &&
    str[y + 2][x] === 'S' &&
    str[y + 2][x + 2] === 'S'
  ) {
    return 2;
  }

  if (
    str[y][x] === 'S' &&
    str[y][x + 2] === 'S' &&
    str[y + 1][x + 1] === 'A' &&
    str[y + 2][x] === 'M' &&
    str[y + 2][x + 2] === 'M'
  ) {
    return 3;
  }

  if (
    str[y][x] === 'S' &&
    str[y][x + 2] === 'M' &&
    str[y + 1][x + 1] === 'A' &&
    str[y + 2][x] === 'S' &&
    str[y + 2][x + 2] === 'M'
  ) {
    return 4;
  }

  return 0;
}

function findAllMAS(str: string[]) {
  let sum = 0;
  for (let y = 0; y < str.length; y++) {
    for (let x = 0; x < str[0].length; x++) {
      // there needs to be 3 characters to the right and 3 characters down for a possible formation
      if (x + 2 < str[0].length && y + 2 < str.length) {
        let a;
        if ((a = findMAS(str, x, y)) > 0) {
          console.log('FOUND MAS y', y, 'x', x, 'a', a);
          sum++;
        }
      }
    }
  }
  return sum;
}

/** provide your solution as the return of this function */
export async function day4b(data: string[]) {
  console.log(data.join('\n') + '\n');
  const sum = findAllMAS(data);

  return sum;
}

await runSolution(day4b);
