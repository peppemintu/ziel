import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableContainer, TableHead, TableRow, Paper,
  TableCell
} from '@mui/material';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTableRow from './SortableTableRow';
import TableControls from './TableControls';
import ElementFormDialog from '../dialogs/ElementFormDialog';
import FileUploadDialog from '../dialogs/FileUploadDialog';
import { buildNestedStructure, hasDescendantOfType } from '../../utils/hierarchyUtils';

const TableView = ({
  elements,
  relationships,
  onElementAdd,
  onElementEdit,
  onElementDelete,
  onFileUpload,
  onRelationshipUpdate,
  onElementClick,
  userRole
}) => {
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
      nested = nested.filter(el => {
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

  const handleExpandAll = () => {
    setCollapsedElements(new Set());
  };

  const handleCollapseAll = () => {
    const allParents = elements.filter(el =>
      relationships.some(rel => rel.sourceElementId === el.id)
    );
    setCollapsedElements(new Set(allParents.map(el => el.id)));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id || userRole !== 'TEACHER') return;

    const activeElement = nestedElements.find(el => el.id === active.id);
    const overElement = nestedElements.find(el => el.id === over.id);

    if (!activeElement || !overElement) return;

    // Prevent dropping parent onto its own descendant
    const isDescendant = (parent, child) => {
      if (!parent.children) return false;
      return parent.children.some(c => c.id === child.id || isDescendant(c, child));
    };

    if (isDescendant(activeElement, overElement)) {
      return;
    }

    // Prevent lecture-to-lecture or lecture-to-attestation relationships
    if (overElement.elementType === 'LECTURE' && activeElement.elementType === 'LECTURE') {
      console.warn('Cannot create lecture-to-lecture relationship');
      return;
    }

    if (overElement.elementType === 'LECTURE' && activeElement.elementType === 'ATTESTATION') {
      console.warn('Cannot create lecture-to-attestation relationship');
      return;
    }

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

  const handleUploadOpen = (elementId) => {
    setSelectedElementId(elementId);
    setUploadDialogOpen(true);
  };

  return (
    <Box>
      <TableControls
        filterType={filterType}
        onFilterChange={setFilterType}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onAddElement={() => setAddDialogOpen(true)}
        userRole={userRole}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Attestation Form</TableCell>
                <TableCell>Grade</TableCell>
                {userRole === 'STUDENT' && <TableCell>Status</TableCell>}
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
                    onUpload={handleUploadOpen}
                    onToggleCollapse={handleToggleCollapse}
                    onElementClick={onElementClick}
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
        onClose={() => {
          setAddDialogOpen(false);
          setEditingElement(null);
        }}
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

export default TableView;