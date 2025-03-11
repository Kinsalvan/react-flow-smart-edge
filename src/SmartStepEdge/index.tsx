import React from 'react';
import { StepEdge, useNodes } from '@xyflow/react';
import type { Edge, EdgeProps, Node } from '@xyflow/react';
import { pathfindingJumpPointNoDiagonal, svgDrawStraightLinePath } from '../functions';
import { SmartEdge } from '../SmartEdge';
import type { EdgeElement, SmartEdgeOptions } from '../SmartEdge';

const StepConfiguration: SmartEdgeOptions = {
  drawEdge: svgDrawStraightLinePath,
  generatePath: pathfindingJumpPointNoDiagonal,
  fallback: StepEdge as EdgeElement,
};

export function SmartStepEdge<EdgeDataType extends Edge = Edge, NodeDataType extends Node = Node>(
  props: EdgeProps<EdgeDataType>
) {
  const nodes = useNodes<Node<NodeDataType>>();

  return (
    <SmartEdge<EdgeDataType, NodeDataType> {...props} options={StepConfiguration} nodes={nodes} />
  );
}
