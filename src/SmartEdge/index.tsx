import React from 'react';
import {
  BaseEdge,
  BezierEdge,
  type Edge,
  type EdgeProps,
  type Node,
  type StepEdge,
} from '@xyflow/react';
import { getSmartEdge, type GetSmartEdgeOptions } from '../getSmartEdge';

export type EdgeElement = typeof BezierEdge | typeof StepEdge;

export type SmartEdgeOptions = GetSmartEdgeOptions & {
  fallback?: EdgeElement;
  avoidExistingPaths?: boolean; // New option added
};

export interface SmartEdgeProps<EdgeDataType extends Edge = Edge, NodeDataType extends Node = Node>
  extends EdgeProps<EdgeDataType> {
  nodes: Node<NodeDataType>[];
  edges: Edge<EdgeDataType>[]; // Added to pass edges for existingPaths
  options: SmartEdgeOptions;
  avoidExistingPaths: boolean;
}

export function SmartEdge<EdgeDataType extends Edge = Edge, NodeDataType extends Node = Node>({
  nodes,
  options,
  avoidExistingPaths,
  edges,
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
    edges,
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
