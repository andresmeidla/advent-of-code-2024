import { runSolution } from '../utils.ts';

class MemoryPacker {
  public currentIndex = 0;
  public memoryMap: { fileIndex: number }[] = [];

  constructor(memoryMapIn: { fileIndex: number }[]) {
    for (const m of memoryMapIn) {
      this.memoryMap.push({ ...m });
    }
  }

  placeToFreeSpace(fileIndex: number, length: number) {
    let charsToPlace = length;
    while (this.currentIndex < this.memoryMap.length && charsToPlace > 0) {
      if (this.memoryMap[this.currentIndex].fileIndex === -1) {
        this.memoryMap[this.currentIndex] = { fileIndex };
        charsToPlace--;
      }
      this.currentIndex++;
    }
  }
}

/** provide your solution as the return of this function */
export async function day9a(data: string[]) {
  // console.log(data);
  const map = data[0].split('');
  const files = map.filter((c, i) => i % 2 === 0);
  const spaces = map.filter((c, i) => i % 2 === 1);

  const memoryMap: { fileIndex: number }[] = [];
  // const memoryMap = '';
  const filesIndexAndLength: {
    index: number;
    fileIndex: number;
    length: number;
  }[] = [];
  for (let i = 0; i < files.length; i++) {
    const len = parseInt(files[i]);
    for (let j = 0; j < len; j++) {
      memoryMap.push({ fileIndex: i });
    }
    filesIndexAndLength.push({
      index: memoryMap.length - len,
      fileIndex: i,
      length: len,
    });
    if (i < spaces.length) {
      const spaceLen = parseInt(spaces[i]);
      for (let j = 0; j < spaceLen; j++) {
        memoryMap.push({ fileIndex: -1 });
      }
    }
  }
  const mem = new MemoryPacker(memoryMap);

  const printMemoryMap = () => {
    let str = '';
    for (let i = 0; i < mem.memoryMap.length; i++) {
      str +=
        mem.memoryMap[i].fileIndex === -1 ? '.' : mem.memoryMap[i].fileIndex;
    }
    return str;
  };

  for (let i = filesIndexAndLength.length - 1; i >= 0; i--) {
    if (filesIndexAndLength[i].index <= mem.currentIndex) {
      continue;
    }
    for (let j = 0; j < filesIndexAndLength[i].length; j++) {
      mem.memoryMap[filesIndexAndLength[i].index + j] = { fileIndex: -1 };
    }
    mem.placeToFreeSpace(filesIndexAndLength[i].fileIndex, parseInt(files[i]));
  }

  // calculate checksum
  let sum = 0;
  for (let i = 0; i < mem.memoryMap.length; i++) {
    if (mem.memoryMap[i].fileIndex !== -1) {
      sum += mem.memoryMap[i].fileIndex * i;
    }
  }

  return sum;
}

await runSolution(day9a);
