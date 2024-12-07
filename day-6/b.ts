import { runSolution } from '../utils.ts';

type Node = {
  x: number;
  y: number;
  type: '.' | '#' | '<' | '>' | '^' | 'v';
  visited: {
    '<'?: boolean;
    '>'?: boolean;
    '^'?: boolean;
    v?: boolean;
  };
};

const stepForward = (x: number, y: number, dir: string, nodes: Node[][]) => {
  let next: { x: number; y: number; dir: string };
  if (dir === '>') {
    next = { x: x + 1, y, dir };
  } else if (dir === '<') {
    next = { x: x - 1, y, dir };
  }
  if (dir === '^') {
    next = { x, y: y - 1, dir };
  }
  if (dir === 'v') {
    next = { x, y: y + 1, dir };
  }

  // console.log('Step forward:', x, y, dir);

  // check whether we are still on the map
  if (
    next.x < 0 ||
    next.x >= nodes[0].length ||
    next.y < 0 ||
    next.y >= nodes.length
  ) {
    // console.log('####### OUT OF BOUNDS #########');
    return 'out';
  }
  // check if next step is same dir - which means we have already been there
  if (
    ['<', '>', '^', 'v'].includes(nodes[y][x].type) &&
    nodes[y][x].type === nodes[next.y][next.x].type
  ) {
    console.log('####### DEAD END #########');
    return 'loop';
  }

  // console.log('!!!! NEXT IS', next, nodes[next.y][next.x]);

  // check whether we have hit a wall - if so then just turn right 90 degrees
  if (nodes[next.y][next.x].type === '#') {
    if (dir === '>') {
      nodes[y][x].type = 'v';
      return nodes[y][x];
    }
    if (dir === '<') {
      nodes[y][x].type = '^';
      return nodes[y][x];
    }
    if (dir === '^') {
      nodes[y][x].type = '>';
      return nodes[y][x];
    }
    if (dir === 'v') {
      nodes[y][x].type = '<';
      return nodes[y][x];
    }
  }
  if (
    nodes[next.y][next.x].type === '.' ||
    ['<', '>', '^', 'v'].includes(nodes[next.y][next.x].type)
  ) {
    // the dir must not be the same as the next node type because we have already been there
    if (nodes[next.y][next.x].type === dir) {
      throw new Error('Already been here');
    }
    // lets set the next node to the current direction
    nodes[next.y][next.x].type = dir as Node['type'];
    return nodes[next.y][next.x];
  }
  throw new Error('Unknown character in map');
};

const traverseMap = (data: string[][], debug = false) => {
  let start: Node | null = null;
  const nodes: Node[][] = [];
  // find the starting point
  for (let y = 0; y < data.length; y++) {
    nodes.push([]);
    for (let x = 0; x < data[y].length; x++) {
      if (
        data[y][x] === '>' ||
        data[y][x] === '<' ||
        data[y][x] === '^' ||
        data[y][x] === 'v'
      ) {
        start = {
          x,
          y,
          type: data[y][x] as Node['type'],
          visited: {},
        };
        nodes[y].push(start);
      } else {
        nodes[y].push({ x, y, type: data[y][x] as '.' | '#', visited: {} });
      }
    }
  }
  let current = start;
  let next: Node | 'out' | 'loop';
  while (current) {
    if (debug) {
      console.log('Current:', current);
    }
    if (current.visited[current.type]) {
      console.log('Loop detected');
      return 'loop';
    }
    current.visited[current.type] = true;

    next = stepForward(current.x, current.y, current.type, nodes);
    if (next === 'out') {
      // console.log('Out of bounds');
      break;
    }
    if (next === 'loop') {
      // console.log('Loop detected');
      break;
    }
    current = next;
  }
  if (next === 'loop') {
    // console.log('Loop detected');
    // console.log(
    //   nodes.map((row) => row.map((node) => node.type).join('')).join('\n')
    // );
  }

  return next;
};

/** provide your solution as the return of this function */
export async function day6a(dataIn: string[]) {
  console.log(dataIn.join('\n') + '\n');
  const data = dataIn.map((line) => line.split(''));

  let loopCount = 0;
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      if (data[y][x] === '#') {
        continue;
      }
      console.log('Checking:', x, y);
      const dataCopy = data.map((row) => [...row]);

      dataCopy[y][x] = '#';
      const result = traverseMap(dataCopy, x === 23 && y === 4 ? true : false);
      if (result === 'loop') {
        loopCount += 1;
      }
    }
  }

  console.log('################ DONE #################');

  return loopCount;
}

await runSolution(day6a);
