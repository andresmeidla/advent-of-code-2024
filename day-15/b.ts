import { runSolution } from '../utils.ts';

type MapNode = {
  x: number;
  y: number;
  type: '#' | '.';
};

type Box = {
  x: number;
  y: number;
};

type Move = '<' | '>' | '^' | 'v';

const red = (text: string) => `\x1b[31m${text}\x1b[0m`;

const pad = (num: number, size: number) => {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
};

const printMap = (
  map: MapNode[][],
  robotPos: { x: number; y: number },
  boxMap: Map<string, Box>
) => {
  let str = '';
  for (let y = 0; y < map.length; y++) {
    str += pad(y, 3) + ': ';
    for (let x = 0; x < map[y].length; x++) {
      const node = map[y][x];
      if (robotPos.x === x && robotPos.y === y) {
        str += red('@');
      } else if (boxMap.has(`${y},${x}`)) {
        str += '[';
      } else if (boxMap.has(`${y},${x - 1}`)) {
        str += ']';
      } else {
        str += node.type;
      }
    }
    if (
      str.indexOf('[@') > -1 ||
      str.indexOf('@]') > -1 ||
      str.indexOf('[#') > -1 ||
      str.indexOf('#]') > -1
    ) {
      throw new Error('Something is wrong with the map');
    }
    str += '\n';
  }
  console.log(str);
};

/** provide your solution as the return of this function */
export async function day15a(data: string[]) {
  console.log(data);
  const map: MapNode[][] = [];
  const boxes: Box[] = [];
  const boxMap = new Map<string, Box>();
  let y;
  let start: { x: number; y: number };
  for (y = 0; y < data.length; y++) {
    if (data[y].length === 0) break;
    const row = data[y].split('');
    map.push([]);
    for (let x = 0; x < row.length; x++) {
      if (row[x] === 'O') {
        boxes.push({ y, x: x * 2 });
        boxMap.set(`${y},${x * 2}`, boxes[boxes.length - 1]);
      } else if (row[x] === '@') {
        start = { y: y, x: x * 2 };
      }
      map[y].push({ y, x, type: row[x] === '#' ? '#' : '.' });
      map[y].push({ y, x, type: row[x] === '#' ? '#' : '.' });
    }
  }
  const moves: Move[] = [];
  for (y = y + 1; y < data.length; y++) {
    moves.push(...(data[y].split('') as Move[]));
  }

  // console.log(map);
  // console.log(boxes);
  // console.log(moves);
  // console.log(start);

  printMap(map, start, boxMap);

  const nextMovePos = (pos: { y: number; x: number }, move: Move) => {
    switch (move) {
      case '<':
        return { y: pos.y, x: pos.x - 1 };
      case '>':
        return { y: pos.y, x: pos.x + 1 };
      case '^':
        return { y: pos.y - 1, x: pos.x };
      case 'v':
        return { y: pos.y + 1, x: pos.x };
    }
  };

  const tryToMoveBoxes = (
    map: MapNode[][],
    pos: { x: number; y: number },
    boxMap: Map<string, Box>,
    move: Move
  ) => {
    const boxesThatCanBeMoved: Box[] = [];
    let currentPos = { ...pos };
    if (map[currentPos.y][currentPos.x].type === '#') {
      throw new Error('robot is in a wall');
    }
    while (true) {
      if (move === '<' || move === '>') {
        if (map[currentPos.y][currentPos.x].type === '#') {
          break;
        }
        let howMuchToShift = 0;
        if (move === '<') {
          if (boxMap.has(`${currentPos.y},${currentPos.x - 1}`)) {
            boxesThatCanBeMoved.push(
              boxMap.get(`${currentPos.y},${currentPos.x - 1}`)
            );
            howMuchToShift = 2;
          } else if (map[currentPos.y][currentPos.x].type === '.') {
            // we can move the boxes
            return boxesThatCanBeMoved;
          }
        } else if (move === '>') {
          if (boxMap.has(`${currentPos.y},${currentPos.x}`)) {
            boxesThatCanBeMoved.push(
              boxMap.get(`${currentPos.y},${currentPos.x}`)
            );
            howMuchToShift = 2;
          } else if (map[currentPos.y][currentPos.x].type === '.') {
            // we can move the boxes
            return boxesThatCanBeMoved;
          }
        } else {
          throw new Error('invalid move');
        }
        for (let i = 0; i < howMuchToShift; i++) {
          currentPos = nextMovePos(currentPos, move);
        }
      } else {
        if (boxesThatCanBeMoved.length === 0) {
          // console.log('no boxes yet');
          if (boxMap.has(`${currentPos.y},${currentPos.x}`)) {
            boxesThatCanBeMoved.push(
              boxMap.get(`${currentPos.y},${currentPos.x}`)
            );
          } else if (boxMap.has(`${currentPos.y},${currentPos.x - 1}`)) {
            boxesThatCanBeMoved.push(
              boxMap.get(`${currentPos.y},${currentPos.x - 1}`)
            );
          } else if (map[currentPos.y][currentPos.x].type === '.') {
            // we can move the boxes
            return boxesThatCanBeMoved;
          }
        } else {
          // we find the next box for all the boxesThatCanBeMoved
          const lastLineOfBoxes = [...boxesThatCanBeMoved].filter(
            (b) => b.y === currentPos.y + (move === '^' ? 1 : -1)
          );
          console.log('lastLineOfBoxes', lastLineOfBoxes);
          // console.log(
          //   'We have boxes that can be moved:',
          //   boxesThatCanBeMoved,
          //   lastLineOfBoxes,
          //   currentPos,
          //   currentPos.y + (move === '^' ? 1 : -1)
          // );
          const boxesThatCanBeMovedCopy: Box[] = [];
          let clearPathFor = 0;
          for (let i = 0; i < lastLineOfBoxes.length; i++) {
            console.log('checking box:', lastLineOfBoxes[i]);
            //console.log('currentPos:', currentPos);
            const currentBox = lastLineOfBoxes[i];
            const nextBoxPos = nextMovePos(currentBox, move);
            console.log('nextBoxPos:', nextBoxPos);
            if (
              map[nextBoxPos.y][nextBoxPos.x].type === '#' ||
              map[nextBoxPos.y][nextBoxPos.x + 1].type === '#'
            ) {
              return null; // cannot move any boxes
            }
            // next box position is in line with the current box
            else if (boxMap.has(`${nextBoxPos.y},${nextBoxPos.x}`)) {
              const theBox = boxMap.get(`${nextBoxPos.y},${nextBoxPos.x}`);
              // console.log('#### DIRECTLY IN FRONT ####', theBox);
              // check if that box is already in the list
              if (!boxesThatCanBeMovedCopy.includes(theBox)) {
                boxesThatCanBeMovedCopy.push(
                  boxMap.get(`${nextBoxPos.y},${nextBoxPos.x}`)
                );
              }
            } else if (
              boxMap.has(`${nextBoxPos.y},${nextBoxPos.x - 1}`) || // next box position is offset by 1 to the left
              boxMap.has(`${nextBoxPos.y},${nextBoxPos.x + 1}`) // next box position is offset by 1 to the right
            ) {
              if (boxMap.has(`${nextBoxPos.y},${nextBoxPos.x - 1}`)) {
                console.log('#### OFFSET BY 1 TO LEFT ####');
                const theBox = boxMap.get(
                  `${nextBoxPos.y},${nextBoxPos.x - 1}`
                );
                // console.log('Found box to the left:', theBox);
                // check if that box is already in the list
                if (!boxesThatCanBeMovedCopy.includes(theBox)) {
                  console.log('ADDING BOX TO THE LEFT:', theBox);
                  boxesThatCanBeMovedCopy.push(
                    boxMap.get(`${nextBoxPos.y},${nextBoxPos.x - 1}`)
                  );
                }
              }
              if (boxMap.has(`${nextBoxPos.y},${nextBoxPos.x + 1}`)) {
                console.log('#### OFFSET BY 1 TO RIGHT ####');
                const theBox = boxMap.get(
                  `${nextBoxPos.y},${nextBoxPos.x + 1}`
                );
                //console.log('Found box to the right:', theBox);
                // check if that box is already in the list
                if (!boxesThatCanBeMovedCopy.includes(theBox)) {
                  console.log('ADDING BOX TO THE RIGHT:', theBox);
                  boxesThatCanBeMovedCopy.push(theBox);
                }
              }
            } else if (
              map[nextBoxPos.y][nextBoxPos.x].type === '.' &&
              map[nextBoxPos.y][nextBoxPos.x + 1].type === '.'
            ) {
              // console.log('#### CLEAR PATH ####');
              clearPathFor++;
            }
          }
          if (clearPathFor == lastLineOfBoxes.length) {
            return boxesThatCanBeMoved;
          }
          boxesThatCanBeMoved.push(...boxesThatCanBeMovedCopy);
        }
        currentPos = nextMovePos(currentPos, move);
      }
    }
    return null;
  };

  const updateBoxMap = (boxes: Box[]) => {
    boxMap.clear();
    for (const box of boxes) {
      boxMap.set(`${box.y},${box.x}`, box);
    }
  };

  const moveBoxes = (boxes: Box[], move: Move) => {
    for (const box of boxes) {
      const nextBoxPos = nextMovePos(box, move);
      box.x = nextBoxPos.x;
      box.y = nextBoxPos.y;
    }
  };

  const DEBUG = true;

  const currentPos = start;
  for (const move of moves) {
    if (DEBUG) console.log(move);
    // get a list of all boxes that might be moved
    const nextPos = nextMovePos(currentPos, move);
    if (map[nextPos.y][nextPos.x].type === '#') {
      // console.log('hit wall');
      continue;
    }
    const result = tryToMoveBoxes(map, nextPos, boxMap, move);
    if (DEBUG) console.log('result:', result);
    if (Array.isArray(result)) {
      // move the boxes
      moveBoxes(result, move);
      // update the boxMap
      updateBoxMap(boxes);

      // move the robot
      currentPos.x = nextPos.x;
      currentPos.y = nextPos.y;
    } else {
      // console.log('hit wall');
    }
    if (DEBUG) printMap(map, currentPos, boxMap);

    // validate the integrity
    for (const box of boxes) {
      if (map[box.y][box.x].type === '#') {
        throw new Error('box is in a wall');
      }
      if (map[box.y][box.x + 1].type === '#') {
        throw new Error('box is in a wall');
      }
      if (box.x === currentPos.x && box.y === currentPos.y) {
        throw new Error('we are on top of a box');
      }
      if (box.x + 1 === currentPos.x && box.y === currentPos.y) {
        throw new Error('we are on top of a box');
      }
      // check if there are intersecting boxes
      for (const otherBox of boxes) {
        if (box === otherBox) continue;
        if (box.x === otherBox.x && box.y === otherBox.y) {
          throw new Error('intersecting boxes');
        }
        if (box.x + 1 === otherBox.x && box.y === otherBox.y) {
          throw new Error('intersecting boxes');
        }
      }
    }
  }
  let sum = 0;
  // calculate the sum
  for (const box of boxes) {
    const gps = 100 * box.y + box.x;
    // console.log('box', box, gps);
    sum += gps;
  }

  // check if any boxes are in walls
  for (const box of boxes) {
    if (map[box.y][box.x].type === '#') {
      throw new Error('box is in a wall: ' + JSON.stringify(box));
    }
  }

  // printMap(map, currentPos, boxMap);

  return sum;
}

await runSolution(day15a);
