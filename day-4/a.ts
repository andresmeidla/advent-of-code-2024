import { runSolution } from '../utils.ts';

function findLeftToRight(str: string[]) {
  let sum = 0;
  for (const line of str) {
    const regex = /XMAS/g;
    const matches = line.match(regex);
    if (matches) {
      console.log('matches', matches);
      sum += matches.length;
    }
  }
  return sum;
}

function createTopToBottom(str: string[]) {
  const strings = [];
  for (let x = 0; x < str[0].length; x++) {
    let newStr = '';
    for (let y = 0; y < str.length; y++) {
      newStr += str[y][x];
    }
    strings.push(newStr);
  }
  return strings;
}

function createDiagonalStrings(str: string[]) {
  const diags: string[] = [];
  const yLen = str.length;
  const xLen = str[0].length;

  // left to right and down
  // first we look at the left side of the grid
  for (let y = 0; y < yLen; y++) {
    let diag = '';
    if (y + 3 < yLen) {
      for (let x = 0; x < xLen; x++) {
        if (x + y < yLen) {
          diag += str[y + x][x];
        }
      }
      diags.push(diag);
    }
  }
  // then we look at the top of the grid
  for (let x = 1; x < xLen; x++) {
    let diag = '';
    if (x + 3 < xLen) {
      for (let y = 0; y < yLen; y++) {
        if (x + y < xLen) {
          diag += str[y][x + y];
        }
      }
      diags.push(diag);
    }
  }

  return diags;
}

/** provide your solution as the return of this function */
export async function day4a(dataIn: string[]) {
  const data = dataIn.filter((d) => d.length > 0);
  console.log(data.join('\n') + '\n');
  let sum = 0;
  {
    const s = findLeftToRight(data);
    console.log('left to right', s);
    sum += s;
  }
  {
    const reversed = data.map((d) => d.split('').reverse().join(''));
    const s = findLeftToRight(reversed);
    console.log('right to left', s);
    sum += s;
  }
  {
    const topToBottom = createTopToBottom(data);
    const s = findLeftToRight(topToBottom);
    console.log('top to bottom', s);
    sum += s;
  }
  {
    const reversed = createTopToBottom(data).map((d) =>
      d.split('').reverse().join('')
    );
    const s = findLeftToRight(reversed);
    console.log('bottom to top', s);
    sum += s;
  }
  const diags = createDiagonalStrings(data);
  const otherDiags = createDiagonalStrings(
    data.map((d) => d.split('').reverse().join(''))
  );
  {
    const s = findLeftToRight(diags);
    console.log('diags left to right and down', s);
    sum += s;
  }
  {
    const s = findLeftToRight(otherDiags);
    console.log('diags right to left and down', s);
    sum += s;
  }
  {
    const s = findLeftToRight(diags.map((d) => d.split('').reverse().join('')));
    console.log('diags left to right and up', s);
    sum += s;
  }
  {
    const s = findLeftToRight(
      otherDiags.map((d) => d.split('').reverse().join(''))
    );
    console.log('diags right to left and up', s);
    sum += s;
  }
  return sum;
}

await runSolution(day4a);
