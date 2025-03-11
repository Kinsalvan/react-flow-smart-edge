import React from 'react';
import { BezierEdge, useNodes } from '@xyflow/react';
import type { Edge, EdgeProps, Node } from '@xyflow/react';
import { pathfindingAStarDiagonal, svgDrawSmoothLinePath } from '../functions';
import { SmartEdge } from '../SmartEdge';
import type { SmartEdgeOptions } from '../SmartEdge';

const BezierConfiguration: SmartEdgeOptions = {
  drawEdge: svgDrawSmoothLinePath,
  generatePath: pathfindingAStarDiagonal,
  fallback: BezierEdge,
};

export function SmartBezierEdge<
  EdgeDataType extends Edge<Record<string, unknown>, string | undefined>,
  NodeDataType extends Node,
>(props: EdgeProps<EdgeDataType>) {
  const nodes = useNodes<Node<NodeDataType>>();

  return (
    <SmartEdge<EdgeDataType, NodeDataType> {...props} options={BezierConfiguration} nodes={nodes} />
  );
}
