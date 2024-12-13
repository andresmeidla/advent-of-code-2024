import { runSolution } from '../utils.ts';

/** provide your solution as the return of this function */
export async function day11a(data: string[]) {
  console.log(data);
  const numbers = data[0].split(' ').map((d) => parseInt(d, 10));
  console.log(numbers);

  /*const blink = (arr: number[]) => {
    const newArrangement = [];
    for (const num of arr) {
      if (num === 0) {
        newArrangement.push(1);
      } else if (String(num).length % 2 === 0) {
        const half = String(num).length / 2;
        newArrangement.push(parseInt(String(num).slice(0, half)));
        newArrangement.push(parseInt(String(num).slice(half)));
      } else {
        newArrangement.push(num * 2024);
      }
    }
    return newArrangement;
  };*/

  // const sum = 0;

  const arrangement = [...numbers];

  const BLINK_COUNT = 75;
  /*const HALWAY = 39;

  // we blink 39 times to get to the halfway point
  // 39 is chosen because after that we will blow up our memory :)
  for (let i = 0; i < HALWAY; ++i) {
    arrangement = blink(arrangement);
  }

  console.log(arrangement.length);

  // we blink 36 more times to get to the end
  // we cache the lengths of the "sub-arrangements" each number produces after 36 blinks
  const cache = new Map<number, number>();

  for (let i = 0; i < arrangement.length; ++i) {
    let arrangementLength: number;
    if (cache.has(arrangement[i])) {
      arrangementLength = cache.get(arrangement[i]);
      // console.log('Got', newArrangement[i], '->', len);
    } else {
      let subArrangement = [arrangement[i]];

      for (let i = HALWAY; i < BLINK_COUNT; ++i) {
        subArrangement = blink(subArrangement);
      }
      arrangementLength = subArrangement.length;
      cache.set(arrangement[i], arrangementLength);
      console.log('SETTING', arrangement[i], '->', arrangementLength);
    }

    sum += arrangementLength;

    if (i % 1000 === 0) {
      // to keep track of progress
      console.log(i);
    }
  }*/

  const arrangementToMap = (arr: number[]) => {
    const map = new Map<number, number>();
    for (const num of arr) {
      if (map.has(num)) {
        map.set(num, map.get(num) + 1);
      } else {
        map.set(num, 1);
      }
    }
    return map;
  };

  let cache = arrangementToMap(arrangement);
  const blinkMap = (map: Map<number, number>) => {
    // for each number in the map, we calculate the new number of times it appears
    const newMap = new Map<number, number>();
    for (const [num, count] of map) {
      if (num === 0) {
        newMap.set(1, count + (newMap.get(1) || 0));
      } else if (String(num).length % 2 === 0) {
        const half = String(num).length / 2;
        const numStr = String(num);
        const firstHalf = parseInt(numStr.slice(0, half));
        const secondHalf = parseInt(numStr.slice(half));
        newMap.set(firstHalf, (newMap.get(firstHalf) || 0) + count);
        newMap.set(secondHalf, (newMap.get(secondHalf) || 0) + count);
      } else {
        newMap.set(num * 2024, count + (newMap.get(num * 2024) || 0));
      }
    }
    return newMap;
  };

  const countArrangementLength = (map: Map<number, number>) => {
    let sum = 0;
    for (const [num, count] of map) {
      sum += count;
    }
    return sum;
  };

  for (let i = 0; i < BLINK_COUNT; ++i) {
    cache = blinkMap(cache);
  }

  return countArrangementLength(cache);
}

await runSolution(day11a);
