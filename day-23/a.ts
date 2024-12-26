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
    const cliques: Set<Set<string>> = new Set();
    const nodes = Array.from(nodeLookup.keys());
    const expand = (
      clique: Set<string>,
      candidates: Set<string>,
      excluded: Set<string>
    ) => {
      // If the clique size is 3, add it to the set of cliques and return
      if (clique.size === 3) {
        cliques.add(new Set(clique));
        return;
      }
      candidates.forEach((node) => {
        // Create a new clique by adding the current node to the existing clique
        const newClique = new Set(clique).add(node);

        // Filter candidates to include only neighbors of the current node
        const newCandidates = new Set(
          candidates
            .values()
            .filter((neighbor) => nodeLookup.get(node).neighbors.has(neighbor))
        );

        // Filter excluded nodes to include only neighbors of the current node
        const newExcluded = new Set(
          candidates
            .values()
            .filter((neighbor) => nodeLookup.get(node).neighbors.has(neighbor))
        );

        // Recursively expand the new clique with the filtered candidates and excluded sets
        expand(newClique, newCandidates, newExcluded);

        // Remove the current node from candidates and add it to excluded
        candidates.delete(node);
        excluded.add(node);
      });
    };
    // Start the expansion with an empty clique, all nodes as candidates, and an empty excluded set
    expand(new Set(), new Set(nodes), new Set());
    return cliques;
  };

  const cliques = findCliques(nodeLookup);

  const cliquesOfThreeArray = Array.from(cliques)
    .map((clique) => Array.from(clique))
    .filter((clique) => clique.some((node) => node.startsWith('t')))
    .map((c) => c.sort())
    .map((c) => c.join('-'));

  const s = new Set<string>();
  cliquesOfThreeArray.forEach((clique) => s.add(clique));

  return s.size;
}

await runSolution(day23a);
