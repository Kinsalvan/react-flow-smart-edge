import React from 'react';
import { StraightEdge, useNodes, type Edge, type EdgeProps, type Node } from '@xyflow/react';
import { pathfindingAStarNoDiagonal, svgDrawStraightLinePath } from '../functions';
import { SmartEdge, type SmartEdgeOptions } from '../SmartEdge';

const StraightConfiguration: SmartEdgeOptions = {
  drawEdge: svgDrawStraightLinePath,
  generatePath: pathfindingAStarNoDiagonal,
  fallback: StraightEdge,
  avoidExistingPaths: true, // New option added
};

export function SmartStraightEdge<
  EdgeDataType extends Edge = Edge,
  NodeDataType extends Node = Node,
>(props: EdgeProps<EdgeDataType>) {
  const nodes = useNodes<Node<NodeDataType>>();

  return (
    <SmartEdge<EdgeDataType, NodeDataType>
      {...props}
      options={StraightConfiguration}
      nodes={nodes}
    />
  );
}
