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
/** provide your solution as the return of this function */
export async function day22a(data: string[]) {
  console.log(data);
  const initialValues = data.map((d) => parseInt(d));
  console.log(initialValues);

  const prune = (value: number) => {
    return value % 16777216;
  };
  const mix = (value: number, secret: number) => {
    return (value ^ secret) >>> 0;
  };
  const generateNextValue = (valueIn: number) => {
    // - Calculate the result of multiplying the secret number by 64.
    //   Then, mix this result into the secret number.
    //   Finally, prune the secret number.
    let value: number = valueIn;

    value = mix(value, value * 64);
    value = prune(value);

    value = mix(value, Math.floor(value / 32));
    value = prune(value);

    value = mix(value, value * 2048);
    value = prune(value);
    return value;
  };

  let result = 0;
  for (const initial of initialValues) {
    let value = initial;
    for (let i = 0; i < 2000; i++) {
      value = generateNextValue(value);
    }
    console.log(`${initial}: ${value}`);
    result += value;
  }

  return result;
}

await runSolution(day22a);
