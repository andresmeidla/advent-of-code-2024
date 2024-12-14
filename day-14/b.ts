import { runSolution } from '../utils.ts';

type Robot = {
  id: number;
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
  const robots: Robot[] = [];
  let id = 0;
  for (const line of data) {
    const [leftToken, rightToken] = line.split(' ').map((x) => x.slice(2));
    robots.push({
      id: id++,
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

  const printMap = () => {
    // print map
    for (let y = 0; y < MAP_HEIGHT; y++) {
      let line = '';
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (map[y][x].robots.length > 0) {
          line += 'X ';
        } else {
          line += '. ';
        }
      }
      console.log(line);
    }
  };

  // move robots

  for (const robot of robots) {
    let x = (robot.pos.x + robot.velocity.x * 100) % MAP_WIDTH;
    let y = (robot.pos.y + robot.velocity.y * 100) % MAP_HEIGHT;
    if (x < 0) {
      x = (MAP_WIDTH + x) % MAP_WIDTH;
    }
    if (y < 0) {
      y = (MAP_HEIGHT + y) % MAP_HEIGHT;
    }
    map[y][x].robots.push(robot);
  }

  const SECONDS = 10000;
  for (let i = 0; i < SECONDS; i++) {
    map.forEach((row) => row.forEach((node) => (node.robots = [])));
    for (const robot of robots) {
      let x = (robot.pos.x + robot.velocity.x * i) % MAP_WIDTH;
      let y = (robot.pos.y + robot.velocity.y * i) % MAP_HEIGHT;
      if (x < 0) {
        x = (MAP_WIDTH + x) % MAP_WIDTH;
      }
      if (y < 0) {
        y = (MAP_HEIGHT + y) % MAP_HEIGHT;
      }
      map[y][x].robots.push(robot);
    }

    // find 10 consecutive X-es in a row
    let found = false;
    for (let y = 0; y < MAP_HEIGHT; y++) {
      let count = 0;
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (map[y][x].robots.length > 0) {
          count++;
        } else {
          count = 0;
        }
        if (count === 10) {
          console.log('found at', x, y, 'i=', i);
          found = true;
          break;
        }
      }
    }
    if (found) {
      printMap();
    }
  }

  return 0;
}

await runSolution(day14a);
