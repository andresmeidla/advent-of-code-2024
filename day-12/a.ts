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
        // checkGroup(plot, other);
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
        // checkGroup(plot, other);
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
        // checkGroup(plot, other);
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
        // checkGroup(plot, other);
      } else {
        plot.outerEdges++;
      }

      // console.log(
      //   '###### plot',
      //   plot.type,
      //   { y: plot.y, x: plot.x },
      //   'left',
      //   plot.left
      //     ? {
      //         y: plot.left.left.y,
      //         x: plot.left.left.x,
      //         type: plot.left.left.type,
      //       }
      //     : undefined,
      //   'right',
      //   plot.right
      //     ? {
      //         y: plot.right.right.y,
      //         x: plot.right.right.x,
      //         type: plot.right.right.type,
      //       }
      //     : undefined,
      //   'up',
      //   plot.up
      //     ? { y: plot.up.up.y, x: plot.up.up.x, type: plot.up.up.type }
      //     : undefined,
      //   'down',
      //   plot.down
      //     ? {
      //         y: plot.down.down.y,
      //         x: plot.down.down.x,
      //         type: plot.down.down.type,
      //       }
      //     : undefined,
      //   'group',
      //   plot.group
      //     ? plot.group.map((g) => `${g.y},${g.x}`).join('#')
      //     : undefined
      // );
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
  console.log(data);
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

  // console.log(groups);

  let sum = 0;
  // calculate the price of the groups and sum it
  for (const group of groups.values()) {
    const area = group.length;
    const outerEdges = group.reduce((acc, plot) => acc + plot.outerEdges, 0);
    const edgesWithOtherGroups = group.reduce(
      (acc, plot) => acc + plot.diffEdges,
      0
    );
    const circumference = outerEdges + edgesWithOtherGroups;
    const groupSum = area * circumference;
    // console.log(
    //   type,
    //   'outerEdges',
    //   outerEdges,
    //   'diffEdges',
    //   edgesWithOtherGroups,
    //   'circumference',
    //   circumference,
    //   'area',
    //   area,
    //   'groupSum',
    //   groupSum
    // );
    sum += groupSum;
  }
  return sum;
}

await runSolution(day12a);
