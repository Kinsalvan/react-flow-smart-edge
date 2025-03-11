import React from 'react';
import { StraightEdge, useNodes } from '@xyflow/react';
import type { Edge, EdgeProps, Node } from '@xyflow/react';
import { pathfindingAStarNoDiagonal, svgDrawStraightLinePath } from '../functions';
import { SmartEdge } from '../SmartEdge';
import type { SmartEdgeOptions } from '../SmartEdge';

const StraightConfiguration: SmartEdgeOptions = {
  drawEdge: svgDrawStraightLinePath,
  generatePath: pathfindingAStarNoDiagonal,
  fallback: StraightEdge,
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
