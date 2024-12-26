import { runSolution } from '../utils.ts';

/** provide your solution as the return of this function */
export async function day25a(data: string[]) {
  // console.log(data);

  const keys: string[][] = [];
  const locks: string[][] = [];

  let index = 0;
  let arr: typeof keys | typeof locks = keys;
  for (let i = 0; i < data.length; i++) {
    const line = data[i];
    if (line.length === 0) {
      index = 0;
      if (arr === keys) {
        arr[arr.length - 1].pop(); // remove the last line with all #-s
      }
      continue;
    }
    if (index === 0) {
      arr = line.includes('#') ? locks : keys;
      arr.push([]);
    } else {
      arr[arr.length - 1].push(line.slice());
    }
    index++;
  }

  // console.log('keys');
  // console.log(keys.map((k) => k.join('\n')).join('\n\n'));

  function transpose(matrix: string[][]) {
    const transposedArray: string[][][] = new Array(matrix.length);
    for (let i = 0; i < matrix.length; i++) {
      const pins = matrix[0][0].length;
      transposedArray[i] = new Array(pins);
      for (let y = 0; y < pins; y++) {
        transposedArray[i][y] = new Array(matrix[0].length);
        for (let x = 0; x < matrix[0].length; x++) {
          transposedArray[i][y][x] = matrix[i][x][y];
        }
      }
    }

    return transposedArray.map((a) => a.map((b) => b.join('')));
  }

  // transpose all the locks
  const transposedLocks: string[][] = transpose(locks);
  const lockPinLengths = transposedLocks.map((l) =>
    l.map((p) => p.split('').filter((c) => c === '#').length)
  );

  const transposedKeys: string[][] = transpose(keys);
  const keyPinLengths = transposedKeys.map((l) =>
    l.map((p) => p.split('').filter((c) => c === '#').length)
  );

  const KEY_HOLE_LENGTH = 5;

  let keysThatFit: number = 0;
  keyPinLengths.forEach((key) => {
    lockPinLengths.forEach((lock) => {
      if (key.every((k, i) => k + lock[i] <= KEY_HOLE_LENGTH)) {
        keysThatFit++;
      }
    });
  });

  return keysThatFit;
}

await runSolution(day25a);
