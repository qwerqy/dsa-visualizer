import { Grid, Node } from '../types/grid';

export function createInitialGrid(rows: number, cols: number): Grid {
  const grid: Grid = [];
  
  for (let row = 0; row < rows; row++) {
    const currentRow: Node[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        type: 'empty',
        distance: Infinity,
        isVisited: false,
        previousNode: null,
      });
    }
    grid.push(currentRow);
  }
  
  return grid;
}

export function dijkstra(grid: Grid, startNode: Node, endNode: Node): Node[] {
  const visitedNodesInOrder: Node[] = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  
  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift()!;
    
    if (closestNode.type === 'wall') continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    
    if (closestNode === endNode) return visitedNodesInOrder;
    
    updateUnvisitedNeighbors(closestNode, grid);
  }
  
  return visitedNodesInOrder;
}

function sortNodesByDistance(unvisitedNodes: Node[]) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node: Node, grid: Grid) {
  const neighbors = getNeighbors(node, grid);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getNeighbors(node: Node, grid: Grid): Node[] {
  const neighbors: Node[] = [];
  const { row, col } = node;
  
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid: Grid): Node[] {
  const nodes: Node[] = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function getNodesInShortestPath(finishNode: Node): Node[] {
  const nodesInShortestPath: Node[] = [];
  let currentNode: Node | null = finishNode;
  
  while (currentNode !== null) {
    nodesInShortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  return nodesInShortestPath;
}