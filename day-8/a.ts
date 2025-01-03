import { runSolution } from '../utils.ts';

type Node = {
  frequency: string;
  x: number;
  y: number;
  antiNode?: true;
};

/** provide your solution as the return of this function */
export async function day8a(data: string[]) {
  console.log(data);
  const map: Node[][] = [];
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      const char = data[y][x];
      if (!map[y]) map[y] = [];
      map[y][x] = { frequency: char, x, y };
    }
  }
  console.log(map);
  const sameFrequencyNodes: Map<string, Node[]> = new Map();
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const node = map[y][x];
      if (node.frequency === '.') continue;
      if (!sameFrequencyNodes.has(node.frequency)) {
        sameFrequencyNodes.set(node.frequency, []);
      }
      sameFrequencyNodes.get(node.frequency).push(node);
    }
  }

  console.log(sameFrequencyNodes);

  for (const [frequency, nodes] of sameFrequencyNodes) {
    // for each pair of nodes with the same frequency
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];
        // console.log('pairing', node1, node2);
        // the antinodes are on the line created by the two nodes
        // at the same distance from the nodes
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;

        const p1y = node1.y - dy;
        const p1x = node1.x - dx;

        const p2y = node2.y + dy;
        const p2x = node2.x + dx;

        if (p1y >= 0 && p1y < map.length && p1x >= 0 && p1x < map[p1y].length) {
          map[p1y][p1x].antiNode = true;
        }
        if (p2y >= 0 && p2y < map.length && p2x >= 0 && p2x < map[p2y].length) {
          map[p2y][p2x].antiNode = true;
        }
      }
    }
  }

  console.log(map);
  let sum = 0;
  // draw the map
  for (let y = 0; y < map.length; y++) {
    let line = '';
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].antiNode) {
        line += '#';
        sum += 1;
      } else {
        line += map[y][x].frequency;
      }
    }
    console.log(line);
  }

  return sum;
}

await runSolution(day8a);
