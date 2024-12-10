import { runSolution } from '../utils.ts';

class Node<T> {
  data: T;
  priority: number;
  next: Node<T> | null = null;

  constructor(data: T, priority: number) {
    this.data = data;
    this.priority = priority;
  }
}

class PriorityQueue<T> {
  private head: Node<T> | null = null;

  enqueue(data: T, priority: number): void {
    const newNode = new Node(data, priority);
    if (!this.head || this.head.priority > priority) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next && current.next.priority <= priority) {
        current = current.next;
      }
      newNode.next = current.next;
      current.next = newNode;
    }
  }

  dequeue(): T | null {
    if (!this.head) return null;
    const removedNode = this.head;
    this.head = this.head.next;
    return removedNode.data;
  }

  isEmpty(): boolean {
    return this.head === null;
  }

  peek(): T | null {
    return this.head ? this.head.data : null;
  }

  peekAtIndex(index: number): T | null {
    if (index < 0) return null;
    let current = this.head;
    let currentIndex = 0;
    while (current && currentIndex < index) {
      current = current.next;
      currentIndex++;
    }
    return current ? current.data : null;
  }

  deleteAtIndex(index: number): T | null {
    if (index < 0 || !this.head) return null;
    if (index === 0) {
      const removedNode = this.head;
      this.head = this.head.next;
      return removedNode.data;
    }
    let current = this.head;
    let currentIndex = 0;
    while (current.next && currentIndex < index - 1) {
      current = current.next;
      currentIndex++;
    }
    if (!current.next) return null;
    const removedNode = current.next;
    current.next = current.next.next;
    return removedNode.data;
  }
}

class MemoryPacker {
  public memoryMap: { fileIndex: number }[] = [];
  public prioQueue = new PriorityQueue<{ index: number; length: number }>();

  constructor(
    memoryMapIn: { fileIndex: number }[],
    spaces: { index: number; length: number }[]
  ) {
    for (const m of memoryMapIn) {
      this.memoryMap.push({ ...m });
    }
    for (const s of spaces) {
      this.prioQueue.enqueue(s, s.index);
    }
  }

  placeToFreeSpace(
    {
      fileIndex,
      index,
      length,
    }: {
      fileIndex: number;
      index: number;
      length: number;
    },
    removeExisting: () => void
  ) {
    // peek the next free space that has the length needed
    let currentIndex = 0;
    let cur: { index: number; length: number } | null =
      this.prioQueue.peekAtIndex(currentIndex);
    while (cur && cur.length < length) {
      currentIndex++;
      cur = this.prioQueue.peekAtIndex(currentIndex);
    }
    if (cur) {
      // console.log('FOUND for', fileIndex, 'index', index, 'cur', cur);
      if (cur.index >= index) {
        return;
      }
      // place the file to the free space
      removeExisting();
      for (let i = 0; i < length; i++) {
        this.memoryMap[cur.index + i] = { fileIndex };
      }
      // remove the free space from the queue if it is used up fully
      if (cur.length === length) {
        this.prioQueue.deleteAtIndex(currentIndex);
      } else {
        // update the free space length
        this.prioQueue.deleteAtIndex(currentIndex);
        this.prioQueue.enqueue(
          { index: cur.index + length, length: cur.length - length },
          cur.index + length
        );
      }
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

  const spacesIndexAndLength: {
    index: number;
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
      spacesIndexAndLength.push({
        index: memoryMap.length,
        length: spaceLen,
      });
      for (let j = 0; j < spaceLen; j++) {
        memoryMap.push({ fileIndex: -1 });
      }
    }
  }
  const mem = new MemoryPacker(memoryMap, spacesIndexAndLength);

  const printMemoryMap = () => {
    let str = '';
    for (let i = 0; i < mem.memoryMap.length; i++) {
      str +=
        mem.memoryMap[i].fileIndex === -1
          ? '.'
          : `(${mem.memoryMap[i].fileIndex})`;
    }
    return str;
  };

  // console.log('Start: ', printMemoryMap());

  for (let i = filesIndexAndLength.length - 1; i >= 0; i--) {
    mem.placeToFreeSpace(filesIndexAndLength[i], () => {
      // remove the existing file
      for (let j = 0; j < filesIndexAndLength[i].length; j++) {
        mem.memoryMap[filesIndexAndLength[i].index + j] = { fileIndex: -1 };
      }
    });
  }

  // console.log('now: ', printMemoryMap());

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
