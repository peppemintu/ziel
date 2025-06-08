import React, { useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ElementIcon from '../common/ElementIcon';
import RoadmapLegend from './RoadmapLegend';
import StatusLegend from './StatusLegend';
import { getStatusColor } from '../../utils/statusUtils';

const RoadmapView = ({ elements, relationships, onConnectionCreate, onElementClick, userRole }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const createNodesAndEdges = useCallback(() => {
    // Separate elements by type
    const lectures = elements.filter(el => el.elementType === 'LECTURE');
    const attestations = elements.filter(el => el.elementType === 'ATTESTATION');
    const practices = elements.filter(el => el.elementType === 'PRACTICE');
    const labworks = elements.filter(el => el.elementType === 'LABWORK');

    // Sort each type by hours or another logical order
    const sortByHours = (a, b) => a.hours - b.hours;
    lectures.sort(sortByHours);
    attestations.sort(sortByHours);
    practices.sort(sortByHours);
    labworks.sort(sortByHours);

    // Calculate positions
    const nodeSpacing = 330; // Horizontal spacing between nodes
    const verticalSpacing = 180; // Vertical spacing between rows
    const centerY = 300; // Center line for lectures and attestations
    const practiceY = centerY - verticalSpacing; // Practices go above center
    const labworkY = centerY + verticalSpacing; // Labworks go below center

    const nodeElements = [];
    let currentX = 50; // Starting X position

    // Create a combined sequence of lectures and attestations for the main horizontal line
    const mainSequence = [];

    // Interleave lectures and attestations based on logical flow
    let lectureIndex = 0;
    let attestationIndex = 0;

    while (lectureIndex < lectures.length || attestationIndex < attestations.length) {
      // Add lectures first (usually come before assessments)
      if (lectureIndex < lectures.length) {
        mainSequence.push(lectures[lectureIndex]);
        lectureIndex++;
      }

      // Add attestation after every 2-3 lectures, or at the end
      if (attestationIndex < attestations.length &&
          (lectureIndex % 3 === 0 || lectureIndex >= lectures.length)) {
        mainSequence.push(attestations[attestationIndex]);
        attestationIndex++;
      }
    }

    // Position main sequence (lectures and attestations) horizontally
    mainSequence.forEach((element, index) => {
      const status = element.progressStatus || 'NOT_STARTED';
      nodeElements.push({
        id: element.id.toString(),
        type: 'default',
        position: { x: currentX + (index * nodeSpacing), y: centerY },
        data: {
          label: (
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <ElementIcon type={element.elementType} />
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {element.hours} hours
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {element.elementType}
              </Typography>
              <Typography variant="caption" display="block" color="textSecondary">
                {element.attestationForm}
              </Typography>
            </Box>
          )
        },
        style: {
          backgroundColor: userRole === 'STUDENT' ? `${getStatusColor(status)}40` : '#ffffff',
          border: `2px solid ${userRole === 'STUDENT' ? getStatusColor(status) : '#e0e0e0'}`,
          borderRadius: 8,
          width: 200,
          height: 120
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      });
    });

    // Position practices above the main line
    practices.forEach((element, index) => {
      const status = element.progressStatus || 'NOT_STARTED';

      // Find the best X position based on related lectures/attestations
      let xPosition = currentX + (index * nodeSpacing);

      // Try to align with related elements if relationships exist
      const relatedElement = relationships.find(rel =>
        rel.targetElementId === element.id || rel.sourceElementId === element.id
      );

      if (relatedElement) {
        const relatedNode = nodeElements.find(node =>
          node.id === relatedElement.sourceElementId.toString() ||
          node.id === relatedElement.targetElementId.toString()
        );
        if (relatedNode) {
          xPosition = relatedNode.position.x;
        }
      }

      nodeElements.push({
        id: element.id.toString(),
        type: 'default',
        position: { x: xPosition, y: practiceY },
        data: {
          label: (
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <ElementIcon type={element.elementType} />
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {element.hours} hours
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {element.elementType}
              </Typography>
              <Typography variant="caption" display="block" color="textSecondary">
                {element.attestationForm}
              </Typography>
            </Box>
          )
        },
        style: {
          backgroundColor: userRole === 'STUDENT' ? `${getStatusColor(status)}40` : '#ffffff',
          border: `2px solid ${userRole === 'STUDENT' ? getStatusColor(status) : '#e0e0e0'}`,
          borderRadius: 8,
          width: 200,
          height: 120
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      });
    });

    // Position labworks below the main line
    labworks.forEach((element, index) => {
      const status = element.progressStatus || 'NOT_STARTED';

      // Find the best X position based on related lectures/attestations
      let xPosition = currentX + (index * nodeSpacing);

      // Try to align with related elements if relationships exist
      const relatedElement = relationships.find(rel =>
        rel.targetElementId === element.id || rel.sourceElementId === element.id
      );

      if (relatedElement) {
        const relatedNode = nodeElements.find(node =>
          node.id === relatedElement.sourceElementId.toString() ||
          node.id === relatedElement.targetElementId.toString()
        );
        if (relatedNode) {
          xPosition = relatedNode.position.x;
        }
      }

      nodeElements.push({
        id: element.id.toString(),
        type: 'default',
        position: { x: xPosition, y: labworkY },
        data: {
          label: (
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <ElementIcon type={element.elementType} />
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {element.hours} hours
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {element.elementType}
              </Typography>
              <Typography variant="caption" display="block" color="textSecondary">
                {element.attestationForm}
              </Typography>
            </Box>
          )
        },
        style: {
          backgroundColor: userRole === 'STUDENT' ? `${getStatusColor(status)}40` : '#ffffff',
          border: `2px solid ${userRole === 'STUDENT' ? getStatusColor(status) : '#e0e0e0'}`,
          borderRadius: 8,
          width: 200,
          height: 120
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      });
    });

    // Adjust positions to prevent overlaps
    const adjustOverlaps = (nodes) => {
      const positionMap = new Map();

      nodes.forEach(node => {
        const key = `${node.position.x},${node.position.y}`;
        if (!positionMap.has(key)) {
          positionMap.set(key, []);
        }
        positionMap.get(key).push(node);
      });

      // Adjust overlapping nodes
      positionMap.forEach((overlappingNodes, position) => {
        if (overlappingNodes.length > 1) {
          overlappingNodes.forEach((node, index) => {
            if (index > 0) {
              // Offset overlapping nodes slightly
              node.position.x += (index * 220);
            }
          });
        }
      });

      return nodes;
    };

    const adjustedNodes = adjustOverlaps(nodeElements);

    // Create edges with better positioning
    const edgeElements = relationships.map((rel, index) => {
      const sourceNode = adjustedNodes.find(node => node.id === rel.sourceElementId.toString());
      const targetNode = adjustedNodes.find(node => node.id === rel.targetElementId.toString());

      let edgeType = 'smoothstep';
      let edgeStyle = { stroke: '#666', strokeWidth: 2 };

      // Different styling based on relationship type
      if (sourceNode && targetNode) {
        // Vertical connections (between different rows)
        if (Math.abs(sourceNode.position.y - targetNode.position.y) > 100) {
          edgeStyle.stroke = '#ff9800';
          edgeStyle.strokeDasharray = '5,5';
        }
        // Horizontal connections (same row)
        else {
          edgeStyle.stroke = '#2196f3';
        }
      }

      return {
        id: `edge-${index}`,
        source: rel.sourceElementId.toString(),
        target: rel.targetElementId.toString(),
        type: edgeType,
        animated: userRole === 'STUDENT',
        style: edgeStyle
      };
    });

    setNodes(adjustedNodes);
    setEdges(edgeElements);
  }, [elements, relationships, userRole, setNodes, setEdges]);

  useEffect(() => {
    createNodesAndEdges();
  }, [createNodesAndEdges]);

  const onConnect = useCallback((params) => {
    if (userRole === 'TEACHER') {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#666', strokeWidth: 2 }
      };
      setEdges((eds) => addEdge(newEdge, eds));
      onConnectionCreate(parseInt(params.source), parseInt(params.target));
    }
  }, [setEdges, onConnectionCreate, userRole]);

  const onNodeClick = useCallback((event, node) => {
    const elementId = parseInt(node.id);
    const element = elements.find(el => el.id === elementId);
    if (element && onElementClick) {
      onElementClick(element);
    }
  }, [elements, onElementClick]);

  return (
    <Box>
      <RoadmapLegend />

      <Box sx={{ height: '600px', border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodesDraggable={userRole === 'TEACHER'}
          nodesConnectable={userRole === 'TEACHER'}
          elementsSelectable={true}
          fitView
          fitViewOptions={{
            padding: 0.1,
            includeHiddenNodes: false,
          }}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </Box>

      <StatusLegend userRole={userRole} />
    </Box>
  );
};

export default RoadmapView;