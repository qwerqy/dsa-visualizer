import React from 'react';
import { Node, NodeType } from '../types/grid';

interface GridNodeProps {
  node: Node;
  onNodeClick: (row: number, col: number) => void;
  onNodeDrag: (row: number, col: number) => void;
}

const nodeStyles: Record<NodeType, string> = {
  empty: 'bg-white',
  wall: 'bg-gray-800',
  start: 'bg-green-500',
  end: 'bg-red-500',
  visited: 'bg-blue-200 animate-pulse',
  path: 'bg-yellow-300',
};

export function GridNode({ node, onNodeClick, onNodeDrag }: GridNodeProps) {
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    onNodeDrag(node.row, node.col);
  };

  return (
    <div
      className={`w-6 h-6 border border-gray-200 ${nodeStyles[node.type]} transition-colors duration-200`}
      onClick={() => onNodeClick(node.row, node.col)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrag}
      draggable={node.type === 'start' || node.type === 'end'}
    />
  );
}