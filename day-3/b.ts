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

function prepareDosAndDonts(str: string) {
  let enabled = true;
  let currentIndex = 0;

  let filtered = '';
  let dontIndex = -1;
  while ((dontIndex = str.indexOf("don't()", currentIndex)) !== -1) {
    if (enabled) {
      // include the part of the string before the dont
      filtered += str.slice(currentIndex, dontIndex + 7);
    }
    enabled = false;

    // find the next do()
    const doIndex = str.indexOf('do()', dontIndex);
    if (doIndex === -1) {
      break;
    }

    // set the current index to the end of the do
    currentIndex = doIndex;
    enabled = true;
  }
  if (enabled) {
    // include the last part of the string
    filtered += str.slice(currentIndex);
  }
  return filtered;
}

/** provide your solution as the return of this function */
export async function day3a(dataIn: string[]) {
  // console.log(dataIn);
  let sum = 0;
  const data = dataIn.join();

  const filtered = prepareDosAndDonts(data);

  const matches = findMulitplications(filtered);
  // console.log(matches);
  for (const match in matches) {
    const multiplication = doMultiply(matches[match]);
    sum += multiplication;
  }

  return sum;
}

await runSolution(day3a);
