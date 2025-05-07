import { Edge, XYPosition } from '@xyflow/react';

export const round = (x: number, multiple = 10) => Math.round(x / multiple) * multiple;

export const roundDown = (x: number, multiple = 10) => Math.floor(x / multiple) * multiple;

export const roundUp = (x: number, multiple = 10) => Math.ceil(x / multiple) * multiple;

export const toInteger = (value: number, min = 0) => {
  let result = Math.max(Math.round(value), min);
  result = Number.isInteger(result) ? result : min;
  result = result >= min ? result : min;
  return result;
};

export const extractExistingPaths = (edges: Edge[]): XYPosition[][] => {
  return edges
    .map((edge) => {
      if (!(edge as any).path) {
        console.warn(`Edge with ID ${edge.id} is missing a path.`);
      }
      return (edge as any).path || [];
    })
    .filter((path) => path.length > 0); // Filter out empty paths
};
