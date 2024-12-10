import { runSolution } from '../utils.ts';

type MapNode = { y: number; x: number; type: number };

/** provide your solution as the return of this function */
export async function day10a(data: string[]) {
  console.log(data);

  const map: MapNode[][] = [];
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      if (!map[y]) {
        map[y] = [];
      }
      map[y][x] = {
        y,
        x,
        type: isNaN(parseInt(data[y][x])) ? -1 : parseInt(data[y][x]),
      };
    }
  }
  console.log(map);

  const findTrailheads = (map: MapNode[][]) => {
    const trailHeads: MapNode[] = [];
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x].type === 0) trailHeads.push(map[y][x]);
      }
    }
    return trailHeads;
  };
  const trailHeads = findTrailheads(map);

  console.log('trailHeads', trailHeads);

  const printMap = (map: MapNode[][], path: MapNode[]) => {
    for (let y = 0; y < map.length; y++) {
      let row = '';
      for (let x = 0; x < map[y].length; x++) {
        const node = map[y][x];
        if (path.find((p) => p.x === x && p.y === y)) {
          row += node.type;
        } else {
          row += '.';
        }
      }
      console.log(row);
    }
  };

  const getNeighboringPaths = (pos: MapNode) => {
    const neighbors: MapNode[] = [];
    if (pos.y > 0) neighbors.push(map[pos.y - 1][pos.x]);
    if (pos.y < map.length - 1) neighbors.push(map[pos.y + 1][pos.x]);
    if (pos.x > 0) neighbors.push(map[pos.y][pos.x - 1]);
    if (pos.x < map[pos.y].length - 1) neighbors.push(map[pos.y][pos.x + 1]);
    return neighbors.filter((n) => n.type !== -1 && n.type === pos.type + 1);
  };

  const sum = 0;
  const topMap: Map<string, boolean> = new Map();
  const dfs = (trailHead: MapNode) => {
    const stack: { node: MapNode; path: MapNode[] }[] = [
      { node: trailHead, path: [trailHead] },
    ];
    let cur = stack.pop();
    while (cur) {
      // console.log('cur', cur);
      if (cur.node.type === 9) {
        // console.log('found end');
        // printMap(map, cur.path);
        // sum += 1;
        topMap.set(
          `${trailHead.y},${trailHead.x}-${cur.node.y},${cur.node.x}`,
          true
        );
      } else {
        const neighbors = getNeighboringPaths(cur.node);
        // console.log('neighbors', neighbors);
        for (const n of neighbors) {
          stack.push({ node: n, path: [...cur.path, n] });
        }
      }

      cur = stack.pop();
    }
  };

  for (const th of trailHeads) {
    dfs(th);
  }

  console.log('topMap', topMap);

  return topMap.size;
}

await runSolution(day10a);
