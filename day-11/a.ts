import { runSolution } from '../utils.ts';

/** provide your solution as the return of this function */
export async function day11a(data: string[]) {
  console.log(data);
  const numbers = data[0].split(' ').map((d) => parseInt(d, 10));
  console.log(numbers);

  let arrangement = [...numbers];
  const blink = () => {
    const newArrangement = [];
    for (const num of arrangement) {
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
    arrangement = newArrangement;
  };

  for (let i = 0; i < 25; i++) {
    blink();
    //console.log(arrangement);
  }

  return arrangement.length;
}

await runSolution(day11a);
