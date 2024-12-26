import { runSolution } from '../utils.ts';

type Node = {
  id: string;
  neighbors: Set<string>;
};

type Edge = {
  from: string;
  to: string;
};

/** provide your solution as the return of this function */
export async function day23a(data: string[]) {
  const nodes: Node[] = [];
  const set = new Set<string>();

  const edges: Edge[] = data.map((line) => {
    const [from, to] = line.split('-');
    set.add(from);
    set.add(to);
    return { from, to };
  });

  set.values().forEach((id) => {
    nodes.push({ id, neighbors: new Set() });
  });

  const nodeLookup = new Map<string, Node>();
  nodes.forEach((node) => {
    nodeLookup.set(node.id, node);
  });

  const createGraph = (edges: Edge[]): void => {
    edges.forEach((edge) => {
      nodeLookup.get(edge.from)?.neighbors.add(edge.to);
      nodeLookup.get(edge.to)?.neighbors.add(edge.from);
    });
  };

  createGraph(edges);

  const findCliques = (nodeLookup: Map<string, Node>): Set<Set<string>> => {
    // Bron-Kerbosch algorithm
    const cliques: Set<Set<string>> = new Set();
    const nodes = Array.from(nodeLookup.keys());
    const expand = (
      clique: Set<string>,
      candidates: Set<string>,
      excluded: Set<string>
    ): void => {
      // console.log(
      //   pad(`### Expand: ${Array.from(clique).join(', ')}`, 30),
      //   pad(`Candidates: ${Array.from(candidates).join(', ')}`, 30),
      //   pad(`Excluded: ${Array.from(excluded).join(', ')}`, 30)
      // );
      if (candidates.size === 0 && excluded.size === 0) {
        // console.log('!!! Found Clique:', Array.from(clique).join(', '));
        cliques.add(new Set(clique));
        return;
      }
      candidates.forEach((node) => {
        const newClique = new Set(clique).add(node);
        const newCandidates = new Set(
          candidates
            .values()
            .filter((c) => nodeLookup.get(node).neighbors.has(c))
        );
        const newExcluded = new Set(
          candidates
            .values()
            .filter((c) => nodeLookup.get(node).neighbors.has(c))
        );
        expand(newClique, newCandidates, newExcluded);
        candidates.delete(node);
        excluded.add(node);
      });
    };
    expand(new Set(), new Set(nodes), new Set());
    return cliques;
  };

  const cliques = findCliques(nodeLookup);

  const largestClique = Array.from(cliques).reduce((acc, clique) => {
    return clique.size > acc.size ? clique : acc;
  }, new Set<string>()); // initialize with an empty set
  const password = Array.from(largestClique).sort().join(',');

  console.log('password:', password);
  return password;
}

await runSolution(day23a);
