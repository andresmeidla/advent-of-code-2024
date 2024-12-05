import { runSolution } from '../utils.ts';

const compareArrayOrder = (a: number[], b: number[]) => {
  // check whether the arrays are equal
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

/** provide your solution as the return of this function */
export async function day5a(data: string[]) {
  console.log(data);
  const rules: Array<[number, number]> = [];
  const sequences: Array<number[]> = [];
  let mode: 'rules' | 'sequences' = 'rules';
  for (const line of data) {
    if (mode === 'rules') {
      if (line === '') {
        mode = 'sequences';
        continue;
      }
      const [first, second] = line.split('|');

      rules.push([parseInt(first), parseInt(second)]);
    } else {
      sequences.push(line.split(',').map(Number));
    }
  }
  console.log(rules);
  console.log(sequences);

  const rulesMap = new Map<string, number>();
  for (const [first, second] of rules) {
    rulesMap.set(`${first},${second}`, -1);
    rulesMap.set(`${second},${first}`, 1);
  }

  const sortingAlgo = (a: number, b: number) => {
    const val = rulesMap.has(`${a},${b}`) ? rulesMap.get(`${a},${b}`) : 0;
    return val;
  };

  let sum = 0;
  for (const sequence of sequences) {
    const sorted = [...sequence].sort(sortingAlgo);
    console.log('Initial:', sequence, 'Sorted:', sorted);
    if (compareArrayOrder(sequence, sorted)) {
      console.log('YES');
    } else {
      console.log('NO');
      sum += sorted[Math.floor(sorted.length / 2)];
    }
  }
  return sum;
}

await runSolution(day5a);
