import { runSolution } from '../utils.ts';

type Equation = {
  result: number;
  values: number[];
};

const evaluate = (values: number[], operators: string) => {
  let result = values[0];
  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i];
    const value = values[i + 1];
    if (operator === '+') {
      result += value;
    } else if (operator === '*') {
      result *= value;
    } else if (operator === '|') {
      result = parseInt(`${result}${value}`);
    }
  }
  return result;
};

const solve = (eq: Equation) => {
  // possible operators are + and *
  // we have to try all possible combinations of operators between the numbers
  // by keeping the order of the numbers the same and evaluation from left to right regardless of operator precedence
  // then we have to return the result of the equation

  // we generate all the possible combinations of operators
  // then we evaluate the equation with each combination

  const operators = ['+', '*', '|'];
  const operatorCombinations: string[] = [];
  const recursive = (index: number, current: string) => {
    if (index === eq.values.length - 1) {
      operatorCombinations.push(current);
      return;
    }
    for (const operator of operators) {
      recursive(index + 1, current + operator);
    }
  };
  recursive(0, '');

  // console.log('operatorCombinations', operatorCombinations);
  // try them all
  for (const combination of operatorCombinations) {
    // console.log(eq.result, 'combination:', combination, 'values', eq.values);
    const result = evaluate(eq.values, combination);
    // console.log('result:', result);
    if (result === eq.result) {
      //console.log('FOUND IT!');
      return true;
    }
  }
};

/** provide your solution as the return of this function */
export async function day7a(data: string[]) {
  console.log(data);
  const equations: Equation[] = data.map((line) => {
    const [resultStr, others] = line.split(':');
    const result = parseInt(resultStr);
    const values = others
      .split(' ')
      .filter((n) => !!n)
      .map((v) => parseInt(v));
    return { result, values };
  });
  console.log(equations);
  let sum = 0;
  for (const eq of equations) {
    const result = solve(eq);
    if (result) {
      sum += eq.result;
    }
  }
  return sum;
}

await runSolution(day7a);
