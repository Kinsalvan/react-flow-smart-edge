import type { Position, XYPosition } from '@xyflow/react';
import { Grid } from 'pathfinding';
import type { GraphBoundingBox, NodeBoundingBox } from './getBoundingBoxes';
import { getNextPointFromPosition, guaranteeWalkablePath } from './guaranteeWalkablePath';
import { graphToGridPoint } from './pointConversion';
import { round, roundUp } from './utils';

export type PointInfo = {
  x: number;
  y: number;
  position: Position;
};

export const createGrid = (
  graph: GraphBoundingBox,
  nodes: NodeBoundingBox[],
  source: PointInfo,
  target: PointInfo,
  gridRatio = 2,
  existingPaths: XYPosition[][] = [], // Existing paths parameter
  avoidExistingPaths: boolean
) => {
  const { xMin, yMin, width, height } = graph;

  // Create the grid representation
  const mapColumns = roundUp(width, gridRatio) / gridRatio + 1;
  const mapRows = roundUp(height, gridRatio) / gridRatio + 1;
  const grid = new Grid(mapColumns, mapRows);

  // Mark nodes as non-walkable
  nodes.forEach((node) => {
    const nodeStart = graphToGridPoint(node.topLeft, xMin, yMin, gridRatio);
    const nodeEnd = graphToGridPoint(node.bottomRight, xMin, yMin, gridRatio);

    for (let x = nodeStart.x; x < nodeEnd.x; x++) {
      for (let y = nodeStart.y; y < nodeEnd.y; y++) {
        grid.setWalkableAt(x, y, false);
      }
    }
  });

  // Mark existing paths as non-walkable if the option is enabled
  if (avoidExistingPaths) {
    existingPaths.forEach((path) => {
      path.forEach((point) => {
        const gridPoint = graphToGridPoint(point, xMin, yMin, gridRatio);

        // Add padding of 1 around each point in the path
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const paddedX = gridPoint.x + dx;
            const paddedY = gridPoint.y + dy;

            if (grid.isInside(paddedX, paddedY)) {
              grid.setWalkableAt(paddedX, paddedY, false);
            }
          }
        }
      });
    });
  }

  // Convert source and target points to grid points
  const startGrid = graphToGridPoint(
    {
      x: round(source.x, gridRatio),
      y: round(source.y, gridRatio),
    },
    xMin,
    yMin,
    gridRatio
  );

  const endGrid = graphToGridPoint(
    {
      x: round(target.x, gridRatio),
      y: round(target.y, gridRatio),
    },
    xMin,
    yMin,
    gridRatio
  );

  // Convert existing paths to grid points
  const gridExistingPaths = existingPaths.map((path) =>
    path.map((point) => graphToGridPoint(point, xMin, yMin, gridRatio))
  );

  // Guarantee walkable paths for source and target
  const startingNode = grid.getNodeAt(startGrid.x, startGrid.y);
  guaranteeWalkablePath(grid, startingNode, source.position, avoidExistingPaths, gridExistingPaths);

  const endingNode = grid.getNodeAt(endGrid.x, endGrid.y);
  guaranteeWalkablePath(grid, endingNode, target.position, avoidExistingPaths, gridExistingPaths);

  // Get the next closest points for pathfinding
  const start = getNextPointFromPosition(startingNode, source.position);
  const end = getNextPointFromPosition(endingNode, target.position);

  return { grid, start, end };
};
