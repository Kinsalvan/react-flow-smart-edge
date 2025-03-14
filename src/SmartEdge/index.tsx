import React from 'react';
import { BaseEdge, BezierEdge } from '@xyflow/react';
import type { Edge, EdgeProps, Node, StepEdge } from '@xyflow/react';
import { getSmartEdge } from '../getSmartEdge';
import type { GetSmartEdgeOptions } from '../getSmartEdge';

export type EdgeElement = typeof BezierEdge | typeof StepEdge;

export type SmartEdgeOptions = GetSmartEdgeOptions & {
  fallback?: EdgeElement;
};

export interface SmartEdgeProps<EdgeDataType extends Edge = Edge, NodeDataType extends Node = Node>
  extends EdgeProps<EdgeDataType> {
  nodes: Node<NodeDataType>[];
  options: SmartEdgeOptions;
}

export function SmartEdge<EdgeDataType extends Edge = Edge, NodeDataType extends Node = Node>({
  nodes,
  options,
  ...edgeProps
}: SmartEdgeProps<EdgeDataType, NodeDataType>) {
  const {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    style,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    markerEnd,
    markerStart,
    interactionWidth,
  } = edgeProps;

  const smartResponse = getSmartEdge({
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    options,
    nodes,
  });

  const FallbackEdge = options.fallback || BezierEdge;

  if (smartResponse === null) {
    return <FallbackEdge {...edgeProps} />;
  }

  const { edgeCenterX, edgeCenterY, svgPathString } = smartResponse;

  return (
    <BaseEdge
      path={svgPathString}
      labelX={edgeCenterX}
      labelY={edgeCenterY}
      label={label}
      labelStyle={labelStyle}
      labelShowBg={labelShowBg}
      labelBgStyle={labelBgStyle}
      labelBgPadding={labelBgPadding}
      labelBgBorderRadius={labelBgBorderRadius}
      style={style}
      markerStart={markerStart}
      markerEnd={markerEnd}
      interactionWidth={interactionWidth}
    />
  );
}

export type SmartEdgeFunction = typeof SmartEdge;
