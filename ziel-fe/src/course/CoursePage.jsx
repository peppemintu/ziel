import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Tab, Tabs, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Chip, Switch, FormControlLabel, Alert, Snackbar, Card, CardContent
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Upload as UploadIcon,
  Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon,
  DragIndicator as DragIcon, School as LectureIcon, Science as LabIcon,
  Assignment as PracticeIcon, Quiz as AttestationIcon
} from '@mui/icons-material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Position } from '@xyflow/react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '@xyflow/react/dist/style.css';

const API_BASE = 'http://localhost:8080/api';
const USER_ROLE = 'teacher'; // or 'student'
const USER_ID = 1;

const ELEMENT_TYPES = {
  LECTURE: 'LECTURE', LABWORK: 'LABWORK', PRACTICE: 'PRACTICE', ATTESTATION: 'ATTESTATION'
};

const ATTESTATION_FORMS = {
  EXAM: 'EXAM', CREDIT: 'CREDIT', QUESTIONING: 'QUESTIONING', REPORT: 'REPORT'
};

const PROGRESS_STATUS = {
  NOT_STARTED: 'NOT_STARTED', IN_PROGRESS: 'IN_PROGRESS', ACCEPTED: 'ACCEPTED',
  NEEDS_CHANGES: 'NEEDS_CHANGES', OVERDUE: 'OVERDUE'
};

const STATUS_COLORS = {
  NOT_STARTED: '#9e9e9e', IN_PROGRESS: '#ff9800', ACCEPTED: '#4caf50',
  NEEDS_CHANGES: '#f44336', OVERDUE: '#d32f2f'
};

const getElementIcon = (type) => {
  const icons = { LECTURE: LectureIcon, LABWORK: LabIcon, PRACTICE: PracticeIcon, ATTESTATION: AttestationIcon };
  const Icon = icons[type] || LectureIcon;
  return <Icon />;
};

const getStatusColor = (status) => STATUS_COLORS[status] || STATUS_COLORS.NOT_STARTED;

// Simplified form dialog component
const ElementFormDialog = ({ open, onClose, onSave, element = null }) => {
  const [formData, setFormData] = useState({
    hours: 0, elementType: 'LECTURE', attestationForm: 'EXAM', published: true
  });

  useEffect(() => {
    if (element) {
      setFormData({
        hours: element.hours || 0,
        elementType: element.elementType || 'LECTURE',
        attestationForm: element.attestationForm || 'EXAM',
        published: element.published !== false
      });
    } else {
      setFormData({ hours: 0, elementType: 'LECTURE', attestationForm: 'EXAM', published: true });
    }
  }, [element, open]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{element ? 'Edit Element' : 'Add Element'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Hours" type="number" value={formData.hours} fullWidth required
            onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })}
            inputProps={{ min: 0 }}
          />
          <FormControl fullWidth>
            <InputLabel>Element Type</InputLabel>
            <Select
              value={formData.elementType} label="Element Type"
              onChange={(e) => setFormData({ ...formData, elementType: e.target.value })}
            >
              {Object.keys(ELEMENT_TYPES).map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Attestation Form</InputLabel>
            <Select
              value={formData.attestationForm} label="Attestation Form"
              onChange={(e) => setFormData({ ...formData, attestationForm: e.target.value })}
            >
              {Object.keys(ATTESTATION_FORMS).map(form => (
                <MenuItem key={form} value={form}>{form}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
            }
            label="Published"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {element ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Simplified file upload dialog
const FileUploadDialog = ({ open, onClose, onUpload, elementId }) => {
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');

  const handleUpload = () => {
    if (file) {
      onUpload(elementId, file, comment);
      setFile(null);
      setComment('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Work</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <TextField
            label="Comment" value={comment} onChange={(e) => setComment(e.target.value)}
            fullWidth multiline rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpload} variant="contained" disabled={!file}>Upload</Button>
      </DialogActions>
    </Dialog>
  );
};

// Add this helper function to build the nested structure
const buildNestedStructure = (elements, relationships) => {
  // Create a map of element IDs to elements for quick lookup
  const elementMap = new Map(elements.map(el => [el.id, { ...el, children: [] }]));

  // Create a map of child to parent relationships
  const childToParent = new Map();
  relationships.forEach(rel => {
    childToParent.set(rel.targetElementId, rel.sourceElementId);
  });

  // Build the hierarchy
  const rootElements = [];

  elementMap.forEach((element, elementId) => {
    const parentId = childToParent.get(elementId);

    if (parentId && elementMap.has(parentId)) {
      // This element has a parent
      const parent = elementMap.get(parentId);
      parent.children.push(element);
      element.level = (parent.level || 0) + 1;
    } else {
      // This is a root element
      element.level = 0;
      rootElements.push(element);
    }
  });

  // Flatten the tree into a display order
  const flattenTree = (nodes, result = []) => {
    nodes.forEach(node => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        // Sort children by some criteria (e.g., hours, type, or creation order)
        const sortedChildren = [...node.children].sort((a, b) => {
          // You can customize this sorting logic
          if (a.elementType !== b.elementType) {
            const typeOrder = { 'LECTURE': 1, 'PRACTICE': 2, 'LABWORK': 3, 'ATTESTATION': 4 };
            return (typeOrder[a.elementType] || 5) - (typeOrder[b.elementType] || 5);
          }
          return a.hours - b.hours;
        });
        flattenTree(sortedChildren, result);
      }
    });
    return result;
  };

  // Sort root elements
  const sortedRoots = rootElements.sort((a, b) => {
    if (a.elementType !== b.elementType) {
      const typeOrder = { 'LECTURE': 1, 'PRACTICE': 2, 'LABWORK': 3, 'ATTESTATION': 4 };
      return (typeOrder[a.elementType] || 5) - (typeOrder[b.elementType] || 5);
    }
    return a.hours - b.hours;
  });

  return flattenTree(sortedRoots);
};

// Update the SortableTableRow component to show nested structure better
const SortableTableRow = ({ element, index, userRole, onEdit, onDelete, onUpload, onToggleCollapse, isCollapsed }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: element.id,
    disabled: userRole !== 'teacher'
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const status = element.progressStatus || 'NOT_STARTED';
  const level = element.level || 0;
  const hasChildren = element.children && element.children.length > 0;

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      sx={{
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
        backgroundColor: userRole === 'student' ? `${getStatusColor(status)}20` : 'inherit',
        // Add visual indication for different levels
        borderLeft: level > 0 ? `4px solid ${getStatusColor(status)}` : 'none',
      }}
    >
      <TableCell sx={{ paddingLeft: `${16 + level * 32}px` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {userRole === 'teacher' && (
            <Box {...attributes} {...listeners}>
              <DragIcon sx={{ color: 'action.disabled', cursor: 'grab' }} />
            </Box>
          )}

          {/* Collapse/Expand button for parent elements */}
          {hasChildren && (
            <IconButton
              size="small"
              onClick={() => onToggleCollapse(element.id)}
              sx={{ p: 0.5 }}
            >
              {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          )}

          {/* Connector lines for nested elements */}
          {level > 0 && (
            <Box sx={{
              width: 20,
              height: 20,
              borderLeft: '2px solid #ddd',
              borderBottom: '2px solid #ddd',
              marginRight: 1,
              borderBottomLeftRadius: 8
            }} />
          )}

          {getElementIcon(element.elementType)}
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              fontWeight: level === 0 ? 'bold' : 'normal',
              fontSize: level > 0 ? '0.875rem' : '1rem'
            }}
          >
            {element.elementType}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight={level === 0 ? 'bold' : 'normal'}
          sx={{ fontSize: level > 0 ? '0.875rem' : '1rem' }}
        >
          {element.hours} hours
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontSize: level > 0 ? '0.75rem' : '0.875rem' }}
        >
          {element.attestationForm}
        </Typography>
      </TableCell>
      <TableCell>
        {userRole === 'student' && element.grade && (
          <Chip
            label={`Grade: ${element.grade}`}
            size={level > 0 ? "small" : "medium"}
            color={element.grade >= 60 ? "success" : "error"}
          />
        )}
      </TableCell>
      {userRole === 'student' && (
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: level > 0 ? 8 : 12,
                height: level > 0 ? 8 : 12,
                borderRadius: '50%',
                backgroundColor: getStatusColor(status)
              }}
            />
            <Typography
              variant="body2"
              sx={{
                textTransform: 'capitalize',
                fontSize: level > 0 ? '0.75rem' : '0.875rem'
              }}
            >
              {status.replace('_', ' ').toLowerCase()}
            </Typography>
          </Box>
        </TableCell>
      )}
      <TableCell align="right">
        <Box sx={{ display: 'flex', gap: 1 }}>
          {userRole === 'teacher' && (
            <>
              <IconButton size="small" onClick={() => onEdit(element)}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(element.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton size="small">
                {element.published ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </>
          )}
          {userRole === 'student' && (element.elementType === 'LABWORK' || element.elementType === 'PRACTICE') && (
            <Button
              size="small"
              startIcon={<UploadIcon />}
              onClick={() => onUpload(element.id)}
              variant={level > 0 ? "text" : "outlined"}
            >
              Upload Work
            </Button>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

// Update the TableView component to use nested structure
const TableView = ({ elements, relationships, onElementAdd, onElementEdit, onElementDelete, onFileUpload, onRelationshipUpdate, userRole }) => {
  const [filterType, setFilterType] = useState('');
  const [editingElement, setEditingElement] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [nestedElements, setNestedElements] = useState([]);
  const [collapsedElements, setCollapsedElements] = useState(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Build nested structure and apply filters
  useEffect(() => {
    let nested = buildNestedStructure(elements, relationships);

    if (filterType) {
      // Filter while preserving hierarchy
      nested = nested.filter(el => {
        // Include element if it matches filter OR if any of its ancestors match
        const matchesFilter = el.elementType === filterType;
        const hasMatchingDescendant = hasDescendantOfType(el, filterType);
        return matchesFilter || hasMatchingDescendant;
      });
    }

    // Apply collapse/expand logic
    const visibleElements = [];
    const processElement = (element, parentCollapsed = false) => {
      if (!parentCollapsed) {
        visibleElements.push(element);
      }

      if (element.children && element.children.length > 0) {
        const isCollapsed = collapsedElements.has(element.id);
        element.children.forEach(child =>
          processElement(child, parentCollapsed || isCollapsed)
        );
      }
    };

    nested.filter(el => el.level === 0).forEach(el => processElement(el));
    setNestedElements(visibleElements);
  }, [elements, relationships, filterType, collapsedElements]);

  // Helper function to check if element has descendant of specific type
  const hasDescendantOfType = (element, type) => {
    if (!element.children) return false;
    return element.children.some(child =>
      child.elementType === type || hasDescendantOfType(child, type)
    );
  };

  const handleToggleCollapse = (elementId) => {
    setCollapsedElements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(elementId)) {
        newSet.delete(elementId);
      } else {
        newSet.add(elementId);
      }
      return newSet;
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id || userRole !== 'teacher') return;

    const activeElement = nestedElements.find(el => el.id === active.id);
    const overElement = nestedElements.find(el => el.id === over.id);

    if (!activeElement || !overElement) return;

    // Prevent dropping parent onto its own descendant
    const isDescendant = (parent, child) => {
      if (!parent.children) return false;
      return parent.children.some(c => c.id === child.id || isDescendant(c, child));
    };

    if (isDescendant(activeElement, overElement)) {
      return; // Invalid drop
    }

    // Update relationship
    onRelationshipUpdate(over.id, active.id);
  };

  const handleElementSave = (formData) => {
    if (editingElement) {
      onElementEdit({ ...editingElement, ...formData });
    } else {
      onElementAdd(formData);
    }
    setEditingElement(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Course Elements</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Filter">
              <MenuItem value="">All Types</MenuItem>
              {Object.keys(ELEMENT_TYPES).map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setCollapsedElements(new Set())}
          >
            Expand All
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              const allParents = elements.filter(el =>
                relationships.some(rel => rel.sourceElementId === el.id)
              );
              setCollapsedElements(new Set(allParents.map(el => el.id)));
            }}
          >
            Collapse All
          </Button>
          {userRole === 'teacher' && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)}>
              Add Element
            </Button>
          )}
        </Box>
      </Box>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Attestation Form</TableCell>
                <TableCell>Grade</TableCell>
                {userRole === 'student' && <TableCell>Status</TableCell>}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <SortableContext items={nestedElements.map(el => el.id)} strategy={verticalListSortingStrategy}>
                {nestedElements.map((element, index) => (
                  <SortableTableRow
                    key={element.id}
                    element={element}
                    index={index}
                    userRole={userRole}
                    onEdit={setEditingElement}
                    onDelete={onElementDelete}
                    onUpload={(elementId) => {
                      setSelectedElementId(elementId);
                      setUploadDialogOpen(true);
                    }}
                    onToggleCollapse={handleToggleCollapse}
                    isCollapsed={collapsedElements.has(element.id)}
                  />
                ))}
              </SortableContext>
            </TableBody>
          </Table>
        </TableContainer>
      </DndContext>

      <ElementFormDialog
        open={addDialogOpen || !!editingElement}
        onClose={() => { setAddDialogOpen(false); setEditingElement(null); }}
        onSave={handleElementSave}
        element={editingElement}
      />

      <FileUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={onFileUpload}
        elementId={selectedElementId}
      />
    </Box>
  );
};

// Simplified roadmap view
const RoadmapView = ({ elements, relationships, onConnectionCreate, userRole }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const createNodesAndEdges = useCallback(() => {
    const nodeElements = elements.map((element, index) => {
      const status = element.progressStatus || 'NOT_STARTED';
      return {
        id: element.id.toString(),
        type: 'default',
        position: { x: (index % 4) * 250, y: Math.floor(index / 4) * 150 },
        data: {
          label: (
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                {getElementIcon(element.elementType)}
              </Box>
              <Typography variant="body2" fontWeight="bold">{element.hours} hours</Typography>
              <Typography variant="caption" color="textSecondary">{element.elementType}</Typography>
              <Typography variant="caption" display="block" color="textSecondary">
                {element.attestationForm}
              </Typography>
            </Box>
          )
        },
        style: {
          backgroundColor: userRole === 'student' ? `${getStatusColor(status)}40` : '#ffffff',
          border: `2px solid ${userRole === 'student' ? getStatusColor(status) : '#e0e0e0'}`,
          borderRadius: 8, width: 200, height: 120
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      };
    });

    const edgeElements = relationships.map((rel, index) => ({
      id: `edge-${index}`,
      source: rel.sourceElementId.toString(),
      target: rel.targetElementId.toString(),
      type: 'smoothstep',
      animated: userRole === 'student',
      style: { stroke: '#666' }
    }));

    setNodes(nodeElements);
    setEdges(edgeElements);
  }, [elements, relationships, userRole, setNodes, setEdges]);

  useEffect(() => {
    createNodesAndEdges();
  }, [createNodesAndEdges]);

  const onConnect = useCallback((params) => {
    if (userRole === 'teacher') {
      const newEdge = { ...params, type: 'smoothstep', animated: false, style: { stroke: '#666' } };
      setEdges((eds) => addEdge(newEdge, eds));
      onConnectionCreate(parseInt(params.source), parseInt(params.target));
    }
  }, [setEdges, onConnectionCreate, userRole]);

  return (
    <Box>
      <Box sx={{ height: '600px', border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <ReactFlow
          nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onConnect={onConnect} nodesDraggable={userRole === 'teacher'}
          nodesConnectable={userRole === 'teacher'} elementsSelectable={true}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </Box>

      {userRole === 'student' && (
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: color, borderRadius: '50%' }} />
              <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                {status.replace('_', ' ').toLowerCase()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

// Custom hook for API operations
const useApi = (courseId, userRole) => {
  const [data, setData] = useState({
    course: null, studyPlan: null, elements: [], relationships: [], progress: []
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const courseRes = await fetch(`${API_BASE}/course/${courseId}`);
      const courseData = await courseRes.json();

      const fetchPromises = [
        fetch(`${API_BASE}/element?courseId=${courseId}`),
        fetch(`${API_BASE}/relationship?courseId=${courseId}`)
      ];

      if (courseData.studyPlanId) {
        fetchPromises.push(fetch(`${API_BASE}/plan/${courseData.studyPlanId}`));
      }

      if (userRole === 'student') {
        fetchPromises.push(fetch(`${API_BASE}/progress?courseId=${courseId}&studentId=${USER_ID}`));
      }

      const responses = await Promise.all(fetchPromises);
      const elementsData = await responses[0].json();
      const relationshipsData = await responses[1].json();
      let studyPlanData = null;
      let progressData = [];

      if (courseData.studyPlanId && responses[2]) {
        studyPlanData = await responses[2].json();
      }

      if (userRole === 'student') {
        const progressResponseIndex = courseData.studyPlanId ? 3 : 2;
        if (responses[progressResponseIndex]) {
          progressData = await responses[progressResponseIndex].json();
        }
      }

      const elementsWithProgress = elementsData.map(element => {
        const elementProgress = progressData.find(p => p.elementId === element.id);
        return {
          ...element,
          progressStatus: elementProgress?.status || 'NOT_STARTED',
          grade: elementProgress?.grade || null
        };
      });

      setData({
        course: courseData,
        studyPlan: studyPlanData,
        elements: elementsWithProgress,
        relationships: relationshipsData,
        progress: progressData
      });
    } catch (error) {
      console.error('Error fetching course data:', error);
      showSnackbar('Error loading course data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(`${API_BASE}${url}`, options);
      if (response.ok) {
        fetchData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('API call error:', error);
      return false;
    }
  };

  const handleElementAdd = async (formData) => {
    const success = await apiCall('/element', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, courseId: parseInt(courseId) })
    });
    showSnackbar(success ? 'Element added successfully' : 'Error adding element', success ? 'success' : 'error');
  };

  const handleElementEdit = async (updatedElement) => {
    const success = await apiCall(`/element/${updatedElement.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedElement)
    });
    showSnackbar(success ? 'Element updated successfully' : 'Error updating element', success ? 'success' : 'error');
  };

  const handleElementDelete = async (elementId) => {
    const success = await apiCall(`/element/${elementId}`, { method: 'DELETE' });
    showSnackbar(success ? 'Element deleted successfully' : 'Error deleting element', success ? 'success' : 'error');
  };

  const handleFileUpload = async (elementId, file, comment) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('comment', comment);
    formData.append('elementId', elementId);
    formData.append('studentId', USER_ID);

    const success = await apiCall('/upload', { method: 'POST', body: formData });
    showSnackbar(success ? 'File uploaded successfully' : 'Error uploading file', success ? 'success' : 'error');
  };

  const handleConnectionCreate = async (sourceElementId, targetElementId) => {
    const success = await apiCall('/relationship', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceElementId, targetElementId, courseId: parseInt(courseId) })
    });
    showSnackbar(success ? 'Connection created successfully' : 'Error creating connection', success ? 'success' : 'error');
  };

  const handleRelationshipUpdate = async (parentElementId, childElementId) => {
    try {
      // Remove existing relationships for the child
      const existingRelationships = data.relationships.filter(rel => rel.targetElementId === childElementId);
      for (const rel of existingRelationships) {
        await fetch(`${API_BASE}/relationship/${rel.id}`, { method: 'DELETE' });
      }

      // Create new relationship
      const success = await apiCall('/relationship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceElementId: parentElementId, targetElementId: childElementId, courseId: parseInt(courseId) })
      });
      showSnackbar(success ? 'Element hierarchy updated successfully' : 'Error updating element hierarchy', success ? 'success' : 'error');
    } catch (error) {
      console.error('Error updating relationship:', error);
      showSnackbar('Error updating element hierarchy', 'error');
    }
  };

  return {
    data,
    loading,
    snackbar,
    showSnackbar,
    setSnackbar,
    fetchData,
    handleElementAdd,
    handleElementEdit,
    handleElementDelete,
    handleFileUpload,
    handleConnectionCreate,
    handleRelationshipUpdate
  };
};

// Main component
export default function CoursePage() {
  const { id: courseId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const userRole = USER_ROLE;

  const {
    data: { course, studyPlan, elements, relationships },
    loading,
    snackbar,
    setSnackbar,
    fetchData,
    handleElementAdd,
    handleElementEdit,
    handleElementDelete,
    handleFileUpload,
    handleConnectionCreate,
    handleRelationshipUpdate
  } = useApi(courseId, userRole);

  useEffect(() => {
    fetchData();
  }, [courseId, userRole]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading course...</Typography>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Course not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Course {course.id}</Typography>
          {studyPlan && (
            <>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Study Year {studyPlan.studyYear} - Semester {studyPlan.semester}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                <Chip label={`${studyPlan.totalHours} Total Hours`} />
                <Chip label={`${studyPlan.creditUnits} Credits`} />
                <Chip label={`${studyPlan.totalAuditoryHours} Auditory Hours`} />
                <Chip label={`${studyPlan.lectureHours} Lecture Hours`} />
                <Chip label={`${studyPlan.practiceHours} Practice Hours`} />
                <Chip label={`${studyPlan.labHours} Lab Hours`} />
                <Chip label={studyPlan.attestationForm} color="primary" />
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Table View" />
          <Tab label="Roadmap View" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <TableView
            elements={elements}
            relationships={relationships}
            onElementAdd={handleElementAdd}
            onElementEdit={handleElementEdit}
            onElementDelete={handleElementDelete}
            onFileUpload={handleFileUpload}
            onRelationshipUpdate={handleRelationshipUpdate}
            userRole={userRole}
          />
        )}
        {activeTab === 1 && (
          <RoadmapView
            elements={elements}
            relationships={relationships}
            onConnectionCreate={handleConnectionCreate}
            userRole={userRole}
          />
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}