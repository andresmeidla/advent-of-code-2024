import { runSolution } from '../utils.ts';

type Robot = {
  pos: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
};

type MapNode = {
  x: number;
  y: number;
  robots: Robot[];
};

/** provide your solution as the return of this function */
export async function day14a(data: string[]) {
  console.log(data);
  const robots: Robot[] = [];
  for (const line of data) {
    const [leftToken, rightToken] = line.split(' ').map((x) => x.slice(2));
    robots.push({
      pos: {
        x: parseInt(leftToken.split(',')[0]),
        y: parseInt(leftToken.split(',')[1]),
      },
      velocity: {
        x: parseInt(rightToken.split(',')[0]),
        y: parseInt(rightToken.split(',')[1]),
      },
    });
  }
  console.log(robots);
  const MAP_WIDTH = 101;
  const MAP_HEIGHT = 103;
  const map: MapNode[][] = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    map.push([]);
    for (let x = 0; x < MAP_WIDTH; x++) {
      map[y].push({
        x,
        y,
        robots: [],
      });
    }
  }

  // move robots
  const SECONDS = 100;

  for (const robot of robots) {
    let x = (robot.pos.x + robot.velocity.x * 100) % MAP_WIDTH;
    let y = (robot.pos.y + robot.velocity.y * 100) % MAP_HEIGHT;
    if (x < 0) {
      x = (MAP_WIDTH + x) % MAP_WIDTH;
    }
    if (y < 0) {
      y = (MAP_HEIGHT + y) % MAP_HEIGHT;
    }
    console.log(y, x);
    map[y][x].robots.push(robot);
  }
  // print map
  for (let y = 0; y < MAP_HEIGHT; y++) {
    let line = '';
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (map[y][x].robots.length > 0) {
        line += map[y][x].robots.length;
      } else {
        line += '.';
      }
    }
    console.log(line);
  }

  // count quadrant robot counts, ignoring the lines that are in the middles of the quadrants
  const counts = [0, 0, 0, 0];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (map[y][x].robots.length > 0) {
        if (x === Math.floor(MAP_WIDTH / 2)) {
          continue;
        }
        if (y === Math.floor(MAP_HEIGHT / 2)) {
          continue;
        }
        if (x < Math.floor(MAP_WIDTH / 2) && y < Math.floor(MAP_HEIGHT / 2)) {
          counts[0] += map[y][x].robots.length;
        }
        if (x >= Math.floor(MAP_WIDTH / 2) && y < Math.floor(MAP_HEIGHT / 2)) {
          counts[1] += map[y][x].robots.length;
        }
        if (x < Math.floor(MAP_WIDTH / 2) && y >= Math.floor(MAP_HEIGHT / 2)) {
          counts[2] += map[y][x].robots.length;
        }
        if (x >= Math.floor(MAP_WIDTH / 2) && y >= Math.floor(MAP_HEIGHT / 2)) {
          counts[3] += map[y][x].robots.length;
        }
      }
    }
  }
  console.log(counts);

  return counts.reduce((acc, x) => acc * x, 1);
}

await runSolution(day14a);
