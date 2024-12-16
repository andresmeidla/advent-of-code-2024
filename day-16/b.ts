import { runSolution } from '../utils.ts';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

type Dir = 'N' | 'E' | 'S' | 'W';

type Node = {
  y: number;
  x: number;
  type: '#' | '.';
};

type Edge = {
  node: Node;
  dir: Dir;
  distance: number;
};

type GraphNode = {
  node: Node;
  dir: Dir;
  edges: Edge[];
};

const DIRS = ['N', 'E', 'S', 'W'] as Dir[];

const turningDistance = (from: Dir, to: Dir) => {
  const fromIndex = DIRS.indexOf(from);
  const toIndex = DIRS.indexOf(to);
  return (Math.abs(fromIndex - toIndex) % 2) * 1000;
};

const getNeighbors = (node: Node, nodes: Node[][]) => {
  const neighbors: { node: Node; dir: Dir }[] = [];
  // West
  if (node.x > 0 && nodes[node.y][node.x - 1].type === '.') {
    neighbors.push({
      node: nodes[node.y][node.x - 1],
      dir: 'W',
    });
  }
  // East
  if (
    node.x < nodes[node.y].length - 1 &&
    nodes[node.y][node.x + 1].type === '.'
  ) {
    neighbors.push({
      node: nodes[node.y][node.x + 1],
      dir: 'E',
    });
  }
  // North
  if (node.y > 0 && nodes[node.y - 1][node.x].type === '.') {
    neighbors.push({
      node: nodes[node.y - 1][node.x],
      dir: 'N',
    });
  }
  // South
  if (node.y < nodes.length - 1 && nodes[node.y + 1][node.x].type === '.') {
    neighbors.push({
      node: nodes[node.y + 1][node.x],
      dir: 'S',
    });
  }
  return neighbors;
};

const createGraph = (nodes: Node[][]) => {
  const graph: GraphNode[] = [];
  for (let y = 0; y < nodes.length; y++) {
    for (let x = 0; x < nodes[y].length; x++) {
      if (nodes[y][x].type !== '#') {
        DIRS.forEach((dir) => {
          const neighbors = getNeighbors(nodes[y][x], nodes);
          graph.push({
            node: nodes[y][x],
            dir,
            edges: neighbors.map((n) => ({
              node: n.node,
              dir: n.dir,
              distance: turningDistance(dir, n.dir) + 1,
            })),
          });
        });
      }
    }
  }
  return graph;
};

const pad = (num: number, size: number) => {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
};

const red = (str: string) => `\x1b[31m${str}\x1b[0m`;

/** provide your solution as the return of this function */
export async function day16a(data: string[]) {
  for (let i = 0; i < data.length; i++) {
    console.log(pad(i, 3), data[i]);
  }

  const nodes: Node[][] = [];
  let start: Node | null = null;
  let end: Node | null = null;
  for (const line of data) {
    const row: Node[] = [];
    for (let i = 0; i < line.length; i++) {
      row.push({ y: nodes.length, x: i, type: line[i] === '#' ? '#' : '.' });
      if (line[i] === 'S') {
        start = row[row.length - 1];
      }
      if (line[i] === 'E') {
        end = row[row.length - 1];
      }
    }
    nodes.push(row);
  }

  const graph = createGraph(nodes);
  const nodeMap = new Map<Node, GraphNode[]>();
  for (const node of graph) {
    if (!nodeMap.has(node.node)) {
      nodeMap.set(node.node, []);
    }
    nodeMap.get(node.node)!.push(node);
  }

  const startingNode = nodeMap.get(start).filter((n) => n.dir === 'E')[0];

  const dijkstra = (
    nodeMap: Map<Node, GraphNode[]>,
    start: GraphNode,
    end: Node
  ) => {
    type QueueItem = {
      edge: Edge;
      path: Edge[];
      totalDistance: number;
    };
    const minQueue = new MinPriorityQueue<QueueItem>((e) => e.totalDistance);
    const visitedKey = (gn: { node: Node; dir: Dir }) =>
      `${gn.node.x},${gn.node.y},${gn.dir}`;
    const visited = new Map<string, number>();
    const paths: { path: Edge[]; totalDistance: number }[] = [];
    minQueue.push({
      edge: {
        node: start.node,
        dir: start.dir,
        distance: 0,
      },
      path: [
        {
          node: start.node,
          dir: start.dir,
          distance: 0,
        },
      ],
      totalDistance: 0,
    });

    while (minQueue.size() > 0) {
      const { edge, totalDistance, path } = minQueue.pop();
      if (edge.node === end) {
        paths.push({ path, totalDistance });
        continue;
      }
      // set visited for all directions
      visited.set(visitedKey(edge), totalDistance);
      const directionalGraphNodes = nodeMap
        .get(edge.node)
        .filter((n) => n.dir === edge.dir);
      if (directionalGraphNodes.length > 1) {
        throw new Error('Too many graphNodes');
      }
      const graphNode = directionalGraphNodes[0];
      // console.log('Current: ', edge.node, edge.dir, totalDistance);
      if (graphNode) {
        const neighbors = graphNode.edges;
        for (const neighbor of neighbors) {
          const neighborKey = visitedKey(neighbor);
          const newDistance = totalDistance + neighbor.distance;
          if (
            !visited.has(neighborKey) ||
            visited.get(neighborKey)! > newDistance
          ) {
            minQueue.push({
              edge: {
                node: neighbor.node,
                dir: neighbor.dir,
                distance: neighbor.distance,
              },
              path: [...path, neighbor],
              totalDistance: newDistance,
            });
          }
        }
      }
    }

    return paths;
  };
  const paths = dijkstra(nodeMap, startingNode, end);
  paths.sort((a, b) => a.totalDistance - b.totalDistance);

  const printPath = (pathNodes: Edge[]) => {
    const path = new Set<string>();
    for (const edge of pathNodes) {
      path.add(`${edge.node.x},${edge.node.y}`);
    }
    // print the map from the nodes
    let str = '';
    for (let y = 0; y < nodes.length; y++) {
      for (let x = 0; x < nodes[y].length; x++) {
        const node = nodes[y][x];
        if (node === start) {
          str += 'S';
        } else if (node === end) {
          str += 'E';
        } else {
          if (path.has(`${x},${y}`)) {
            str += red(node.type);
          } else {
            str += node.type;
          }
        }
      }
      str += '\n';
    }
    console.log(str);
  };

  console.log('paths', paths.length);

  if (paths.length === 0) {
    throw new Error('No best paths found');
  }
  // paths.forEach((path) => {
  //   printPath(path.path);
  // });

  const partOfBestPAth: Set<string> = new Set();
  paths.forEach((path) => {
    path.path.forEach((edge) => {
      partOfBestPAth.add(`${edge.node.x},${edge.node.y}`);
    });
  });

  return partOfBestPAth.size;
}

await runSolution(day16a);
