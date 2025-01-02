import { Grid, Node } from '../types/grid'

export function createInitialGrid(rows: number, cols: number): Grid {
	const grid: Grid = []

	for (let row = 0; row < rows; row++) {
		const currentRow: Node[] = []
		for (let col = 0; col < cols; col++) {
			currentRow.push({
				row,
				col,
				type: 'empty',
				distance: Infinity,
				isVisited: false,
				previousNode: null,
			})
		}
		grid.push(currentRow)
	}

	return grid
}

// Dijkstra algorithm with BFS. Priority queue using min heap
export function dijkstra(grid: Grid, startNode: Node, endNode: Node): Node[] {
	startNode.distance = 0

	const visitedNodesInOrder: Node[] = []
	// Normally, we'd only queue nodes that is relevant to find the shortest path
	// However, to visualize the grid nodes, we add all the nodes in the grid
	// and change their type according to their state.
	const unvisitedNodes = getAllNodes(grid)

	while (unvisitedNodes.length) {
		// Initially, all distance will be infinite except for startNode
		// After running the first cycle, we'd have more nodes with distances
		// that are not infinite, because we've set the distance when we were updating
		// neighbors
		sortNodesByDistance(unvisitedNodes)
		// Initially, closesNode = startNode
		// Dequeue the closest node by distance
		// At this point we do not need to use startNode's distance as each of its
		// neighbors have that information set through updateUnvisitedNeighbor
		const closestNode = unvisitedNodes.shift()!

		// If the closestNode is a wall, skip this iteration
		if (closestNode.type === 'wall') continue
		// If the closestNode is infinite, that means that the path
		// to end has been found
		if (closestNode.distance === Infinity) return visitedNodesInOrder

		// If conditions are met, the node has been visited
		closestNode.isVisited = true
		visitedNodesInOrder.push(closestNode)

		// if the closestNode is the endNode, that means we can
		// find the shortest path
		if (closestNode === endNode) return visitedNodesInOrder

		updateUnvisitedNeighbors(closestNode, grid)
	}

	return visitedNodesInOrder
}

function sortNodesByDistance(unvisitedNodes: Node[]) {
	unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

function updateUnvisitedNeighbors(node: Node, grid: Grid) {
	const neighbors = getNeighbors(node, grid)
	for (const neighbor of neighbors) {
		// for every neighbor, we update the distance by 1 from the closestNode
		neighbor.distance = node.distance + 1
		// set the previous node as the closestNode
		neighbor.previousNode = node
	}
}

/**
 * Get every neighbor from every direction of the node. up, down, left and right.
 */
function getNeighbors(node: Node, grid: Grid): Node[] {
	const neighbors: Node[] = []
	const { row, col } = node

	// Get top node
	if (row > 0) {
		neighbors.push(grid[row - 1][col])
	}

	// Get bottom node
	if (row < grid.length - 1) {
		neighbors.push(grid[row + 1][col])
	}

	// Get left node
	if (col > 0) {
		neighbors.push(grid[row][col - 1])
	}

	// Get right node
	if (col < grid[0].length - 1) {
		neighbors.push(grid[row][col + 1])
	}

	// Return only nodes that are not visited
	return neighbors.filter(neighbor => !neighbor.isVisited)
}

function getAllNodes(grid: Grid): Node[] {
	const nodes: Node[] = []
	for (const row of grid) {
		for (const node of row) {
			nodes.push(node)
		}
	}
	return nodes
}

export function getNodesInShortestPath(finishNode: Node): Node[] {
	const nodesInShortestPath: Node[] = []
	let currentNode: Node | null = finishNode

	while (currentNode !== null) {
		nodesInShortestPath.unshift(currentNode)
		currentNode = currentNode.previousNode
	}

	return nodesInShortestPath
}
