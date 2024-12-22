import { runSolution } from '../utils.ts';

// +---+---+---+
// | 7 | 8 | 9 |
// +---+---+---+
// | 4 | 5 | 6 |
// +---+---+---+  Robot (moves one tile at a time, A requires explicit press move)
// | 1 | 2 | 3 |
// +---+---+---+
//     | 0 | A |
//     +---+---+

//       ^
//       |
// controls next level keypad

//     +---+---+
//     | ^ | A |
// +---+---+---+  Robot (moves one tile at a time, A requires explicit press move)
// | < | v | > |
// +---+---+---+

//       ^
//       |
// controls next level keypad

//     +---+---+
//     | ^ | A |
// +---+---+---+  Robot (moves one tile at a time, A requires explicit press move)
// | < | v | > |
// +---+---+---+

//       ^
//       |
// controls next level keypad

//     +---+---+
//     | ^ | A |
// +---+---+---+  Human
// | < | v | > |
// +---+---+---+

/** provide your solution as the return of this function */
export async function day21a(data: string[]) {
  console.log(data);

  // the robot controlled keypads (2 directional and 1 numeric keypad) have a state which is the robots current position.
  // for directional keypads the robot could be in any of; "<", ">", "^", "v" or "A".
  // for the numeric keypad the robot could be in any of; "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" or "A".
  // the keypadConfMap captures the state of the system, which consists of the current locations of:
  // * current locations of 1st level keypad robot
  // * current locations of 2nd level keypad robot
  // * current locations of 3rd level keypad robot
  // The key is a string in the format "1stLevelRobotPos,2ndLevelRobotPos,3rdLevelRobotPos"
  // for ex: '<,A.9' means 1st level robot is at "<", 2nd level robot is at "A" and 3rd level robot is at "9"
  const DIRECTIONAL = ['A', '<', '>', '^', 'v'] as const;
  type Dir = (typeof DIRECTIONAL)[number];
  // eslint-disable-next-line prettier/prettier
  const NUMERIC = ['A', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
  const CONFIGS: string[][] = [];
  // lets generate all possible configurations of the system
  for (const firstLevelRobotPos of DIRECTIONAL) {
    for (const secondLevelRobotPos of DIRECTIONAL) {
      for (const thirdLevelRobotPos of NUMERIC) {
        CONFIGS.push([
          firstLevelRobotPos,
          secondLevelRobotPos,
          thirdLevelRobotPos,
        ]);
      }
    }
  }
  // Each numeric keypress will output a number, so the possible initial configurations
  // after each generated number are:
  // * A,A,A | A,A,0 | A,A,1 | A,A,2 | A,A,3 | A,A,4 | A,A,5 | A,A,6 | A,A,7 | A,A,8 | A,A,9
  // we need to find the count of button presses required to produce each number from
  // a from-to pair of these initial configurations.
  // when we are at A,A,A, then to get to A,A,9:
  // * 3rd level robot needs to move from A to 9, which is 1 move up (^)
  // * 2nd level robot needs to press "A" for 9 to be pressed on 3rd level keypad

  type Pos = { y: number; x: number };
  const DIR_MAP = [
    [undefined, '^', 'A'],// eslint-disable-line prettier/prettier
          ['<', 'v', '>'],// eslint-disable-line prettier/prettier
  ] as const;

  const NUM_MAP = [
          ['7', '8', '9'], // eslint-disable-line prettier/prettier
          ['4', '5', '6'], // eslint-disable-line prettier/prettier
          ['1', '2', '3'], // eslint-disable-line prettier/prettier
    [undefined, '0', 'A'],
  ];
  type Path = { dist: number; last: Dir; path: Dir[] };

  const dfs = (
    map: ReadonlyArray<ReadonlyArray<string>>,
    start: Pos,
    end: Pos
  ) => {
    type StackItem = {
      pos: Pos;
      dist: number;
      lastDir: Dir;
      visited: Set<string>;
      parent: StackItem | null;
    };
    const stack: StackItem[] = [
      {
        pos: start,
        dist: 0,
        lastDir: 'A',
        visited: new Set(),
        parent: null,
      },
    ];
    const paths: Path[] = [];
    while (stack.length > 0) {
      const current = stack.pop()!;
      // console.log('current', current.pos, current.visited);
      if (current.pos.x === end.x && current.pos.y === end.y) {
        const path: Dir[] = [];
        let currentPath = current;
        while (currentPath !== null) {
          path.push(currentPath.lastDir);
          currentPath = currentPath.parent;
        }
        path.pop();
        paths.push({
          dist: current.dist + 1,
          last: current.lastDir,
          path: [...path.reverse(), 'A'],
        });
        continue;
      }

      for (const [dx, dy] of [
        [0, 1], // down
        [0, -1], // up
        [-1, 0], // left
        [1, 0], // right
      ] as const) {
        const dir =
          dx === 0
            ? dy === 1
              ? 'v'
              : '^'
            : dy === 0
              ? dx === 1
                ? '>'
                : '<'
              : undefined;
        const y = current.pos.y + dy;
        const x = current.pos.x + dx;
        if (y < 0 || y >= map.length) {
          continue;
        }
        if (x < 0 || x >= map[0].length) {
          continue;
        }
        const newPos = { y, x };
        if (map[newPos.y][newPos.x] === undefined) {
          continue;
        }
        const newKey = `${newPos.y},${newPos.x}`;
        if (current.visited.has(newKey)) {
          continue;
        }
        const newVisited = new Set(current.visited);
        // console.log('ADDING NEW POS', newPos, dir);
        stack.push({
          pos: newPos,
          dist: current.dist + 1,
          lastDir: dir!,
          visited: newVisited,
          parent: current,
        });
        newVisited.add(newKey);
      }
    }
    return paths;
  };

  // calculate all distances for the directional keypad
  const dirDistances = new Map<string, Path[]>();
  for (let y1 = 0; y1 < DIR_MAP.length; y1++) {
    for (let x1 = 0; x1 < DIR_MAP[y1].length; x1++) {
      for (let y2 = 0; y2 < DIR_MAP.length; y2++) {
        for (let x2 = 0; x2 < DIR_MAP[y2].length; x2++) {
          const start: Pos = { y: y1, x: x1 };
          const end: Pos = { y: y2, x: x2 };
          const startButton = DIR_MAP[start.y][start.x];
          const endButton = DIR_MAP[end.y][end.x];
          if (startButton === undefined || endButton === undefined) {
            continue;
          }
          const paths = dfs(DIR_MAP, start, end);
          // console.log('#####', startButton, endButton, paths);
          dirDistances.set(`${startButton}|${endButton}`, paths);
        }
      }
    }
  }
  const reverseDirMap = new Map<string, string>();
  for (const [key, value] of dirDistances) {
    console.log(key, value);
    for (const path of value) {
      reverseDirMap.set(path.path.join(''), key);
    }
  }

  console.log('\n#################################### dirDistances');

  // calculate all distances for the numeric keypad
  const numDistances = new Map<string, Path[]>();
  for (let y1 = 0; y1 < NUM_MAP.length; y1++) {
    for (let x1 = 0; x1 < NUM_MAP[y1].length; x1++) {
      for (let y2 = 0; y2 < NUM_MAP.length; y2++) {
        for (let x2 = 0; x2 < NUM_MAP[y2].length; x2++) {
          const start: Pos = { y: y1, x: x1 };
          const end: Pos = { y: y2, x: x2 };
          const startButton = NUM_MAP[start.y][start.x];
          const endButton = NUM_MAP[end.y][end.x];
          if (startButton === undefined || endButton === undefined) {
            continue;
          }
          const paths = dfs(NUM_MAP, start, end);
          numDistances.set(`${startButton}|${endButton}`, paths);
        }
      }
    }
  }
  for (const [key, value] of numDistances) {
    console.log(
      key,
      value.map((v) => ({ dist: v.dist, path: v.path.join('') }))
    );
  }

  const KEYPAD_COUNT = 25;
  const KEYPADS: { distances: Map<string, Path[]> }[] = [];
  for (let i = 0; i < KEYPAD_COUNT; ++i) {
    KEYPADS.push({
      distances: dirDistances,
    });
  }
  KEYPADS.push({
    distances: numDistances,
  });

  // for each configuration, calculate the number of button presses required to move from one configuration to another

  type Output = {
    keypadIndex: number;
    children: Output[];
    dist: number;
  };

  const key = ({
    keypadIndex,
    from,
    to,
  }: {
    keypadIndex: number;
    from: string;
    to: string;
  }) => `${keypadIndex}:${from}->${to}`;
  const cache = new Map<string, number>();

  const getMinDistForOutputChange = ({
    input,
    keypadIndex,
    inputConfig,
    debug = false,
  }: {
    input: Path['path'];
    keypadIndex: number;
    inputConfig: string[];
    debug?: boolean;
  }): Output => {
    const distanceMap = KEYPADS[keypadIndex].distances;
    const out: Output = {
      keypadIndex,
      dist: 0,
      children: [],
    };
    const outputs: Path['path'][] = [];
    for (const toButton of input) {
      const fromButton = inputConfig[keypadIndex];
      const paths = distanceMap.get(`${fromButton}|${toButton}`)!;
      // console.log(
      //   keypadIndex,
      //   inputConfig.length,
      //   'paths',
      //   fromButton,
      //   toButton,
      //   paths
      // );
      if (keypadIndex > 0) {
        const from = inputConfig.slice(0, keypadIndex + 1);
        const to = [...from];
        to[keypadIndex] = toButton;
        const cacheKey = key({ keypadIndex, from: fromButton, to: toButton });
        if (cache.has(cacheKey)) {
          const dist = cache.get(cacheKey)!;
          out.children.push({ dist, keypadIndex, children: [] });
        } else {
          const pathOutputs = paths.map((path) =>
            getMinDistForOutputChange({
              input: path.path,
              inputConfig,
              keypadIndex: keypadIndex - 1,
              debug,
            })
          );
          const minPath = pathOutputs.reduce((min, cur) => {
            if (!min || cur.dist < min.dist) {
              return cur;
            }
            return min;
          });
          cache.set(cacheKey, minPath.dist);
          out.children.push(minPath);
        }
      } else {
        const minPath = paths.reduce((min, cur) => {
          if (!min || cur.dist < min.dist) {
            return cur;
          }
          return min;
        });
        outputs.push(minPath.path);
      }
      inputConfig[keypadIndex] = toButton;
    }
    // calculate the total distance of all children
    if (out.children.length > 0) {
      out.dist = out.children.reduce((sum, child) => sum + child.dist, 0);
    } else {
      out.dist = outputs.reduce((sum, path) => sum + path.length, 0);
    }
    return out;
  };

  // const OUTPUT_CONFIGS = [
  //   /* eslint-disable prettier/prettier */
  //   ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
  //   ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', '0'],
  //   ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', '1'],
  //   ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', '2'],
  //   ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', '3'],
  //   ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', '4'],
  //   ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', '5'],
  //   ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', '6'],
  //   ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', '7'],
  //   ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', '8'],
  //   ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', '9'],
  //   /* eslint-enable prettier/prettier */
  // ];
  const OUTPUT_CONFIGS: string[][] = [];
  for (const num of NUMERIC) {
    const cfg: string[] = [];
    for (let i = 0; i < KEYPAD_COUNT; ++i) {
      cfg.push('A');
    }
    cfg.push(num);
    OUTPUT_CONFIGS.push(cfg);
  }
  console.log(
    'OUTPUT_CONFIGS',
    OUTPUT_CONFIGS.map((c) => c.join(','))
  );

  const configMap = new Map<string, { dist: number }>();
  for (let fromIndex = 0; fromIndex < OUTPUT_CONFIGS.length; fromIndex++) {
    const fromConfig = OUTPUT_CONFIGS[fromIndex];
    for (let toIndex = 0; toIndex < OUTPUT_CONFIGS.length; toIndex++) {
      if (fromIndex === toIndex) {
        continue;
      }
      const toConfig = OUTPUT_CONFIGS[toIndex] as Path['path'];

      const keypadIndex = KEYPADS.length - 1;
      console.log(
        '###################################################################',
        fromConfig,
        toConfig
      );
      const debug =
        fromConfig.join(',') === 'A,A,A' && toConfig.join(',') === 'A,A,4';
      // (fromConfig.join(',') === 'A,A,4' && toConfig.join(',') === 'A,A,5') ||
      // (fromConfig.join(',') === 'A,A,5' && toConfig.join(',') === 'A,A,6') ||
      // (fromConfig.join(',') === 'A,A,6' && toConfig.join(',') === 'A,A,A');
      const out = getMinDistForOutputChange({
        input: [toConfig[keypadIndex]],
        keypadIndex,
        inputConfig: [...fromConfig],
        debug,
      });

      if (debug) {
        console.log('OUT', JSON.stringify(out, null, 2));
      }

      configMap.set(`${fromConfig.join(',')} -> ${toConfig.join(',')}`, {
        dist: out.dist,
      });
    }
  }

  // console.log('configMap', configMap);

  let result = 0;
  for (const code of data) {
    let currentConfig: string[] = [];
    for (let i = 0; i < KEYPAD_COUNT + 1; ++i) {
      currentConfig.push('A');
    }
    console.log('code', code);
    let fullDist = 0;

    for (const char of code) {
      const toConfig = [...currentConfig];
      toConfig[KEYPADS.length - 1] = char;
      const key = `${currentConfig.join(',')} -> ${toConfig.join(',')}`;
      if (!configMap.has(key)) {
        throw new Error(
          `No path from ${currentConfig.join(',')} to ${toConfig.join(',')}`
        );
      }
      const { dist } = configMap.get(key)!;
      fullDist += dist;

      currentConfig = toConfig;
    }
    console.log(`${code}: (${fullDist})`);

    result += fullDist * parseInt(code.slice(0, -1));
  }

  // console.log(configMap);

  // console.log(CONFIGS, CONFIGS.length);

  return result;
}

await runSolution(day21a);
