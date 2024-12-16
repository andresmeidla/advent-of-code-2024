import { runSolution } from '../utils.ts';

type MapNode = {
  x: number;
  y: number;
  type: '#' | '.';
};

type Box = {
  x: number;
  y: number;
};

type Move = '<' | '>' | '^' | 'v';

const red = (text: string) => `\x1b[31m${text}\x1b[0m`;

const printMap = (
  map: MapNode[][],
  robotPos: { x: number; y: number },
  boxMap: Map<string, Box>
) => {
  let str = '';
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const node = map[y][x];
      if (robotPos.x === x && robotPos.y === y) {
        str += red('@');
      } else if (boxMap.has(`${y},${x}`)) {
        str += 'O';
      } else {
        str += node.type;
      }
    }
    str += '\n';
  }
  console.log(str);
};

/** provide your solution as the return of this function */
export async function day15a(data: string[]) {
  console.log(data);
  const map: MapNode[][] = [];
  const boxes: Box[] = [];
  const boxMap = new Map<string, Box>();
  let y;
  let start: { x: number; y: number };
  for (y = 0; y < data.length; y++) {
    if (data[y].length === 0) break;
    const row = data[y].split('');
    map.push([]);
    for (let x = 0; x < row.length; x++) {
      if (row[x] === 'O') {
        boxes.push({ y, x });
        boxMap.set(`${y},${x}`, boxes[boxes.length - 1]);
      } else if (row[x] === '@') {
        start = { y, x };
      }
      map[y].push({ y, x, type: row[x] === '#' ? '#' : '.' });
    }
  }
  const moves: Move[] = [];
  for (y = y + 1; y < data.length; y++) {
    moves.push(...(data[y].split('') as Move[]));
  }

  console.log(map);
  console.log(boxes);
  console.log(moves);
  console.log(start);

  printMap(map, start, boxMap);

  const nextMovePos = (pos: { y: number; x: number }, move: Move) => {
    switch (move) {
      case '<':
        return { y: pos.y, x: pos.x - 1 };
      case '>':
        return { y: pos.y, x: pos.x + 1 };
      case '^':
        return { y: pos.y - 1, x: pos.x };
      case 'v':
        return { y: pos.y + 1, x: pos.x };
    }
  };

  const tryToMoveBoxes = (
    map: MapNode[][],
    pos: { x: number; y: number },
    boxMap: Map<string, Box>,
    move: Move
  ) => {
    const boxesThatCanBeMoved: Box[] = [];
    let currentPos = { ...pos };
    if (map[currentPos.y][currentPos.x].type === '#') {
      throw new Error('robot is in a wall');
    }
    while (map[currentPos.y][currentPos.x].type !== '#') {
      if (boxMap.has(`${currentPos.y},${currentPos.x}`)) {
        boxesThatCanBeMoved.push(boxMap.get(`${currentPos.y},${currentPos.x}`));
      } else if (map[currentPos.y][currentPos.x].type === '.') {
        // we can move the boxes
        return boxesThatCanBeMoved;
      }
      currentPos = nextMovePos(currentPos, move);
    }
    return null;
  };

  const currentPos = start;
  for (const move of moves) {
    console.log(move);
    // get a list of all boxes that might be moved
    const nextPos = nextMovePos(currentPos, move);
    if (map[nextPos.y][nextPos.x].type === '#') {
      // console.log('hit wall');
      continue;
    }
    const result = tryToMoveBoxes(map, nextPos, boxMap, move);
    // console.log(result);
    if (Array.isArray(result)) {
      // move the boxes
      for (const box of result) {
        const nextBoxPos = nextMovePos(box, move);
        box.x = nextBoxPos.x;
        box.y = nextBoxPos.y;
      }
      // update the boxMap
      boxMap.clear();
      for (const box of boxes) {
        boxMap.set(`${box.y},${box.x}`, box);
      }

      // move the robot
      currentPos.x = nextPos.x;
      currentPos.y = nextPos.y;
    } else {
      // console.log('hit wall');
    }
    printMap(map, currentPos, boxMap);
  }
  let sum = 0;
  // calculate the sum
  for (const box of boxes) {
    sum += 100 * box.y + box.x;
  }

  return sum;
}

await runSolution(day15a);
