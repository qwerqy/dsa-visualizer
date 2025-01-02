import React, { useState, useCallback } from 'react'
import { GridNode } from './components/GridNode'
import { Controls } from './components/Controls'
import { Grid, Node, NodeType } from './types/grid'
import {
	createInitialGrid,
	dijkstra,
	getNodesInShortestPath,
} from './utils/pathfinding'

const ROWS = 20
const COLS = 40

function App() {
	const [grid, setGrid] = useState<Grid>(() => {
		const initialGrid = createInitialGrid(ROWS, COLS)
		initialGrid[9][9].type = 'start'
		initialGrid[9][29].type = 'end'
		return initialGrid
	})
	const [isVisualizing, setIsVisualizing] = useState(false)
	const [mouseIsPressed, setMouseIsPressed] = useState(false)
	const [draggedNodeType, setDraggedNodeType] = useState<NodeType | null>(null)

	const handleNodeClick = (row: number, col: number) => {
		if (isVisualizing) return

		const newGrid = grid.map(rowArray => [...rowArray])
		const node = newGrid[row][col]

		if (node.type === 'empty') {
			node.type = 'wall'
		} else if (node.type === 'wall') {
			node.type = 'empty'
		}

		setGrid(newGrid)
	}

	const handleNodeDragStart = useCallback((type: NodeType) => {
		setDraggedNodeType(type)
	}, [])

	const handleNodeDrag = useCallback(
		(row: number, col: number) => {
			if (isVisualizing) return

			const newGrid = grid.map(rowArray => [...rowArray])
			const node = newGrid[row][col]

			for (const row of grid) {
				for (const node of row) {
					if (node.type === draggedNodeType) {
						node.type = 'empty'
					}
				}
			}

			if (draggedNodeType) {
				node.type = draggedNodeType
				setDraggedNodeType(null)
			}

			setGrid(newGrid)
		},
		[grid, isVisualizing, draggedNodeType],
	)

	const visualize = async () => {
		if (isVisualizing) return
		setIsVisualizing(true)

		const startNode = grid.flat().find(node => node.type === 'start')!
		const endNode = grid.flat().find(node => node.type === 'end')!

		const visitedNodesInOrder = dijkstra(grid, startNode, endNode)
		const nodesInShortestPath = getNodesInShortestPath(endNode)

		// Animate visited nodes
		for (let i = 0; i < visitedNodesInOrder.length; i++) {
			const node = visitedNodesInOrder[i]
			if (node.type !== 'start' && node.type !== 'end') {
				setTimeout(() => {
					setGrid(prev => {
						const newGrid = prev.map(row => [...row])
						newGrid[node.row][node.col].type = 'visited'
						return newGrid
					})
				}, i * 20)
			}
		}

		// Animate shortest path
		setTimeout(() => {
			for (let i = 0; i < nodesInShortestPath.length; i++) {
				const node = nodesInShortestPath[i]
				if (node.type !== 'start' && node.type !== 'end') {
					setTimeout(() => {
						setGrid(prev => {
							const newGrid = prev.map(row => [...row])
							newGrid[node.row][node.col].type = 'path'
							return newGrid
						})
					}, i * 50)
				}
			}
			setTimeout(() => setIsVisualizing(false), nodesInShortestPath.length * 50)
		}, visitedNodesInOrder.length * 20)
	}

	const clearGrid = () => {
		if (isVisualizing) return
		const newGrid = createInitialGrid(ROWS, COLS)
		newGrid[9][9].type = 'start'
		newGrid[9][29].type = 'end'
		setGrid(newGrid)
	}

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-4">
					Pathfinding Visualizer
				</h1>
				<p className="text-gray-600 mb-6">
					Click to add/remove walls. Drag start (green) and end (red) points to
					move them. Click "Visualize" to see Dijkstra's algorithm in action!
				</p>

				<Controls
					onVisualize={visualize}
					onClear={clearGrid}
					isVisualizing={isVisualizing}
				/>

				<div
					className="inline-grid gap-0 bg-white p-4 rounded-lg shadow-lg"
					style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
					onMouseDown={() => setMouseIsPressed(true)}
					onMouseUp={() => setMouseIsPressed(false)}
					onMouseLeave={() => setMouseIsPressed(false)}
				>
					{grid.map((row, rowIdx) =>
						row.map((node, nodeIdx) => (
							<GridNode
								key={`${rowIdx}-${nodeIdx}`}
								node={node}
								onNodeClick={handleNodeClick}
								onNodeDrag={handleNodeDrag}
								onNodeDragStart={handleNodeDragStart}
							/>
						)),
					)}
				</div>
			</div>
		</div>
	)
}

export default App
