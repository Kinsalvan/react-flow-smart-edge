import React from 'react';
import { StepEdge, useNodes, type Edge, type EdgeProps, type Node } from '@xyflow/react';
import { pathfindingJumpPointNoDiagonal, svgDrawStraightLinePath } from '../functions';
import { SmartEdge, type EdgeElement, type SmartEdgeOptions } from '../SmartEdge';

const StepConfiguration: SmartEdgeOptions = {
  drawEdge: svgDrawStraightLinePath,
  generatePath: pathfindingJumpPointNoDiagonal,
  fallback: StepEdge as EdgeElement,
  avoidExistingPaths: false,
};

export function SmartStepEdge<EdgeDataType extends Edge = Edge, NodeDataType extends Node = Node>(
  props: EdgeProps<EdgeDataType>
) {
  const nodes = useNodes<Node<NodeDataType>>();

  return (
    <SmartEdge<EdgeDataType, NodeDataType> {...props} options={StepConfiguration} nodes={nodes} />
  );
}
