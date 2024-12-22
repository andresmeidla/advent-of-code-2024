import { runSolution } from '../utils.ts';

/** provide your solution as the return of this function */
export async function day19a(data: string[]) {
  // console.log(data);

  const towels = data[0].split(', ');

  const patterns = data.slice(2);

  console.log(towels);
  console.log(patterns);

  const towelSet = new Map<string, number>();
  towels.forEach((t) => towelSet.set(t, 1));

  const dp = (pattern: string, level: number) => {
    if (towelSet.has(pattern)) {
      return towelSet.get(pattern);
    } else if (pattern.length > 1) {
      for (let i = 1; i < pattern.length; ++i) {
        const left = pattern.slice(0, i);
        const right = pattern.slice(i);
        const leftPossible = dp(left, level + 1);
        const rightPossible = dp(right, level + 1);
        towelSet.set(left, leftPossible);
        towelSet.set(right, rightPossible);
        if (leftPossible && rightPossible) {
          return 1;
        }
      }
    }
    return 0;
  };
  let result = 0;
  for (const pattern of patterns) {
    const isPossible = dp(pattern, 0);
    console.log(pattern, isPossible);
    if (isPossible) {
      ++result;
    }
  }

  return result;
}

await runSolution(day19a);
