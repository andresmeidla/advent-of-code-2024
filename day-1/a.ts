import { runSolution } from '../utils.ts';

const output = (a: number[], b: number[]) => {
  let str = '';
  for (let i = 0; i < a.length; i++) {
    str += `${a[i]} ${b[i]}\n`;
  }

  console.log(str);
};

const parseInput = (data: string[]) => {
  // console.log(data);
  const [a, b] = data.reduce(
    ([a, b], x) => {
      const spaceAt = x.indexOf(' ');
      a.push(parseInt(x.slice(0, spaceAt)));
      b.push(parseInt(x.slice(spaceAt + 1)));
      return [a, b];
    },
    [[] as number[], [] as number[]]
  );

  output(a, b);

  return [a, b];
};

const calcDistance = (a: number[], b: number[]) => {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const dist = Math.abs(a[i] - b[i]);
    sum += dist;
  }
  return sum;
};

/** provide your solution as the return of this function */
export async function day1a(data: string[]) {
  const [a, b] = parseInput(data);

  // sort the arrays
  a.sort((x, y) => x - y);
  b.sort((x, y) => x - y);

  output(a, b);
  const distance = calcDistance(a, b);

  return distance;
}

await runSolution(day1a);
