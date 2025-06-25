import React from 'react';
import {
  TableRow, TableCell, Box, Typography, IconButton, Chip, Button
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, Upload as UploadIcon,
  Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon,
  DragIndicator as DragIcon, ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ElementIcon from '../common/ElementIcon';
import StatusChip from '../common/StatusChip';
import { getStatusColor } from '../../utils/statusUtils';

import { ELEMENT_TYPES_LABELS, ATTESTATION_FORMS_LABELS } from '../../utils/translations.js';

const SortableTableRow = ({
  element,
  index,
  userRole,
  onEdit,
  onDelete,
  onUpload,
  onToggleCollapse,
  onElementClick,
  isCollapsed
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: element.id,
    disabled: userRole !== 'TEACHER'
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const status = element.progressStatus || 'NOT_STARTED';
  const level = element.level || 0;
  const hasChildren = element.children && element.children.length > 0;

  const handleRowClick = (event) => {
    if (event.target.closest('button') || event.target.closest('[role="button"]')) {
      return;
    }
    if (onElementClick) {
      onElementClick(element);
    }
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      onClick={handleRowClick}
      sx={{
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
        backgroundColor: userRole === 'STUDENT' ? `${getStatusColor(status)}20` : 'inherit',
        borderLeft: level > 0 ? `4px solid ${getStatusColor(status)}` : 'none',
        cursor: 'pointer',
      }}
    >
      <TableCell sx={{ paddingLeft: `${16 + level * 32}px` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {userRole === 'TEACHER' && (
            <Box {...attributes} {...listeners}>
              <DragIcon sx={{ color: 'action.disabled', cursor: 'grab' }} />
            </Box>
          )}

          {hasChildren && (
            <IconButton
              size="small"
              onClick={() => onToggleCollapse(element.id)}
              sx={{ p: 0.5 }}
            >
              {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          )}

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

          <ElementIcon type={element.elementType} />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              fontWeight: level === 0 ? 'bold' : 'normal',
              fontSize: level > 0 ? '0.875rem' : '1rem'
            }}
          >
            {ELEMENT_TYPES_LABELS[element.elementType] || element.elementType}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>
        <Typography
          variant="body1"
          fontWeight={level === 0 ? 'bold' : 'normal'}
          sx={{ fontSize: level > 0 ? '0.875rem' : '1rem' }}
        >
          {element.name || 'Без названия'}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography
          variant="body1"
          fontWeight={level === 0 ? 'bold' : 'normal'}
          sx={{ fontSize: level > 0 ? '0.875rem' : '1rem' }}
        >
          {element.hours} час{element.hours === 1 ? '' : (element.hours < 5 ? 'а' : 'ов')}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontSize: level > 0 ? '0.75rem' : '0.875rem' }}
        >
          {ATTESTATION_FORMS_LABELS[element.attestationForm] || element.attestationForm}
        </Typography>
      </TableCell>

      <TableCell>
        {userRole === 'STUDENT' && element.grade && (
          <Chip
            label={`Оценка: ${element.grade}`}
            size={level > 0 ? "small" : "medium"}
            color={element.grade >= 60 ? "success" : "error"}
          />
        )}
      </TableCell>

      {userRole === 'STUDENT' && (
        <TableCell>
          <StatusChip status={status} level={level} />
        </TableCell>
      )}

      <TableCell align="left">
        <Box sx={{ display: 'flex', gap: 1 }}>
          {userRole === 'TEACHER' && (
            <>
              <IconButton size="small" onClick={() => onEdit(element)}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(element.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default SortableTableRow;
