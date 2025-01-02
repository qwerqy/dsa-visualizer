import React from 'react'
import { Play, Eraser, Bomb } from 'lucide-react'

interface ControlsProps {
	onVisualize: () => void
	onRandomizeWalls: () => void
	onClear: () => void
	isVisualizing: boolean
}

export function Controls({
	onVisualize,
	onRandomizeWalls,
	onClear,
	isVisualizing,
}: ControlsProps) {
	return (
		<div className="flex flex-col sm:flex-row gap-4 mb-6">
			<button
				onClick={onVisualize}
				disabled={isVisualizing}
				className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<Play size={16} /> Visualize
			</button>
			<button
				onClick={onRandomizeWalls}
				disabled={isVisualizing}
				className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<Bomb size={16} /> Randomize Walls
			</button>
			<button
				onClick={onClear}
				disabled={isVisualizing}
				className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<Eraser size={16} /> Clear
			</button>
		</div>
	)
}
