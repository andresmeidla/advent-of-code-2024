import { runSolution } from '../utils.ts';

type Pos = {
  y: number;
  x: number;
  type: '.' | '#';
};

/** provide your solution as the return of this function */
export async function day20a(data: string[]) {
  let START: Pos = { x: 0, y: 0, type: '.' };
  let END: Pos = { x: 0, y: 0, type: '.' };
  const map: Pos[][] = data.map((line, y) =>
    line.split('').map((type, x) => {
      const tile = {
        type: (type === '#' ? '#' : '.') as Pos['type'],
        y,
        x,
      };
      if (type === 'S') {
        START = tile;
      } else if (type === 'E') {
        END = tile;
      }
      return tile;
    })
  );

  const red = (str: string) => `\x1b[31m${str}\x1b[0m`;
  const pad = (num: number, size: number) => {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  };
  const printMap = (map: Pos[][], path: Pos[], start: Pos, end: Pos) => {
    const set = new Set<string>(path.map((p) => `${p.y},${p.x}`));
    for (let y = 0; y < map.length; y++) {
      let row = pad(y, 3) + ' ';
      for (let x = 0; x < map[y].length; x++) {
        if (y === start.y && x === start.x) {
          row += red('S');
        } else if (y === end.y && x === end.x) {
          row += red('E');
        } else if (set.has(`${y},${x}`)) {
          row += red(map[y][x].type);
        } else {
          row += map[y][x].type;
        }
      }
      console.log(row);
    }
  };

  const getNeighbors = (pos: Pos, map: Pos[][]) => {
    const neighbors = [
      { y: -1, x: 0 }, // up
      { y: +1, x: 0 }, // down
      { y: 0, x: -1 }, // left
      { y: 0, x: +1 }, // right
    ];
    const result: Pos[] = [];
    for (const { y, x } of neighbors) {
      const ny = pos.y + y;
      const nx = pos.x + x;
      if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length) {
        continue;
      }
      result.push(map[ny][nx]);
    }
    return result;
  };

  const dfs = (map: Pos[][], start: Pos, end: Pos) => {
    type Node = { pos: Pos; parent: Node };
    const visited = new Set<string>();
    const stack: Node[] = [{ pos: start, parent: undefined }];
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current.pos === end) {
        const path: Pos[] = [];
        let node: Node | undefined = current;
        while (node) {
          path.push(node.pos);
          node = node.parent;
        }
        return path.reverse();
      }
      const neighbors = getNeighbors(current.pos, map);
      for (const neighbor of neighbors) {
        if (
          neighbor.type === '.' &&
          !visited.has(`${neighbor.y},${neighbor.x}`)
        ) {
          stack.push({
            pos: neighbor,
            parent: current,
          });
          visited.add(`${current.pos.y},${current.pos.x}`);
        }
      }
    }
    throw new Error('No path found');
  };

  const distanceBetween = (a: Pos, b: Pos) => {
    const dy = Math.abs(a.y - b.y);
    const dx = Math.abs(a.x - b.x);
    return dy + dx;
  };

  const pathMap = new Map<string, number>();
  let cheatMap = new Map<number, number>();
  const fullPath = dfs(map, START, END);
  const fullDist = fullPath.length;
  printMap(map, fullPath, START, END);

  const CHEAT_COUNT = 2;
  console.log(fullPath.length);
  for (let i = 0; i < fullPath.length - 1; i++) {
    const start = fullPath[i];
    pathMap.set(`${start.y},${start.x}`, fullDist - i);
  }
  for (let i = 0; i < fullPath.length - 1; i++) {
    const start = fullPath[i];
    for (let j = i + 1; j < fullPath.length; j++) {
      const end = fullPath[j];
      const distance = distanceBetween(start, end);
      if (distance <= CHEAT_COUNT) {
        const cheatPathLength = i + distance + (fullDist - j);
        if (cheatPathLength < fullDist) {
          // console.log(`cheat path: ${cheatPathLength}`);
          const cheatLength = fullDist - cheatPathLength;
          cheatMap.set(cheatLength, (cheatMap.get(cheatLength) ?? 0) + 1);
        }
      }
    }
  }
  // sort cheatMap by value
  cheatMap = new Map([...cheatMap.entries()].sort((a, b) => b[0] - a[0]));

  let result = 0;
  for (const [key, value] of cheatMap) {
    console.log(`There are ${value} cheats that save ${key} picoseconds.`);
    if (key >= 100) {
      console.log('Total:', value * key);
      result += value;
    }
  }

  return result;
}

await runSolution(day20a);
