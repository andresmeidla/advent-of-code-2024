import { runSolution } from '../utils.ts';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

type Pos = {
  y: number;
  x: number;
};

type Edge = {
  to: Node;
  distance: number;
};

// type Node = {
//   pos: Pos;
//   neighbors: Edge[];
// };

/** provide your solution as the return of this function */
export async function day18a(data: string[]) {
  console.log(data);
  const bytes: Pos[] = data
    .map((line) => line.split(',').map(Number))
    .map(([x, y]) => ({ y, x }));
  // console.log(bytes);
  const MAP_SIZE = 71;
  const countOfBytes = 1024;

  interface Node {
    position: [number, number];
    dist: number;
    parent: Node | null;
  }

  function dijkstra(
    grid: ('.' | '#')[][],
    start: [number, number],
    end: [number, number]
  ): [number, number][] | null {
    const rows = grid.length;
    const cols = grid[0].length;
    const startNode: Node = { position: start, dist: 0, parent: null };

    const visited: Map<string, number> = new Map();
    visited.set(start.toString(), 0);

    const minQueue = new MinPriorityQueue<Node>((e) => e.dist);
    minQueue.push(startNode);
    const neighbors: [number, number][] = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    while (minQueue.size() > 0) {
      const current = minQueue.pop()!;

      if (current.position[0] === end[0] && current.position[1] === end[1]) {
        const path: [number, number][] = [];
        let temp: Node | null = current;
        while (temp) {
          path.push(temp.position);
          temp = temp.parent;
        }
        return path.reverse();
      }

      for (const [dx, dy] of neighbors) {
        const neighborPos: [number, number] = [
          current.position[0] + dx,
          current.position[1] + dy,
        ];
        if (
          neighborPos[0] >= 0 &&
          neighborPos[0] < rows &&
          neighborPos[1] >= 0 &&
          neighborPos[1] < cols &&
          grid[neighborPos[0]][neighborPos[1]] === '.'
        ) {
          const dist =
            (visited.get(current.position.toString()) ?? Infinity) + 1;
          if (dist < (visited.get(neighborPos.toString()) ?? Infinity)) {
            visited.set(neighborPos.toString(), dist);
            minQueue.push({
              position: neighborPos,
              dist: dist,
              parent: current,
            });
          }
        }
      }
    }

    return null;
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

  const start: [number, number] = [0, 0];
  const goal: [number, number] = [MAP_SIZE - 1, MAP_SIZE - 1];
  const path = dijkstra(grid, start, goal);
  console.log('path:', path.join(' -> '));

  return path.length - 1;

  // const map: Pos[][] = [];
  // for (let y = 0; y < MAP_SIZE; y++) {
  //   const row: Pos[] = [];
  //   for (let x = 0; x < MAP_SIZE; x++) {
  //     row.push({ y, x });
  //   }
  //   map.push(row);
  // }

  // const key = (pos: Pos) => `${pos.y},${pos.x}`;
  // // console.log(map);

  // const byteSet: Set<string> = new Set(bytes.slice(0, countOfBytes).map(key));
  // // console.log(byteSet);

  // const getNeighbors = (pos: Pos, map: Pos[][], byteSet: Set<string>) => {
  //   const neighbors: Pos[] = [];
  //   // down
  //   if (pos.y < MAP_SIZE - 1 && !byteSet.has(key(map[pos.y + 1][pos.x]))) {
  //     neighbors.push(map[pos.y + 1][pos.x]);
  //   }
  //   // right
  //   if (pos.x < MAP_SIZE - 1 && !byteSet.has(key(map[pos.y][pos.x + 1]))) {
  //     neighbors.push(map[pos.y][pos.x + 1]);
  //   }
  //   // left
  //   if (pos.x > 0 && !byteSet.has(key(map[pos.y][pos.x - 1]))) {
  //     neighbors.push(map[pos.y][pos.x - 1]);
  //   }
  //   // up
  //   if (pos.y > 0 && !byteSet.has(key(map[pos.y - 1][pos.x]))) {
  //     neighbors.push(map[pos.y - 1][pos.x]);
  //   }

  //   return neighbors;
  // };

  // const createGraph = (map: Pos[][]) => {
  //   const nodes: Node[][] = [];
  //   for (let y = 0; y < map.length; y++) {
  //     for (let x = 0; x < map[y].length; x++) {
  //       if (!nodes[y]) {
  //         nodes[y] = [];
  //       }
  //       nodes[y].push({
  //         pos: map[y][x],
  //         neighbors: [],
  //       });
  //     }
  //   }
  //   for (let y = 0; y < map.length; y++) {
  //     for (let x = 0; x < map[y].length; x++) {
  //       if (!byteSet.has(key(map[y][x]))) {
  //         const neighbors = getNeighbors(map[y][x], map, byteSet);
  //         nodes[y][x].neighbors = neighbors.map((n) => ({
  //           to: nodes[n.y][n.x],
  //           distance: 1,
  //         }));
  //       }
  //     }
  //   }
  //   return nodes;
  // };

  // const printMap = (map: Pos[][], byteSet: Set<string>) => {
  //   for (let y = 0; y < map.length; y++) {
  //     let row = '';
  //     for (let x = 0; x < map[y].length; x++) {
  //       if (byteSet.has(key(map[y][x]))) {
  //         row += '#';
  //       } else {
  //         row += '.';
  //       }
  //     }
  //     console.log(row);
  //   }
  // };

  // printMap(map, byteSet);

  // const nodes = createGraph(map);
  // // for (let y = 0; y < nodes.length; y++) {
  // //   for (let x = 0; x < nodes[y].length; x++) {
  // //     console.log(nodes[y][x].pos, nodes[y][x].neighbors);
  // //   }
  // // }

  // const dijkstra = (start: Node, end: Node) => {
  //   type QueueItem = {
  //     edge: Edge;
  //     //path: Edge[];      // path: [
  //     //   {
  //     //     to: start,
  //     //     distance: 0,
  //     //   },
  //     // ],
  //     totalDistance: number;
  //   };
  //   const minQueue = new MinPriorityQueue<QueueItem>((e) => e.totalDistance);
  //   const visitedKey = (gn: { pos: Pos }) => `${gn.pos.y},${gn.pos.x}`;
  //   const visited = new Map<string, number>();
  //   minQueue.push({
  //     edge: {
  //       to: start,
  //       distance: 0,
  //     },
  //     totalDistance: 0,
  //   });
  //   let count = 0;
  //   while (minQueue.size() > 0) {
  //     //console.log(minQueue.size());
  //     const { edge, totalDistance } = minQueue.pop();
  //     if (edge.to.pos.y === end.pos.y && edge.to.pos.x === end.pos.x) {
  //       return { edge, totalDistance };
  //     }

  //     const node = edge.to;
  //     // console.log('Current: ', edge.to, totalDistance);
  //     // console.log(
  //     //   'Visited: ',
  //     //   JSON.stringify(
  //     //     Array.from(visited.entries()).sort(([key], [key2]) =>
  //     //       key.localeCompare(key2)
  //     //     )
  //     //   )
  //     // );

  //     for (const neighbor of node.neighbors) {
  //       const neighborKey = visitedKey(neighbor.to);
  //       const newDistance = totalDistance + neighbor.distance;
  //       if (!visited.has(neighborKey)) {
  //         // console.log('Pushing: ', neighbor.to, newDistance);
  //         minQueue.push({
  //           edge: {
  //             to: neighbor.to,
  //             distance: neighbor.distance,
  //           },
  //           //path: [...path, neighbor],
  //           totalDistance: newDistance,
  //         });
  //         visited.set(visitedKey(edge.to), totalDistance);
  //       }
  //     }
  //     count++;
  //     // if (count > 10000) {
  //     //   break;
  //     // }
  //   }

  //   throw new Error('No path found');
  // };

  // const start = nodes[0][0];
  // const end = nodes[MAP_SIZE - 1][MAP_SIZE - 1];

  // const { totalDistance } = dijkstra(start, end);

  // return totalDistance;
}

await runSolution(day18a);
