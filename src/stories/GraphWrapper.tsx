import React from 'react';
import { ReactFlow, type ReactFlowProps } from '@xyflow/react';

const style = {
  background: '#fafafa',
  width: '100%',
  height: '500px',
};

export const GraphWrapper = (args: ReactFlowProps) => (
  <div style={style}>
    <ReactFlow {...args} />
  </div>
);
