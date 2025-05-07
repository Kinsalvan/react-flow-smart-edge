import React from 'react';
import type { Meta, Story } from '@storybook/react';
import type { EdgeTypes, ReactFlowProps } from '@xyflow/react';
import { SmartBezierEdge } from '../SmartBezierEdge';
import { SmartStepEdge } from '../SmartStepEdge';
import { SmartStraightEdge } from '../SmartStraightEdge';
import { SmartEdgeCustomLabel } from './CustomLabel';
import { edgesBezier, edgesLabel, edgesStep, edgesStraight, nodes } from './DummyData';
import { GraphWrapper } from './GraphWrapper';

const edgeTypes: EdgeTypes = {
  smartBezier: (props) => (
    <SmartBezierEdge
      {...props}
      data={{
        ...props.data,
        options: { avoidExistingPaths: true },
        fallback: SmartBezierEdge,
      }}
    />
  ),
  smartStraight: (props) => (
    <SmartStraightEdge {...props} data={{ ...props.data, options: { avoidExistingPaths: true } }} />
  ),
  smartStep: (props) => (
    <SmartStepEdge {...props} data={{ ...props.data, options: { avoidExistingPaths: true } }} />
  ),
  smartBezierLabel: (props) => (
    <SmartEdgeCustomLabel
      {...props}
      data={{ ...props.data, options: { avoidExistingPaths: true } }}
    />
  ),
};

export default {
  title: 'Smart Edge',
  component: GraphWrapper,
} as Meta;

const Template: Story<ReactFlowProps> = (args) => <GraphWrapper {...args} />;

export const SmartBezier = Template.bind({});
SmartBezier.args = {
  edgeTypes,
  defaultNodes: nodes,
  defaultEdges: edgesBezier,
};

export const SmartStraight = Template.bind({});
SmartStraight.args = {
  ...SmartBezier.args,
  defaultEdges: edgesStraight,
};

export const SmartStep = Template.bind({});
SmartStep.args = {
  ...SmartBezier.args,
  defaultEdges: edgesStep,
};

export const SmartBezierWithCustomLabel = Template.bind({});
SmartBezierWithCustomLabel.args = {
  ...SmartBezier.args,
  defaultEdges: edgesLabel,
};
