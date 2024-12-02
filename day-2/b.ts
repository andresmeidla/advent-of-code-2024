import { runSolution } from '../utils.ts';

const parseInput = (input: string[]) => {
  return input.map((line) => {
    return line.split(' ').map((a) => {
      return parseInt(a);
    });
  });
};

const checkSafety = (report: number[]) => {
  let lastOne: number | undefined;
  let increasing: boolean | undefined;
  for (let i = 0; i < report.length; i++) {
    if (lastOne !== undefined) {
      if (increasing === undefined) {
        increasing = report[i] > lastOne;
      }

      // console.log(
      //   'i',
      //   i,
      //   'lastOne',
      //   lastOne,
      //   'increasing',
      //   increasing,
      //   'report[i]',
      //   report[i]
      // );
      if (increasing && report[i] < lastOne) {
        return false;
      }
      if (!increasing && report[i] > lastOne) {
        return false;
      }
      const diff = Math.abs(report[i] - lastOne);
      if (diff < 1 || diff > 3) {
        return false;
      }
    }

    lastOne = report[i];
  }
  return true;
};

/** provide your solution as the return of this function */
export async function day2a(data: string[]) {
  const arr = parseInput(data);
  console.log(arr);

  let count = 0;
  for (const report of arr) {
    for (let i = 0; i < report.length; ++i) {
      // remove element on index i
      const reportCopy = report.slice();
      reportCopy.splice(i, 1);
      if (checkSafety(reportCopy)) {
        count += 1;
        break; // no need to check further
      }
    }
  }

  return count;
}

await runSolution(day2a);
