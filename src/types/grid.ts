export type NodeType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path';

export interface Node {
  row: number;
  col: number;
  type: NodeType;
  distance: number;
  isVisited: boolean;
  previousNode: Node | null;
}

export type Grid = Node[][];