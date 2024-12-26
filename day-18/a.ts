import { runSolution } from '../utils.ts';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

type Pos = {
  y: number;
  x: number;
};

/** provide your solution as the return of this function */
export async function day18a(data: string[]) {
  console.log(data);
  const bytes: Pos[] = data
    .map((line) => line.split(',').map(Number))
    .map(([x, y]) => ({ y, x }));
  // console.log(bytes);
  const MAP_SIZE = 71;
  const countOfBytes = 1024;

  function dijkstra(grid: ('.' | '#')[][], start: Pos, end: Pos) {
    interface Node {
      position: Pos;
      dist: number;
    }
    const rows = grid.length;
    const cols = grid[0].length;

    const visited = new Set<string>();
    visited.add(`${start.y},${start.x}`);

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
        return current.dist;
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

    return Infinity;
  }

  // Example usage
  const grid: ('.' | '#')[][] = Array.from({ length: MAP_SIZE }, () =>
    Array(MAP_SIZE).fill('.')
  );
  // add obstacles
  for (const byte of bytes.slice(0, countOfBytes)) {
    grid[byte.y][byte.x] = '#';
  }

  for (let y = 0; y < MAP_SIZE; y++) {
    let row: string = '';
    for (let x = 0; x < MAP_SIZE; x++) {
      row += grid[y][x];
    }
    console.log(row);
  }

  const path = dijkstra(
    grid,
    { y: 0, x: 0 },
    { y: MAP_SIZE - 1, x: MAP_SIZE - 1 }
  );
  console.log('path:', path);

  return path;
}

await runSolution(day18a);
