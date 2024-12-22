import { runSolution } from '../utils.ts';

/** provide your solution as the return of this function */
export async function day19a(data: string[]) {
  // console.log(data);

  const towels = data[0].split(', ');

  const patterns = data.slice(2);

  console.log(towels);
  console.log(patterns);

  const findCombinations = (
    pattern: string,
    level: number,
    countMap: Map<string, number>
  ) => {
    if (countMap.has(pattern)) {
      return countMap.get(pattern);
    }
    // try to find a towel that could start the pattern
    let combinations = 0;
    for (const towel of towels) {
      if (pattern.startsWith(towel)) {
        const remainingPattern = pattern.slice(towel.length);
        const remainingCombinations =
          remainingPattern.length > 0
            ? findCombinations(remainingPattern, level + 1, countMap)
            : 1;
        if (
          remainingPattern.length === 0 ||
          (remainingCombinations > 0 && remainingPattern.length > 0)
        ) {
          combinations += remainingCombinations ?? 1;
        }
      }
    }
    countMap.set(pattern, combinations);
    return combinations;
  };

  const countMap = new Map<string, number>();
  for (const towel of towels) {
    findCombinations(towel, 0, countMap);
  }

  const dp2 = (pattern: string, level: number) => {
    // start from the end of the pattern 1 char at a time
    for (let i = pattern.length - 1; i >= 0; --i) {
      findCombinations(pattern.slice(i), level + 1, countMap);
    }
    return countMap.get(pattern);
  };

  let result = 0;
  for (const pattern of patterns) {
    const combinations = dp2(pattern, 0);
    console.log(pattern, combinations);
    result += combinations;
  }

  return result;
}

await runSolution(day19a);
