import type { Position, XYPosition } from '@xyflow/react';
import type { Grid } from 'pathfinding';

type Direction = 'top' | 'bottom' | 'left' | 'right';

export const getNextPointFromPosition = (point: XYPosition, position: Direction): XYPosition => {
  switch (position) {
    case 'top':
      return { x: point.x, y: point.y - 1 };
    case 'bottom':
      return { x: point.x, y: point.y + 1 };
    case 'left':
      return { x: point.x - 1, y: point.y };
    case 'right':
      return { x: point.x + 1, y: point.y };
  }
};

/**
 * Guarantee that the path is walkable, even if the point is inside a non-walkable area,
 * by adding a walkable path in the direction of the point's position.
 * If `avoidExistingPaths` is enabled, ensure that the path avoids existing paths.
 */
export const guaranteeWalkablePath = (
  grid: Grid,
  point: XYPosition,
  position: Position,
  avoidExistingPaths: boolean,
  existingPaths: XYPosition[][] = []
) => {
  let node = grid.getNodeAt(point.x, point.y);

  while (!node.walkable) {
    // If avoiding existing paths, ensure the current node is not part of any existing path
    if (avoidExistingPaths) {
      const isOnExistingPath = existingPaths.some((path) =>
        path.some((existingPoint) => {
          const dx = Math.abs(existingPoint.x - node.x);
          const dy = Math.abs(existingPoint.y - node.y);
          return dx <= 1 && dy <= 1; // Check within padding of 1
        })
      );

      // Debugging: Log the comparison details
      console.log(
        'Checking node against existing paths:',
        { nodeX: node.x, nodeY: node.y },
        { isOnExistingPath },
        { existingPaths }
      );

      if (isOnExistingPath) {
        const next = getNextPointFromPosition(node, position);
        node = grid.getNodeAt(next.x, next.y);
        continue;
      }
    }

    // Mark the current node as walkable
    grid.setWalkableAt(node.x, node.y, true);

    // Move to the next point in the specified direction
    const next = getNextPointFromPosition(node, position);
    node = grid.getNodeAt(next.x, next.y);
  }
};
