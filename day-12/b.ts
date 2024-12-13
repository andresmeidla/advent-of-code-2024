import { runSolution } from '../utils.ts';

type Edge = {
  up?: Plot;
  down?: Plot;
  left?: Plot;
  right?: Plot;
  handled?: boolean;
};

type Plot = {
  type: string;
  y: number;
  x: number;
  left?: Edge | undefined;
  right?: Edge | undefined;
  up?: Edge | undefined;
  down?: Edge | undefined;
  outerEdges: number;
  diffEdges: number;
  group?: Plot[];
};

const red = (str: string) => {
  return `\x1b[31m${str}\x1b[0m`;
};

const dfsGroup = (plot: Plot) => {
  const group: Plot[] = [];

  const stack = [plot];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current && !current.group) {
      current.group = group;
      group.push(current);

      if (current.left && current.left.left.type === plot.type) {
        stack.push(current.left.left);
      }
      if (current.right && current.right.right.type === plot.type) {
        stack.push(current.right.right);
      }
      if (current.up && current.up.up.type === plot.type) {
        stack.push(current.up.up);
      }
      if (current.down && current.down.down.type === plot.type) {
        stack.push(current.down.down);
      }
    }
  }
};

const createGraph = (map: Plot[][]) => {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      const plot = map[y][x];

      // left
      if (x > 0) {
        const other = map[y][x - 1];
        if (!other.right) {
          plot.left = {
            right: plot,
            left: other,
          };
        } else {
          plot.left = other.right;
        }
      } else {
        plot.outerEdges++;
      }
      // right
      if (x < map[y].length - 1) {
        const other = map[y][x + 1];
        if (!other.left) {
          plot.right = {
            left: plot,
            right: other,
          };
        } else {
          plot.right = other.left;
        }
      } else {
        plot.outerEdges++;
      }
      // up
      if (y > 0) {
        const other = map[y - 1][x];
        if (!other.down) {
          plot.up = {
            down: plot,
            up: other,
          };
        } else {
          plot.up = other.down;
        }
      } else {
        plot.outerEdges++;
      }
      // down
      if (y < map.length - 1) {
        const other = map[y + 1][x];
        if (!other.up) {
          plot.down = {
            up: plot,
            down: other,
          };
        } else {
          plot.down = other.up;
        }
      } else {
        plot.outerEdges++;
      }
    }
  }

  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      const plot = map[y][x];
      if (!plot.group) {
        dfsGroup(plot);
      }
    }
  }
};

/** provide your solution as the return of this function */
export async function day12a(data: string[]) {
  console.log(
    data
      .map((line) =>
        line
          .split('')
          .map((c) => (c === 'S' ? red('S') : c))
          .join('')
      )
      .join('\n')
  );
  const map: Plot[][] = data.map((line, y) => {
    const plotX = line.split('');
    return plotX.map((type, x) => ({
      type,
      y,
      x,
      left: undefined,
      right: undefined,
      up: undefined,
      down: undefined,
      outerEdges: 0,
      diffEdges: 0,
    }));
  });
  createGraph(map);

  const groups = new Map<string, Plot[]>();
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      const plot = map[y][x];
      if (plot.left && plot.left.left.type !== plot.type) {
        plot.diffEdges++;
      }
      if (plot.right && plot.right.right.type !== plot.type) {
        plot.diffEdges++;
      }
      if (plot.up && plot.up.up.type !== plot.type) {
        plot.diffEdges++;
      }
      if (plot.down && plot.down.down.type !== plot.type) {
        plot.diffEdges++;
      }
      if (plot.group) {
        groups.set(
          `${plot.type}:${plot.group.map((g) => `${g.y},${g.x}`).join('#')}`,
          plot.group
        );
      }
    }
  }

  // add a buffer of 1 plot around the map
  for (let y = 0; y < map.length; ++y) {
    const leftSide: Plot = {
      type: '~',
      y: -1,
      x: -1,
      outerEdges: 0,
      diffEdges: 0,
    };
    leftSide.right = {
      right: map[y][0],
      left: leftSide,
    };
    map[y][0].left = leftSide.right;
    map[y].unshift(leftSide);
    const rightSide: Plot = {
      type: '~',
      y: -1,
      x: -1,
      outerEdges: 0,
      diffEdges: 0,
    };
    rightSide.left = {
      left: map[y][map[y].length - 1],
      right: rightSide,
    };
    map[y][map[y].length - 1].right = rightSide.left;
    map[y].push(rightSide);
  }
  const topRow: Plot[] = [];
  const bottomRow: Plot[] = [];
  for (let x = 0; x < map[0].length; ++x) {
    const topSide: Plot = {
      type: '~',
      y: -1,
      x: -1,
      outerEdges: 0,
      diffEdges: 0,
    };
    topSide.down = {
      down: map[0][x],
      up: topSide,
    };
    map[0][x].up = topSide.down;
    topRow.push(topSide);
    const bottomSide: Plot = {
      type: '~',
      y: -1,
      x: -1,
      outerEdges: 0,
      diffEdges: 0,
    };
    bottomSide.up = {
      up: map[map.length - 1][x],
      down: bottomSide,
    };
    map[map.length - 1][x].down = bottomSide.up;
    bottomRow.push(bottomSide);
  }
  map.unshift(topRow);
  map.push(bottomRow);

  console.log(map.map((line) => line.map((p) => p.type).join('')).join('\n'));

  let sum = 0;
  // calculate the price of the groups and sum it
  for (const group of groups.values()) {
    const groupMap = new Map<string, Plot>();
    for (const plot of group) {
      groupMap.set(`${plot.y},${plot.x}`, plot);
    }

    let leftFencesCount = 0;
    for (let x = 0; x < map[0].length; ++x) {
      let lastPlot: Plot | undefined;
      for (let y = 0; y < map.length; ++y) {
        if (groupMap.has(`${y},${x}`)) {
          const plot = groupMap.get(`${y},${x}`);
          if (plot.type === plot.left?.left.type) {
            continue;
          }
          if (lastPlot) {
            if (lastPlot.y !== y - 1) {
              leftFencesCount++;
            }
          } else {
            leftFencesCount++;
          }
          lastPlot = groupMap.get(`${y},${x}`);
        }
      }
    }

    let rightFencesCount = 0;
    for (let x = map[0].length - 1; x >= 0; --x) {
      let lastPlot: Plot | undefined;
      for (let y = 0; y < map.length; ++y) {
        if (groupMap.has(`${y},${x}`)) {
          const plot = groupMap.get(`${y},${x}`);
          if (plot.type === plot.right?.right.type) {
            continue;
          }
          if (lastPlot) {
            if (lastPlot.y !== y - 1) {
              rightFencesCount++;
            }
          } else {
            rightFencesCount++;
          }
          lastPlot = groupMap.get(`${y},${x}`);
        }
      }
    }

    let upFencesCount = 0;
    for (let y = 0; y < map.length; ++y) {
      let lastPlot: Plot | undefined;
      for (let x = 0; x < map[y].length; ++x) {
        if (groupMap.has(`${y},${x}`)) {
          const plot = groupMap.get(`${y},${x}`);
          if (plot.type === plot.up?.up.type) {
            continue;
          }
          if (lastPlot) {
            if (lastPlot.x !== x - 1) {
              upFencesCount++;
            }
          } else {
            upFencesCount++;
          }
          lastPlot = groupMap.get(`${y},${x}`);
        }
      }
    }
    let downFencesCount = 0;
    for (let y = map.length - 1; y >= 0; --y) {
      let lastPlot: Plot | undefined;
      for (let x = 0; x < map[y].length; ++x) {
        if (groupMap.has(`${y},${x}`)) {
          const plot = groupMap.get(`${y},${x}`);
          if (plot.type === plot.down?.down.type) {
            continue;
          }
          if (lastPlot) {
            if (lastPlot.x !== x - 1) {
              downFencesCount++;
            }
          } else {
            downFencesCount++;
          }
          lastPlot = groupMap.get(`${y},${x}`);
        }
      }
    }

    // console.log(
    //   group[0].type,
    //   'leftFencesCount',
    //   leftFencesCount,
    //   'rightFencesCount',
    //   rightFencesCount,
    //   'upFencesCount',
    //   upFencesCount,
    //   'downFencesCount',
    //   downFencesCount
    // );

    const area = group.length;
    const fenceCount =
      leftFencesCount + rightFencesCount + upFencesCount + downFencesCount;
    const groupSum = area * fenceCount;
    // console.log(
    //   '#############################',
    //   type,
    //   'area',
    //   area,
    //   'fenceCount',
    //   fenceCount,
    //   'groupSum',
    //   groupSum
    // );
    sum += groupSum;
  }
  return sum;
}

await runSolution(day12a);
