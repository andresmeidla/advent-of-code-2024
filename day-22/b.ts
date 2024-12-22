import { runSolution } from '../utils.ts';

/**
- Calculate the result of multiplying the secret number by 64.
  Then, mix this result into the secret number.
  Finally, prune the secret number.
- Calculate the result of dividing the secret number by 32.
  Round the result down to the nearest integer.
  Then, mix this result into the secret number.
  Finally, prune the secret number.
- Calculate the result of multiplying the secret number by 2048.
  Then, mix this result into the secret number.
  Finally, prune the secret number.
  Each step of the above process involves mixing and pruning:

- To mix a value into the secret number, calculate the bitwise XOR of the given value and the secret number.
  Then, the secret number becomes the result of that operation.
  (If the secret number is 42 and you were to mix 15 into the secret number, the secret number would become 37.)
- To prune the secret number, calculate the value of the secret number modulo 16777216.
  Then, the secret number becomes the result of that operation.
  (If the secret number is 100000000 and you were to prune the secret number, the secret number would become 16113920.)
 *
 */

const pad = (value: number, length: number) => {
  return value.toString().padStart(length, ' ');
};

/** provide your solution as the return of this function */
export async function day22a(data: string[]) {
  const initialValues = data.map((d) => parseInt(d));

  const prune = (value: number) => {
    return value % 16777216;
  };
  const mix = (value: number, secret: number) => {
    return (value ^ secret) >>> 0;
  };
  const generateNextValue = (valueIn: number) => {
    let value: number = valueIn;

    value = mix(value, value * 64);
    value = prune(value);

    value = mix(value, Math.floor(value / 32));
    value = prune(value);

    value = mix(value, value * 2048);
    value = prune(value);
    return value;
  };

  const getLast4Deltas = (deltas: number[], i: number) => {
    const last4: number[] = [];
    for (let j = 0; j < 4; j++) {
      last4.push(deltas[(i - j) % 4]);
    }
    return last4.reverse();
  };

  const map = new Map<string, Map<number, number>>();
  for (const initial of initialValues) {
    let value = initial;
    const ones = new Array(4).fill(0);
    const deltas = new Array(4).fill(0);
    for (let i = 0; i < 2000; i++) {
      value = generateNextValue(value);
      ones[i % 4] = value % 10;
      deltas[i % 4] = ones[i % 4] - ones[(i - 1) % 4];
      if (i > 3) {
        const key = getLast4Deltas(deltas, i).join(',');
        if (!map.has(key)) {
          map.set(key, new Map());
        }
        const existing = map.get(key);
        if (!existing.has(initial)) {
          existing.set(initial, value % 10);
        }
      }
    }
  }

  // find the highest value combination in the map
  const highest = map.values().reduce((acc, value) => {
    const sum = value.values().reduce((acc, v) => acc + v, 0);
    if (sum > acc) {
      return sum;
    }
    return acc;
  }, 0);

  return highest;
}

await runSolution(day22a);
