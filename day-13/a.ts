import { runSolution } from '../utils.ts';

type Pos = {
  x: number;
  y: number;
};

type Vector = {
  x: number;
  y: number;
};

type GameConf = {
  buttonA: Vector;
  buttonB: Vector;
  prize: Pos;
};

/** provide your solution as the return of this function */
export async function day13a(data: string[]) {
  console.log(data);
  const games: GameConf[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const buttonA = data[i]
      .slice(10)
      .split(', ')
      .map((s) => s.slice(2))
      .map(Number);
    console.log('buttonA', buttonA);
    const buttonB = data[i + 1]
      .slice(10)
      .split(', ')
      .map((s) => s.slice(2))
      .map(Number);
    const prize = data[i + 2]
      .slice(7)
      .split(', ')
      .map((s) => s.slice(2))
      .map(Number);

    games.push({
      buttonA: { x: buttonA[0], y: buttonA[1] },
      buttonB: { x: buttonB[0], y: buttonB[1] },
      prize: { x: prize[0], y: prize[1] },
    });
  }

  let totalTokensSpent = 0;
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    /*for (let a = 0; a < Math.floor(game.prize.x / game.buttonA.x); a++) {
      const prizeX = game.prize.x - a * game.buttonA.x;
      const prizeY = game.prize.y - a * game.buttonA.y;

      // check if we can reach the prize with buttonB
      if (prizeX % game.buttonB.x === 0 && prizeY % game.buttonB.y === 0) {
        const b = prizeX / game.buttonB.x;
        const c = prizeY / game.buttonB.y;
        if (b === c) {
          const tokens = a * 3 + b;
          if (tokens < minTokens) {
            minTokens = tokens;
          }
        }
      }
    }*/
    const b =
      (game.prize.x * game.buttonA.y - game.prize.y * game.buttonA.x) /
      (game.buttonB.x * game.buttonA.y - game.buttonB.y * game.buttonA.x);

    const a = (game.prize.x - b * game.buttonB.x) / game.buttonA.x;

    //console.log('a', a, 'b', b);
    const spent = a * 3 + b;
    //console.log('spent', spent);

    if (Math.floor(a) === a && Math.floor(b) === b) {
      totalTokensSpent += spent;
    }
  }

  return totalTokensSpent;
}

await runSolution(day13a);
