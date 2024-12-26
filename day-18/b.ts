import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import { runSolution } from '../utils.ts';

type Pos = {
  y: number;
  x: number;
};

/** provide your solution as the return of this function */
export async function day18a(data: string[]) {
  const bytes: Pos[] = data
    .map((line) => line.split(',').map(Number))
    .map(([x, y]) => ({ y, x }));
  const MAP_SIZE = 71;
  const countOfBytes = 1024;

  function dijkstra(grid: string[][], start: Pos, end: Pos) {
    const rows = grid.length;
    const cols = grid[0].length;

    const visited = new Set<string>();
    visited.add(`${start.y},${start.x}`);

    type Node = {
      position: Pos;
      dist: number;
    };

    const minQueue = new MinPriorityQueue<Node>((e) => e.dist);
    minQueue.push({ position: start, dist: 0 });
    const neighbors: [number, number][] = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    while (minQueue.size() > 0) {
      const current = minQueue.pop()!;

      if (current.position.y === end.y && current.position.x === end.x) {
        return true;
      }

      for (const [dx, dy] of neighbors) {
        const neighborPos: Pos = {
          x: current.position.x + dx,
          y: current.position.y + dy,
        };
        if (
          neighborPos.x >= 0 &&
          neighborPos.x < cols &&
          neighborPos.y >= 0 &&
          neighborPos.y < rows &&
          grid[neighborPos.y][neighborPos.x] === '.'
        ) {
          if (!visited.has(`${neighborPos.y},${neighborPos.x}`)) {
            minQueue.push({
              position: neighborPos,
              dist: current.dist + 1,
            });
            visited.add(`${neighborPos.y},${neighborPos.x}`);
          }
        }
      }
    }

    return false;
  }

  // Example usage
  const grid: string[][] = Array.from({ length: MAP_SIZE }, () =>
    Array(MAP_SIZE).fill('.')
  );
  // add obstacles
  for (const byte of bytes.slice(0, countOfBytes)) {
    grid[byte.y][byte.x] = '#';
  }

  // const print = () => {
  //   for (let y = 0; y < MAP_SIZE; y++) {
  //     let row: string = '';
  //     for (let x = 0; x < MAP_SIZE; x++) {
  //       row += grid[y][x] === 1 ? '#' : '.';
  //     }
  //     console.log(row);
  //   }
  // };

  for (let i = countOfBytes; i < bytes.length; i++) {
    const byte = bytes[i];
    grid[byte.y][byte.x] = '#';

    const path = dijkstra(
      grid,
      { x: 0, y: 0 },
      { x: MAP_SIZE - 1, y: MAP_SIZE - 1 }
    );
    if (!path) {
      return `${byte.x},${byte.y}`;
    }
  }
  throw new Error('No solution found');
}

await runSolution(day18a);
