import type { Edge, EdgeProps, Node } from '@xyflow/react';
import {
  createGrid,
  extractExistingPaths,
  getBoundingBoxes,
  gridToGraphPoint,
  pathfindingAStarDiagonal,
  svgDrawSmoothLinePath,
  toInteger,
  type PathFindingFunction,
  type PointInfo,
  type SVGDrawFunction,
} from '../functions';

export type EdgeParams = Pick<
  EdgeProps,
  'sourceX' | 'sourceY' | 'targetX' | 'targetY' | 'sourcePosition' | 'targetPosition'
>;

export type GetSmartEdgeOptions = {
  gridRatio?: number;
  nodePadding?: number;
  drawEdge?: SVGDrawFunction;
  generatePath?: PathFindingFunction;
  avoidExistingPaths?: boolean; // New option added
};

export type GetSmartEdgeParams<
  NodeDataType extends Node = Node,
  EdgeDataType extends Record<string, unknown> = Record<string, unknown>,
> = EdgeParams & {
  options?: GetSmartEdgeOptions;
  nodes: Node<NodeDataType>[];
  edges?: Edge<EdgeDataType>[]; // Ensure edges are typed correctly
  id?: string; // Added to identify the current edge
};

export type GetSmartEdgeReturn = {
  svgPathString: string;
  edgeCenterX: number;
  edgeCenterY: number;
};

export const getSmartEdge = <
  NodeDataType extends Node = Node,
  EdgeDataType extends Record<string, unknown> = Record<string, unknown>,
>(
  params: GetSmartEdgeParams<NodeDataType, EdgeDataType>
): GetSmartEdgeReturn | null => {
  try {
    const {
      options = {},
      nodes = [],
      edges = [], // Ensure edges are passed here
      id, // Current edge ID
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    } = params;

    const {
      drawEdge = svgDrawSmoothLinePath,
      generatePath = pathfindingAStarDiagonal,
      avoidExistingPaths = options.avoidExistingPaths === true,
    } = options;

    let { gridRatio = 10, nodePadding = 10 } = options;
    gridRatio = toInteger(gridRatio);
    nodePadding = toInteger(nodePadding);

    // Generate bounding boxes for nodes and the graph
    const { graphBox, nodeBoxes } = getBoundingBoxes<NodeDataType>(nodes, nodePadding, gridRatio);

    const source: PointInfo = {
      x: sourceX,
      y: sourceY,
      position: sourcePosition,
    };

    const target: PointInfo = {
      x: targetX,
      y: targetY,
      position: targetPosition,
    };

    // Extract existing paths and filter out the current edge
    const existingPaths = avoidExistingPaths
      ? extractExistingPaths(edges).filter((path, index) => edges[index].id !== id)
      : [];

    // Log extracted paths for debugging
    console.log('Extracted paths for avoidExistingPaths:', existingPaths);

    // Create the grid representation
    const { grid, start, end } = createGrid(
      graphBox,
      nodeBoxes,
      source,
      target,
      gridRatio,
      existingPaths,
      avoidExistingPaths
    );

    // Perform pathfinding
    const generatePathResult = generatePath(grid, start, end);

    // If no path is found, return null to trigger the fallback
    if (!generatePathResult || !generatePathResult.smoothedPath.length) {
      return null;
    }

    const { fullPath, smoothedPath } = generatePathResult;

    // Convert the grid path to graph coordinates
    const graphPath = smoothedPath.map((gridPoint) => {
      const [x, y] = gridPoint;
      const graphPoint = gridToGraphPoint({ x, y }, graphBox.xMin, graphBox.yMin, gridRatio);
      return [graphPoint.x, graphPoint.y];
    });

    // Draw the edge using the graph path
    const svgPathString = drawEdge(source, target, graphPath);

    // Compute the edge's middle point for label positioning
    const index = Math.floor(fullPath.length / 2);
    const middlePoint = fullPath[index];
    const [middleX, middleY] = middlePoint;
    const { x: edgeCenterX, y: edgeCenterY } = gridToGraphPoint(
      { x: middleX, y: middleY },
      graphBox.xMin,
      graphBox.yMin,
      gridRatio
    );

    return { svgPathString, edgeCenterX, edgeCenterY };
  } catch (error) {
    console.error('Error in getSmartEdge:', error);
    return null;
  }
};

export type GetSmartEdgeFunction = typeof getSmartEdge;
