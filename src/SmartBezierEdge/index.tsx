import React from 'react';
import {
  BezierEdge,
  useEdges,
  useNodes,
  type Edge,
  type EdgeProps,
  type Node,
} from '@xyflow/react';
import { pathfindingAStarDiagonal, svgDrawSmoothLinePath } from '../functions';
import { SmartEdge, type SmartEdgeOptions } from '../SmartEdge';

const BezierConfiguration: SmartEdgeOptions = {
  drawEdge: svgDrawSmoothLinePath,
  generatePath: pathfindingAStarDiagonal,
  fallback: BezierEdge,
  avoidExistingPaths: true, // Set to a boolean value as required
};

export function SmartBezierEdge<
  EdgeDataType extends Edge<Record<string, unknown>, string | undefined>, // Constrain EdgeDataType
  NodeDataType extends Node,
>(props: EdgeProps<Edge<EdgeDataType>>) {
  const nodes = useNodes<Node<NodeDataType>>();
  const edges = useEdges<Edge<EdgeDataType>>(); // Ensure edges are retrieved here

  // Log edges for debugging
  console.log('Edges passed to SmartBezierEdge:', edges);

  return (
    <SmartEdge<EdgeDataType, NodeDataType>
      avoidExistingPaths={BezierConfiguration.avoidExistingPaths ?? false}
      {...props}
      options={BezierConfiguration}
      nodes={nodes}
      edges={edges} // Pass edges to SmartEdge
    />
  );
}
